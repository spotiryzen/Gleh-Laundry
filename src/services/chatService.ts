import { CHATBOT_FALLBACK_MESSAGE } from '../data/laundryData';

export const MAX_CHAT_MESSAGE_LENGTH = 1000;
const REQUEST_TIMEOUT_MS = 16000;

export interface ChatResponsePayload {
  success: boolean;
  reply?: string;
  sessionId?: string;
  error?: string;
}

export interface SendChatResult {
  ok: boolean;
  reply: string;
}

function getOptionalStaticWebhookUrl(): string | null {
  const raw = import.meta.env.VITE_N8N_WEBHOOK_URL;
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed || trimmed.toLowerCase().includes('your-n8n-instance')) {
    return null;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

function extractValidReply(data: unknown): string | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const record = (Array.isArray(data) ? data[0] : data) as ChatResponsePayload | undefined;
  if (!record || typeof record !== 'object') {
    return null;
  }

  if (record.success !== true) {
    return null;
  }

  if (typeof record.reply !== 'string') {
    return null;
  }

  const trimmed = record.reply.trim();
  return trimmed.length > 0 ? trimmed : null;
}

async function postToEndpoint(
  url: string,
  message: string,
  sessionId: string
): Promise<{ status: number; data: unknown }> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ message, sessionId }),
      signal: controller.signal,
    });

    let data: unknown = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    return { status: response.status, data };
  } finally {
    window.clearTimeout(timeoutId);
  }
}

/**
 * Mengirim pesan ke endpoint same-origin /api/chat (proxy server ke n8n).
 * Jika runtime server tidak tersedia (misal hosting statis mengembalikan 404)
 * dan VITE_N8N_WEBHOOK_URL dikonfigurasi, otomatis memakai URL publik tersebut.
 */
export async function sendChatMessage(
  rawMessage: string,
  sessionId: string
): Promise<SendChatResult> {
  const message = rawMessage.trim();
  if (!message || message.length > MAX_CHAT_MESSAGE_LENGTH) {
    return { ok: false, reply: CHATBOT_FALLBACK_MESSAGE };
  }

  try {
    const proxyRes = await postToEndpoint('/api/chat', message, sessionId);

    if (proxyRes.status >= 200 && proxyRes.status < 300) {
      const reply = extractValidReply(proxyRes.data);
      if (reply) {
        return { ok: true, reply };
      }
      return { ok: false, reply: CHATBOT_FALLBACK_MESSAGE };
    }

    // Fallback hanya jika /api/chat tidak ada (hosting statis) dan webhook publik diatur
    if (proxyRes.status === 404) {
      const staticWebhookUrl = getOptionalStaticWebhookUrl();
      if (staticWebhookUrl) {
        const directRes = await postToEndpoint(staticWebhookUrl, message, sessionId);
        if (directRes.status >= 200 && directRes.status < 300) {
          const reply = extractValidReply(directRes.data);
          if (reply) {
            return { ok: true, reply };
          }
        }
      }
    }

    return { ok: false, reply: CHATBOT_FALLBACK_MESSAGE };
  } catch {
    // Jika /api/chat gagal dijangkau pada static hosting dan VITE_N8N_WEBHOOK_URL diatur
    const staticWebhookUrl = getOptionalStaticWebhookUrl();
    if (staticWebhookUrl) {
      try {
        const directRes = await postToEndpoint(staticWebhookUrl, message, sessionId);
        if (directRes.status >= 200 && directRes.status < 300) {
          const reply = extractValidReply(directRes.data);
          if (reply) {
            return { ok: true, reply };
          }
        }
      } catch {
        // Jatuh ke pesan fallback
      }
    }

    return { ok: false, reply: CHATBOT_FALLBACK_MESSAGE };
  }
}

export function createChatSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `gleh-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
