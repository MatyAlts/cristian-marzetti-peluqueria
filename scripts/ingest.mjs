import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import matter from 'gray-matter';
import { sql } from '@vercel/postgres';

const KB_ROOT = path.resolve(process.cwd(), 'kb');
const POSTGRES_URL = process.env.POSTGRES_URL;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const EMBEDDING_MODEL = process.env.GEMINI_EMBEDDING_MODEL || 'text-embedding-004';

if (!POSTGRES_URL || !GEMINI_API_KEY) {
  console.error('Missing POSTGRES_URL or GEMINI_API_KEY');
  process.exit(1);
}

const readFiles = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await readFiles(full)));
    } else if (entry.isFile()) {
      files.push(full);
    }
  }
  return files;
};

const chunkText = (text, maxChars = 1600, overlap = 400) => {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + maxChars, text.length);
    chunks.push(text.slice(start, end).trim());
    if (end === text.length) {
      break;
    }
    start = Math.max(0, end - overlap);
  }
  return chunks.filter(Boolean);
};

const embedText = async (text) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: { parts: [{ text }] } }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini embed failed: ${response.status} ${await response.text()}`);
  }
  const data = await response.json();
  return data?.embedding?.values;
};

const vectorLiteral = (values) => `[${values.join(',')}]`;

const ensureSchema = async () => {
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
};

const createPayloadBase = (filePath, meta) => ({
  ...meta,
  file_path: filePath,
});

const buildJsonChunks = (filePath, data) => {
  const categoria = path.basename(path.dirname(filePath));
  const chunks = [];
  if (Array.isArray(data?.servicios)) {
    data.servicios.forEach((item, index) => {
      chunks.push({
        id: `precios-${item.id || index}`,
        text: `Servicio: ${item.nombre}. Precio desde ${item.precio_desde} hasta ${item.precio_hasta}. Nota: ${item.nota || ''}`,
        payload: { categoria, source_id: `precios-${item.id || index}`, version: data.version, vigencia: data.vigencia },
      });
    });
  }
  if (Array.isArray(data?.productos)) {
    data.productos.forEach((item, index) => {
      chunks.push({
        id: `productos-${item.id || index}`,
        text: `Producto: ${item.nombre}. Precio ${item.precio}. Categoria: ${item.categoria}. Nota: ${item.nota || ''}`,
        payload: { categoria, source_id: `productos-${item.id || index}`, version: data.version, vigencia: data.vigencia },
      });
    });
  }
  if (!chunks.length) {
    chunks.push({
      id: `json-${path.basename(filePath, '.json')}`,
      text: JSON.stringify(data, null, 2),
      payload: { categoria, source_id: `json-${path.basename(filePath, '.json')}` },
    });
  }
  return chunks;
};

const ingest = async () => {
  await ensureSchema();
  const files = await readFiles(KB_ROOT);
  const points = [];

  for (const filePath of files) {
    const ext = path.extname(filePath);
    const relative = path.relative(KB_ROOT, filePath);
    if (ext === '.md') {
      const raw = await fs.readFile(filePath, 'utf-8');
      const { data, content } = matter(raw);
      const categoria = data.categoria || path.basename(path.dirname(filePath));
      const payloadBase = createPayloadBase(relative, { ...data, categoria });
      const chunks = chunkText(content);
      chunks.forEach((chunk, index) => {
        points.push({
          id: `${data.source_id || path.basename(filePath, ext)}-${index}`,
          text: chunk,
          payload: { ...payloadBase, chunk_index: index },
        });
      });
    } else if (ext === '.json') {
      const raw = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(raw);
      const jsonChunks = buildJsonChunks(relative, data);
      jsonChunks.forEach((chunk) => {
        points.push({
          id: chunk.id,
          text: chunk.text,
          payload: { ...createPayloadBase(relative, chunk.payload) },
        });
      });
    }
  }

  for (const point of points) {
    const embedding = await embedText(point.text);
    const vector = vectorLiteral(embedding);
    await sql`
      INSERT INTO kb_chunks (id, text, embedding, metadata, updated_at)
      VALUES (${point.id}, ${point.text}, ${vector}::vector, ${point.payload}, NOW())
      ON CONFLICT (id)
      DO UPDATE SET
        text = EXCLUDED.text,
        embedding = EXCLUDED.embedding,
        metadata = EXCLUDED.metadata,
        updated_at = NOW()
    `;
  }

  await sql`
    INSERT INTO rag_meta (key, value)
    VALUES ('kb_version', ${Date.now().toString()})
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
  `;
  await sql`
    INSERT INTO rag_meta (key, value)
    VALUES ('kb_updated_at', ${new Date().toISOString()})
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
  `;

  console.log(`Ingested ${points.length} chunks into Postgres`);
};

ingest().catch((error) => {
  console.error(error);
  process.exit(1);
});
