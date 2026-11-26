import type { IncomingMessage, ServerResponse } from 'node:http';

const MAX_MESSAGE_LENGTH = 1000;
const MAX_SESSION_ID_LENGTH = 128;
const MAX_REPLY_LENGTH = 8000;
const WEBHOOK_TIMEOUT_MS = 15000;

interface ChatRequestBody {
  message?: unknown;
  sessionId?: unknown;
}

interface N8nExpectedResponse {
  success?: unknown;
  reply?: unknown;
  sessionId?: unknown;
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

  if (lower.startsWith('fc') || lower.startsWith('fd') || lower.startsWith('fe80:')) {
    return true;
  }

  return false;
}

function getValidatedWebhookUrl(): string | null {
  const raw = process.env.N8N_WEBHOOK_URL?.trim();
  if (!raw) {
    return null;
  }

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

function extractPlainTextReply(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const record = (Array.isArray(payload) ? payload[0] : payload) as N8nExpectedResponse | undefined;
  if (!record || typeof record !== 'object') {
    return null;
  }

  if (record.success === false || typeof record.reply !== 'string') {
    return null;
  }

  const trimmed = record.reply.trim();
  return trimmed ? trimmed.slice(0, MAX_REPLY_LENGTH) : null;
}

function sendJson(res: ServerResponse, statusCode: number, body: Record<string, unknown>) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

async function readJsonBody(req: IncomingMessage): Promise<ChatRequestBody | null> {
  const maybeParsed = (req as IncomingMessage & { body?: unknown }).body;
  if (maybeParsed && typeof maybeParsed === 'object') {
    return maybeParsed as ChatRequestBody;
  }

  const chunks: Buffer[] = [];
  let totalBytes = 0;

  for await (const chunk of req) {
    const buf = typeof chunk === 'string' ? Buffer.from(chunk) : (chunk as Buffer);
    totalBytes += buf.length;
    if (totalBytes > 16 * 1024) {
      return null;
    }
    chunks.push(buf);
  }

  if (chunks.length === 0) {
    return {};
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8')) as ChatRequestBody;
  } catch {
    return null;
  }
}

/**
 * Vercel Serverless Function for POST /api/chat -> n8n webhook proxy.
 * Uses only Node.js built-in types so zero extra Vercel packages are required.
 */
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { success: false, error: 'METHOD_NOT_ALLOWED' });
    return;
  }

  const body = await readJsonBody(req);
  if (!body) {
    sendJson(res, 400, { success: false, error: 'INVALID_JSON' });
    return;
  }

  const rawMessage = typeof body.message === 'string' ? body.message.trim() : '';
  const rawSessionId = typeof body.sessionId === 'string' ? body.sessionId.trim() : '';

  if (!rawMessage) {
    sendJson(res, 400, { success: false, error: 'EMPTY_MESSAGE' });
    return;
  }

  if (rawMessage.length > MAX_MESSAGE_LENGTH) {
    sendJson(res, 400, { success: false, error: 'MESSAGE_TOO_LONG' });
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
    sendJson(res, 503, { success: false, error: 'WEBHOOK_NOT_CONFIGURED' });
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
      sendJson(res, 502, { success: false, error: 'UPSTREAM_ERROR' });
      return;
    }

    let upstreamData: unknown;
    try {
      upstreamData = await upstream.json();
    } catch {
      sendJson(res, 502, { success: false, error: 'INVALID_UPSTREAM_RESPONSE' });
      return;
    }

    const reply = extractPlainTextReply(upstreamData);
    if (!reply) {
      sendJson(res, 502, { success: false, error: 'INVALID_REPLY_FORMAT' });
      return;
    }

    sendJson(res, 200, {
      success: true,
      reply,
      sessionId: safeSessionId,
    });
  } catch (error) {
    const isTimeout = error instanceof Error && error.name === 'AbortError';
    sendJson(res, isTimeout ? 504 : 502, {
      success: false,
      error: isTimeout ? 'UPSTREAM_TIMEOUT' : 'UPSTREAM_UNREACHABLE',
    });
  } finally {
    clearTimeout(timeoutId);
  }
}
