import { db } from './db';
import type { ChatMessage, ConversationState } from './types';

export const loadConversation = async (conversationId: string) => {
  const conversationResult = await db<ConversationState>`
    SELECT conversation_id, created_at, last_updated
    FROM conversations
    WHERE conversation_id = ${conversationId}
  `;

  if (!conversationResult.rows.length) {
    return null;
  }

  const conversationRow = conversationResult.rows[0];
  const messagesResult = await db<ChatMessage>`
    SELECT id, role, content, timestamp, metadata
    FROM messages
    WHERE conversation_id = ${conversationId}
    ORDER BY timestamp ASC
  `;

  return {
    ...conversationRow,
    created_at: new Date(conversationRow.created_at).toISOString(),
    last_updated: new Date(conversationRow.last_updated).toISOString(),
    messages: messagesResult.rows.map((message) => ({
      ...message,
      timestamp: new Date(message.timestamp).toISOString(),
    })),
  };
};

export const saveConversation = async (conversation: ConversationState) => {
  await db`
    INSERT INTO conversations (conversation_id, created_at, last_updated)
    VALUES (${conversation.conversation_id}, ${conversation.created_at}, ${conversation.last_updated})
    ON CONFLICT (conversation_id)
    DO UPDATE SET last_updated = ${conversation.last_updated}
  `;
};

export const appendMessage = async (
  conversation: ConversationState,
  message: ChatMessage
) => {
  const updated: ConversationState = {
    ...conversation,
    last_updated: new Date().toISOString(),
    messages: [...conversation.messages, message],
  };

  await saveConversation(updated);
  await db`
    INSERT INTO messages (id, conversation_id, role, content, timestamp, metadata)
    VALUES (
      ${message.id},
      ${conversation.conversation_id},
      ${message.role},
      ${message.content},
      ${message.timestamp},
      ${message.metadata || {}}
    )
  `;
  return updated;
};
