import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { env } from '../server/env';
import { embedText } from '../server/gemini';
import { db, vectorLiteral } from '../server/db';

export const config = { runtime: 'nodejs' };

const kbRoot = path.resolve(process.cwd(), 'kb');

const readFiles = async (dir: string): Promise<string[]> => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];
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

const chunkText = (text: string, maxChars = 1600, overlap = 400) => {
  const chunks: string[] = [];
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

const buildJsonChunks = (filePath: string, data: any) => {
  const categoria = path.basename(path.dirname(filePath));
  const chunks: Array<{ id: string; text: string; payload: Record<string, unknown> }> = [];
  if (Array.isArray(data?.servicios)) {
    data.servicios.forEach((item: any, index: number) => {
      chunks.push({
        id: `precios-${item.id || index}`,
        text: `Servicio: ${item.nombre}. Precio desde ${item.precio_desde} hasta ${item.precio_hasta}. Nota: ${item.nota || ''}`,
        payload: { categoria, source_id: `precios-${item.id || index}`, version: data.version, vigencia: data.vigencia },
      });
    });
  }
  if (Array.isArray(data?.productos)) {
    data.productos.forEach((item: any, index: number) => {
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

const ensureSchema = async () => {
  await db`CREATE EXTENSION IF NOT EXISTS vector`;
  await db`
    CREATE TABLE IF NOT EXISTS kb_chunks (
      id TEXT PRIMARY KEY,
      text TEXT NOT NULL,
      embedding vector(768) NOT NULL,
      metadata JSONB NOT NULL DEFAULT '{}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;
  await db`
    CREATE TABLE IF NOT EXISTS rag_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `;
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  if (env.ingestToken) {
    const headerToken = req.headers['x-ingest-token'] || req.headers.authorization?.replace('Bearer ', '');
    if (headerToken !== env.ingestToken) {
      res.status(401).json({ error: 'unauthorized' });
      return;
    }
  }

  if (!env.postgresUrl || !env.geminiApiKey) {
    res.status(500).json({ error: 'missing_env' });
    return;
  }
  await ensureSchema();

  const files = await readFiles(kbRoot);
  const points: Array<{ id: string; text: string; payload: Record<string, unknown> }> = [];

  for (const filePath of files) {
    const ext = path.extname(filePath);
    const relative = path.relative(kbRoot, filePath);
    if (ext === '.md') {
      const raw = await fs.readFile(filePath, 'utf-8');
      const { data, content } = matter(raw);
      const categoria = data.categoria || path.basename(path.dirname(filePath));
      const chunks = chunkText(content);
      chunks.forEach((chunk, index) => {
        points.push({
          id: `${data.source_id || path.basename(filePath, ext)}-${index}`,
          text: chunk,
          payload: { ...data, categoria, file_path: relative, chunk_index: index },
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
          payload: { ...chunk.payload, file_path: relative },
        });
      });
    }
  }

  for (const point of points) {
    const embedding = await embedText(point.text);
    const vector = vectorLiteral(embedding);
    await db`
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

  await db`
    INSERT INTO rag_meta (key, value)
    VALUES ('kb_version', ${Date.now().toString()})
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
  `;
  await db`
    INSERT INTO rag_meta (key, value)
    VALUES ('kb_updated_at', ${new Date().toISOString()})
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
  `;

  res.status(200).json({ ok: true, chunks: points.length });
}
