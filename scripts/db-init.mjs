import { sql } from '@vercel/postgres';

const main = async () => {
  await sql`CREATE EXTENSION IF NOT EXISTS vector`;

  await sql`
    CREATE TABLE IF NOT EXISTS kb_chunks (
      id TEXT PRIMARY KEY,
      text TEXT NOT NULL,
      embedding vector(768) NOT NULL,
      metadata JSONB NOT NULL DEFAULT '{}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS rag_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS conversations (
      conversation_id TEXT PRIMARY KEY,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL,
      last_updated TIMESTAMP WITH TIME ZONE NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL REFERENCES conversations(conversation_id) ON DELETE CASCADE,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
      metadata JSONB NOT NULL DEFAULT '{}'
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS rate_limits (
      identifier TEXT PRIMARY KEY,
      window_start TIMESTAMP WITH TIME ZONE NOT NULL,
      count INTEGER NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS metrics_daily (
      day DATE PRIMARY KEY,
      total_conversations INTEGER NOT NULL DEFAULT 0,
      total_messages INTEGER NOT NULL DEFAULT 0,
      total_handoffs INTEGER NOT NULL DEFAULT 0,
      total_triage INTEGER NOT NULL DEFAULT 0,
      risk_bajo INTEGER NOT NULL DEFAULT 0,
      risk_medio INTEGER NOT NULL DEFAULT 0,
      risk_alto INTEGER NOT NULL DEFAULT 0,
      risk_critico INTEGER NOT NULL DEFAULT 0
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS kb_chunks_embedding_idx
    ON kb_chunks USING ivfflat (embedding vector_cosine_ops)
  `;

  await sql`CREATE INDEX IF NOT EXISTS messages_conversation_idx ON messages (conversation_id)`;

  console.log('Database schema initialized.');
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
