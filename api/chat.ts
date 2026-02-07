import { sanitizeInput } from '../server/sanitize';
import { rateLimit } from '../server/rateLimit';
import { classifyIntent, scoreRisk, triageQuestions } from '../server/governance';
import { retrieveContext } from '../server/rag';
import { answererPrompt } from '../server/prompts';
import { generateText } from '../server/gemini';
import { appendMessage, loadConversation, saveConversation } from '../server/conversation';
import { recordMetrics } from '../server/metrics';
import type { ChatMessage, ChatRequestPayload, ChatResponseMeta, ConversationState } from '../server/types';

export const config = { runtime: 'edge' };

const jsonEvent = (event: string, payload: unknown) =>
  `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`;

const buildHandoffMessage = (riskLevel: string) => {
  if (riskLevel === 'critico') {
    return 'Esto requiere evaluacion presencial inmediata. Te recomendamos hablar por WhatsApp.';
  }
  return 'Te recomiendo una evaluacion presencial antes de avanzar. Podemos coordinar por WhatsApp.';
};

const makeConversation = (conversationId: string): ConversationState => ({
  conversation_id: conversationId,
  created_at: new Date().toISOString(),
  last_updated: new Date().toISOString(),
  messages: [],
});

const createMessage = (role: 'user' | 'assistant', content: string): ChatMessage => ({
  id: crypto.randomUUID(),
  role,
  content,
  timestamp: new Date().toISOString(),
});

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'method_not_allowed' }), { status: 405 });
  }

  let payload: ChatRequestPayload;
  try {
    payload = (await req.json()) as ChatRequestPayload;
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_json' }), { status: 400 });
  }

  const message = sanitizeInput(payload.message);
  if (!message) {
    return new Response(JSON.stringify({ error: 'empty_message' }), { status: 400 });
  }

  const clientIp =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const allowed = await rateLimit(clientIp);
  if (!allowed) {
    return new Response(JSON.stringify({ error: 'rate_limit_exceeded' }), {
      status: 429,
      headers: { 'Retry-After': '60' },
    });
  }

  const conversationId = payload.conversation_id || crypto.randomUUID();
  const existing = await loadConversation(conversationId);
  let conversation = existing || makeConversation(conversationId);
  await saveConversation(conversation);
  conversation = await appendMessage(conversation, createMessage('user', message));

  const intent = await classifyIntent(message);
  const risk = await scoreRisk(message, intent.intent, intent.servicio);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(jsonEvent(event, data)));
      };

      try {
        const meta: ChatResponseMeta = {
          conversation_id: conversationId,
          risk_level: risk.risk_level,
          intent,
        };

        let responseText = '';
        let decision: 'respond' | 'handoff' | 'triage' = 'respond';

        if (risk.risk_level === 'alto' || risk.risk_level === 'critico' || intent.intent === 'salud') {
          responseText = buildHandoffMessage(risk.risk_level);
          meta.handoff = { reason: 'risk_high' };
          decision = 'handoff';
        } else if (intent.servicio === 'coloracion' && risk.risk_level !== 'bajo') {
          const questions = await triageQuestions(message);
          responseText = `Para ayudarte mejor necesito unas respuestas:\n- ${questions.join('\n- ')}`;
          decision = 'triage';
        } else {
          const chunks = await retrieveContext(message, intent.intent);
          meta.sources = chunks.map((chunk) => ({
            id: chunk.id,
            score: chunk.score,
            source_id: chunk.payload?.source_id as string | undefined,
          }));
          const context = chunks.map((chunk) => chunk.text).filter(Boolean).join('\n\n');
          responseText = await generateText(
            answererPrompt(context, message, risk.risk_level, intent.intent)
          );
        }

        send('meta', meta);
        send('message', { text: responseText });
        send('done', { ok: true });

        await appendMessage(conversation, createMessage('assistant', responseText));
        await recordMetrics(risk.risk_level, decision);
      } catch (error) {
        send('error', { error: (error as Error).message || 'unknown_error' });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
