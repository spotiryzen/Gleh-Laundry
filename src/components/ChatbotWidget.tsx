import { useCallback, useEffect, useRef, useState } from 'react';
import {
  MessageCircle,
  Minus,
  Send,
  Trash2,
  X,
} from 'lucide-react';
import {
  CHATBOT_QUICK_REPLIES,
  CHATBOT_WELCOME_MESSAGE,
} from '../data/laundryData';
import {
  createChatSessionId,
  MAX_CHAT_MESSAGE_LENGTH,
  sendChatMessage,
} from '../services/chatService';

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  timestamp: string;
  isError?: boolean;
}

interface ChatbotWidgetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  queuedPrompt: { id: number; text: string } | null;
  onQueuedPromptHandled: () => void;
}

function formatTimeNow(): string {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date());
}

function createInitialMessages(): ChatMessage[] {
  return [
    {
      id: 'welcome-message',
      role: 'assistant',
      text: CHATBOT_WELCOME_MESSAGE,
      timestamp: formatTimeNow(),
    },
  ];
}

export function ChatbotWidget({
  isOpen,
  onOpenChange,
  queuedPrompt,
  onQueuedPromptHandled,
}: ChatbotWidgetProps) {
  const [sessionId, setSessionId] = useState<string>(() => createChatSessionId());
  const [messages, setMessages] = useState<ChatMessage[]>(() => createInitialMessages());
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [inputError, setInputError] = useState<string | null>(null);

  const inFlightRef = useRef<boolean>(false);
  const lastHandledPromptIdRef = useRef<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen, isMinimized, scrollToBottom]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      const timer = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 80);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false);
        setIsMinimized(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onOpenChange]);

  const submitMessage = useCallback(
    async (rawText: string) => {
      const trimmed = rawText.trim();
      if (!trimmed) {
        setInputError('Ketik pertanyaan Anda terlebih dahulu.');
        return;
      }
      if (trimmed.length > MAX_CHAT_MESSAGE_LENGTH) {
        setInputError(
          `Pesan maksimal ${MAX_CHAT_MESSAGE_LENGTH} karakter.`
        );
        return;
      }
      if (inFlightRef.current) {
        return;
      }

      setInputError(null);
      inFlightRef.current = true;
      setIsLoading(true);
      setIsMinimized(false);

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        role: 'user',
        text: trimmed,
        timestamp: formatTimeNow(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue('');

      const result = await sendChatMessage(trimmed, sessionId);

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        role: 'assistant',
        text: result.reply,
        timestamp: formatTimeNow(),
        isError: !result.ok,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
      inFlightRef.current = false;
    },
    [sessionId]
  );

  useEffect(() => {
    if (
      isOpen &&
      queuedPrompt &&
      queuedPrompt.id !== lastHandledPromptIdRef.current
    ) {
      lastHandledPromptIdRef.current = queuedPrompt.id;
      setIsMinimized(false);
      onQueuedPromptHandled();
      void submitMessage(queuedPrompt.text);
    }
  }, [isOpen, queuedPrompt, onQueuedPromptHandled, submitMessage]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitMessage(inputValue);
  };

  const handleTextareaKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void submitMessage(inputValue);
    }
  };

  const handleClearConversation = () => {
    if (inFlightRef.current) return;
    setSessionId(createChatSessionId());
    setMessages(createInitialMessages());
    setInputValue('');
    setInputError(null);
  };

  const handleToggleFloatingButton = () => {
    if (isOpen && isMinimized) {
      setIsMinimized(false);
      return;
    }
    onOpenChange(!isOpen);
    setIsMinimized(false);
  };

  const charCount = inputValue.length;
  const isNearLimit = charCount >= 850;
  const isOverLimit = charCount > MAX_CHAT_MESSAGE_LENGTH;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end sm:bottom-6 sm:right-6">
      {/* Chat Panel */}
      {isOpen && (
        <section
          role="dialog"
          aria-label="Gleh AI Assistant"
          aria-modal="false"
          className={`mb-3 flex w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-[#087F75]/20 bg-white shadow-xl sm:w-[390px] ${
            isMinimized ? 'h-auto' : 'h-[min(76vh,590px)]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 bg-[#087F75] px-4 py-3.5 text-white">
            <div className="min-w-0">
              <h2 className="truncate font-[Plus_Jakarta_Sans] text-sm font-bold tracking-tight text-white">
                Gleh AI Assistant
              </h2>
              <p className="truncate text-xs text-[#A8E6DC]">
                Asisten Virtual Gleh Laundry
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleClearConversation}
                disabled={isLoading}
                title="Bersihkan percakapan"
                aria-label="Bersihkan percakapan"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/85 transition-colors hover:bg-white/15 hover:text-white disabled:opacity-45 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => setIsMinimized((prev) => !prev)}
                title={isMinimized ? 'Perluas jendela chat' : 'Perkecil jendela chat'}
                aria-label={isMinimized ? 'Perluas jendela chat' : 'Perkecil jendela chat'}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/85 transition-colors hover:bg-white/15 hover:text-white cursor-pointer"
              >
                <Minus className="h-4 w-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  setIsMinimized(false);
                }}
                title="Tutup chat"
                aria-label="Tutup Gleh AI Assistant"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/85 transition-colors hover:bg-white/15 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Chat Body */}
          {!isMinimized && (
            <>
              <div
                aria-live="polite"
                className="flex-1 space-y-3.5 overflow-y-auto bg-[#F0FAF8]/65 px-4 py-4"
              >
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                          isUser
                            ? 'rounded-br-md bg-[#087F75] text-white'
                            : msg.isError
                              ? 'rounded-bl-md border border-amber-200 bg-amber-50 text-[#173C38]'
                              : 'rounded-bl-md border border-[#087F75]/12 bg-white text-[#173C38]'
                        }`}
                      >
                        <p className="whitespace-pre-line break-words">{msg.text}</p>
                      </div>
                      <span className="mt-1 px-1 text-[11px] tabular-nums text-[#173C38]/50">
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                })}

                {/* Typing Indicator */}
                {isLoading && (
                  <div className="flex flex-col items-start">
                    <div
                      role="status"
                      aria-label="Gleh AI sedang mengetik balasan"
                      className="inline-flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-[#087F75]/12 bg-white px-4 py-3"
                    >
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#087F75]/60 [animation-delay:-0.25s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#087F75]/60 [animation-delay:-0.12s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#087F75]/60" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              <div className="border-t border-[#087F75]/10 bg-white px-3.5 py-2.5">
                <p className="mb-2 text-[11px] font-medium text-[#173C38]/60">
                  Pertanyaan cepat
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {CHATBOT_QUICK_REPLIES.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      disabled={isLoading}
                      onClick={() => void submitMessage(item.message)}
                      className="rounded-lg border border-[#087F75]/20 bg-[#F0FAF8] px-2.5 py-1.5 text-xs font-medium text-[#064E48] transition-colors hover:border-[#087F75] hover:bg-[#087F75] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Form */}
              <form
                onSubmit={handleFormSubmit}
                className="border-t border-[#087F75]/12 bg-white p-3"
              >
                {inputError && (
                  <p
                    role="alert"
                    className="mb-2 text-xs font-medium text-red-700"
                  >
                    {inputError}
                  </p>
                )}

                <div className="flex items-end gap-2">
                  <label htmlFor="gleh-chat-input" className="sr-only">
                    Tulis pesan untuk Gleh AI Assistant
                  </label>
                  <textarea
                    ref={inputRef}
                    id="gleh-chat-input"
                    rows={1}
                    maxLength={MAX_CHAT_MESSAGE_LENGTH + 50}
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      if (inputError) setInputError(null);
                    }}
                    onKeyDown={handleTextareaKeyDown}
                    disabled={isLoading}
                    placeholder="Tulis pertanyaan Anda..."
                    className="max-h-28 min-h-11 flex-1 resize-none rounded-xl border border-[#087F75]/20 bg-[#F0FAF8]/50 px-3.5 py-2.5 text-sm text-[#173C38] placeholder:text-[#173C38]/45 focus:border-[#087F75] focus:bg-white disabled:opacity-60"
                  />

                  <button
                    type="submit"
                    disabled={isLoading || inputValue.trim().length === 0 || isOverLimit}
                    aria-label="Kirim pesan"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#087F75] text-white transition-colors hover:bg-[#064E48] disabled:cursor-not-allowed disabled:opacity-45 cursor-pointer"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                {isNearLimit && (
                  <p
                    className={`mt-1.5 text-right text-[11px] tabular-nums ${
                      isOverLimit ? 'font-semibold text-red-700' : 'text-[#173C38]/55'
                    }`}
                  >
                    {charCount}/{MAX_CHAT_MESSAGE_LENGTH} karakter
                  </p>
                )}
              </form>
            </>
          )}
        </section>
      )}

      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={handleToggleFloatingButton}
        aria-expanded={isOpen && !isMinimized}
        aria-label={isOpen && !isMinimized ? 'Tutup Gleh AI Assistant' : 'Buka Gleh AI Assistant'}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#087F75] text-white shadow-lg transition-transform duration-150 hover:scale-105 hover:bg-[#064E48] cursor-pointer"
      >
        {isOpen && !isMinimized ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <MessageCircle className="h-6 w-6" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
