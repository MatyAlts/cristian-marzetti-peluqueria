import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MessageSquare, X, Send, Calendar, Phone } from 'lucide-react';
import { CONTACT_INFO } from '../constants';

type ChatRole = 'user' | 'assistant' | 'system';

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

interface ChatMeta {
  conversation_id?: string;
  risk_level?: string;
  intent?: {
    intent?: string;
    servicio?: string | null;
  };
  handoff?: {
    reason: string;
  };
}

const CONVERSATION_KEY = 'marzetti_conversation_id';

const buildWhatsAppUrl = (message?: string) => {
  const defaultMessage = 'Hola! Vengo del asistente web y quiero hacer una consulta.';
  const text = encodeURIComponent(message || defaultMessage);
  return `https://wa.me/${CONTACT_INFO.phone.replace('+', '')}?text=${text}`;
};

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hola! Soy el asistente de Marzetti. Puedo ayudarte con servicios, precios, turnos y ubicacion.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [meta, setMeta] = useState<ChatMeta | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollRef.current) {
      return;
    }
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOpen, isSending]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) {
      return;
    }

    setIsSending(true);
    setInput('');
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
    };

    const assistantId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      userMessage,
      { id: assistantId, role: 'assistant', content: '' },
    ]);

    const conversationId = localStorage.getItem(CONVERSATION_KEY) || undefined;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          conversation_id: conversationId,
          page: window.location.hash || window.location.pathname,
          user_agent: navigator.userAgent,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('No se pudo conectar con el asistente.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      const processEvent = (eventBlock: string) => {
        const lines = eventBlock.split('\n').map((line) => line.trim());
        let eventType = 'message';
        const dataLines: string[] = [];

        lines.forEach((line) => {
          if (line.startsWith('event:')) {
            eventType = line.replace('event:', '').trim();
          } else if (line.startsWith('data:')) {
            dataLines.push(line.replace('data:', '').trim());
          }
        });

        if (!dataLines.length) {
          return;
        }

        const payload = JSON.parse(dataLines.join('\n'));
        if (eventType === 'meta') {
          setMeta(payload as ChatMeta);
          if (payload?.conversation_id) {
            localStorage.setItem(CONVERSATION_KEY, payload.conversation_id);
          }
        }
        if (eventType === 'message') {
          setMessages((prev) =>
            prev.map((item) =>
              item.id === assistantId
                ? { ...item, content: payload.text || '' }
                : item
            )
          );
        }
        if (eventType === 'error') {
          setMessages((prev) =>
            prev.map((item) =>
              item.id === assistantId
                ? { ...item, content: 'Ocurrio un error. Intenta de nuevo.' }
                : item
            )
          );
        }
      };

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n\n');
        buffer = parts.pop() || '';
        parts.forEach(processEvent);
      }
    } catch (error) {
      setMessages((prev) =>
        prev.map((item) =>
          item.id === assistantId
            ? { ...item, content: 'No pudimos responder en este momento.' }
            : item
        )
      );
    } finally {
      setIsSending(false);
    }
  }, [input, isSending]);

  const handleQuickAction = (action: 'turnos' | 'whatsapp') => {
    if (action === 'turnos') {
      window.location.href = '/#/turnos';
      setIsOpen(false);
    } else {
      window.open(buildWhatsAppUrl(), '_blank');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-dark-900 text-white px-4 py-3 shadow-lg hover:bg-dark-800 transition-colors"
        aria-label="Abrir asistente"
      >
        <MessageSquare className="w-5 h-5 text-gold-500" />
        <span className="text-sm font-semibold">Asistente</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center bg-black/40">
          <div className="bg-white w-full sm:max-w-md sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-dark-900 text-white">
              <div>
                <p className="text-sm uppercase tracking-widest text-gold-500">Marzetti</p>
                <p className="text-lg font-semibold">Asistente</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:text-gold-500 transition-colors"
                aria-label="Cerrar asistente"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <div className="flex gap-2">
                <button
                  onClick={() => handleQuickAction('turnos')}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-gold-500 text-dark-900 py-2 text-sm font-semibold hover:bg-gold-400 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  Agendar turno
                </button>
                <button
                  onClick={() => handleQuickAction('whatsapp')}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-dark-900 text-dark-900 py-2 text-sm font-semibold hover:bg-dark-900 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  WhatsApp
                </button>
              </div>
              {meta?.risk_level && (
                <p className="mt-2 text-xs text-gray-500">
                  Nivel de riesgo: {meta.risk_level}
                </p>
              )}
            </div>

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-white"
              style={{ maxHeight: '60vh' }}
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`rounded-2xl px-4 py-2 text-sm leading-relaxed max-w-[80%] ${
                      message.role === 'user'
                        ? 'bg-dark-900 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.content || (message.role === 'assistant' && isSending ? '...' : '')}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 px-4 py-3 bg-white">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      handleSend();
                    }
                  }}
                  placeholder="Escribi tu consulta..."
                  className="flex-1 max-w-full rounded-full border border-gray-300 px-4 py-2 text-base focus:outline-none focus:border-gold-500"
                  disabled={isSending}
                />
                <button
                  onClick={handleSend}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-dark-900 text-white hover:bg-dark-800 transition-colors"
                  disabled={isSending}
                  aria-label="Enviar mensaje"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-2 text-[11px] text-gray-500">
                Este asistente usa IA. No compartas datos personales sensibles.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
