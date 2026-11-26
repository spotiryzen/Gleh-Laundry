import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const MAX_MESSAGE_LENGTH = 1000;
const MAX_SESSION_ID_LENGTH = 128;
const MAX_REPLY_LENGTH = 8000;
const WEBHOOK_TIMEOUT_MS = 45000;
const DEFAULT_N8N_WEBHOOK_URL = 'https://n8n-n8n.awzz6p.easypanel.host/webhook/gleh-chat';

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 30;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim().length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    if (rateLimitStore.size > 1000) {
      for (const [key, value] of rateLimitStore.entries()) {
        if (now > value.resetAt) {
          rateLimitStore.delete(key);
        }
      }
    }
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  entry.count += 1;
  return false;
}

function isBlockedHostname(hostname: string): boolean {
  const lower = hostname.toLowerCase().replace(/^\[|\]$/g, '');

  if (
    lower === 'localhost' ||
    lower === '0.0.0.0' ||
    lower === '::1' ||
    lower.endsWith('.local') ||
    lower.endsWith('.internal') ||
    lower.includes('your-n8n-instance')
  ) {
    return true;
  }

  // Block IPv4 loopback, private, and link-local metadata ranges
  const ipv4Match = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(lower);
  if (ipv4Match) {
    const a = Number(ipv4Match[1]);
    const b = Number(ipv4Match[2]);
    if (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168)
    ) {
      return true;
    }
  }

  // Block IPv6 unique local / link-local
  if (lower.startsWith('fc') || lower.startsWith('fd') || lower.startsWith('fe80:')) {
    return true;
  }

  return false;
}

function getValidatedWebhookUrl(): string | null {
  const envUrl = process.env.N8N_WEBHOOK_URL?.trim();
  const raw = envUrl && !envUrl.toLowerCase().includes('your-n8n-instance')
    ? envUrl
    : DEFAULT_N8N_WEBHOOK_URL;

  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return null;
    }
    if (isBlockedHostname(parsed.hostname)) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

interface ChatRequestBody {
  message?: unknown;
  sessionId?: unknown;
}

interface N8nExpectedResponse {
  success?: unknown;
  reply?: unknown;
  output?: unknown;
  text?: unknown;
  response?: unknown;
  sessionId?: unknown;
}

function extractPlainTextReply(payload: unknown): string | null {
  if (typeof payload === 'string') {
    const trimmed = payload.trim();
    return trimmed ? trimmed.slice(0, MAX_REPLY_LENGTH) : null;
  }

  if (!payload || typeof payload !== 'object') {
    return null;
  }

  // Support standard object or single-element array returned by some n8n Respond to Webhook nodes
  const record = (Array.isArray(payload) ? payload[0] : payload) as N8nExpectedResponse | undefined;
  if (!record || typeof record !== 'object') {
    return null;
  }

  if (record.success === false) {
    return null;
  }

  const candidate =
    typeof record.reply === 'string'
      ? record.reply
      : typeof record.output === 'string'
        ? record.output
        : typeof record.text === 'string'
          ? record.text
          : typeof record.response === 'string'
            ? record.response
            : null;

  if (!candidate) {
    return null;
  }

  const trimmed = candidate.trim();
  if (!trimmed) {
    return null;
  }

  return trimmed.slice(0, MAX_REPLY_LENGTH);
}

async function startServer() {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '16kb' }));

  app.post('/api/chat', async (req: Request, res: Response) => {
    const clientIp = getClientIp(req);
    if (isRateLimited(clientIp)) {
      res.status(429).json({
        success: false,
        error: 'TOO_MANY_REQUESTS',
      });
      return;
    }

    const body = (req.body ?? {}) as ChatRequestBody;
    const rawMessage = typeof body.message === 'string' ? body.message.trim() : '';
    const rawSessionId = typeof body.sessionId === 'string' ? body.sessionId.trim() : '';

    if (!rawMessage) {
      res.status(400).json({
        success: false,
        error: 'EMPTY_MESSAGE',
      });
      return;
    }

    if (rawMessage.length > MAX_MESSAGE_LENGTH) {
      res.status(400).json({
        success: false,
        error: 'MESSAGE_TOO_LONG',
      });
      return;
    }

    const safeSessionId =
      rawSessionId &&
      rawSessionId.length <= MAX_SESSION_ID_LENGTH &&
      /^[a-zA-Z0-9_-]+$/.test(rawSessionId)
        ? rawSessionId
        : 'anonymous-session';

    const webhookUrl = getValidatedWebhookUrl();
    if (!webhookUrl) {
      res.status(503).json({
        success: false,
        error: 'WEBHOOK_NOT_CONFIGURED',
      });
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };

      const authHeaderName = process.env.N8N_WEBHOOK_AUTH_HEADER?.trim();
      const authHeaderToken = process.env.N8N_WEBHOOK_AUTH_TOKEN?.trim();
      if (
        authHeaderName &&
        authHeaderToken &&
        /^[A-Za-z0-9-]+$/.test(authHeaderName)
      ) {
        headers[authHeaderName] = authHeaderToken;
      }

      const upstream = await fetch(webhookUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: rawMessage,
          sessionId: safeSessionId,
        }),
        signal: controller.signal,
      });

      if (!upstream.ok) {
        res.status(502).json({
          success: false,
          error: 'UPSTREAM_ERROR',
        });
        return;
      }

      const rawText = await upstream.text();
      let upstreamData: unknown = rawText;
      try {
        upstreamData = JSON.parse(rawText);
      } catch {
        upstreamData = rawText;
      }

      const reply = extractPlainTextReply(upstreamData);
      if (!reply) {
        res.status(502).json({
          success: false,
          error: 'INVALID_REPLY_FORMAT',
        });
        return;
      }

      res.status(200).json({
        success: true,
        reply,
        sessionId: safeSessionId,
      });
    } catch (error) {
      const isTimeout = error instanceof Error && error.name === 'AbortError';
      res.status(isTimeout ? 504 : 502).json({
        success: false,
        error: isTimeout ? 'UPSTREAM_TIMEOUT' : 'UPSTREAM_UNREACHABLE',
      });
    } finally {
      clearTimeout(timeoutId);
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Gleh Laundry server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Gleh Laundry server:', err);
  process.exit(1);
});
