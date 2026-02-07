import { db, vectorLiteral } from './db';
import { embedText } from './gemini';
import type { IntentName, RAGChunk } from './types';

export const retrieveContext = async (
  query: string,
  intent: IntentName,
  limit = 5
) => {
  const vector = await embedText(query);
  const vectorValue = vectorLiteral(vector);
  let result;

  switch (intent) {
    case 'precio':
      result = await db<RAGChunk>`
        SELECT id, text, metadata, 1 - (embedding <-> ${vectorValue}::vector) AS score
        FROM kb_chunks
        WHERE metadata->>'categoria' = 'precios'
        ORDER BY embedding <-> ${vectorValue}::vector
        LIMIT ${limit}
      `;
      break;
    case 'agenda':
      result = await db<RAGChunk>`
        SELECT id, text, metadata, 1 - (embedding <-> ${vectorValue}::vector) AS score
        FROM kb_chunks
        WHERE metadata->'tags' ?| array['turnos','agenda']
        ORDER BY embedding <-> ${vectorValue}::vector
        LIMIT ${limit}
      `;
      break;
    case 'curso':
      result = await db<RAGChunk>`
        SELECT id, text, metadata, 1 - (embedding <-> ${vectorValue}::vector) AS score
        FROM kb_chunks
        WHERE metadata->>'categoria' IN ('curso', 'cursos')
        ORDER BY embedding <-> ${vectorValue}::vector
        LIMIT ${limit}
      `;
      break;
    case 'producto':
      result = await db<RAGChunk>`
        SELECT id, text, metadata, 1 - (embedding <-> ${vectorValue}::vector) AS score
        FROM kb_chunks
        WHERE metadata->>'categoria' IN ('producto', 'productos')
        ORDER BY embedding <-> ${vectorValue}::vector
        LIMIT ${limit}
      `;
      break;
    case 'ubicacion':
      result = await db<RAGChunk>`
        SELECT id, text, metadata, 1 - (embedding <-> ${vectorValue}::vector) AS score
        FROM kb_chunks
        WHERE metadata->>'categoria' = 'ubicacion'
        ORDER BY embedding <-> ${vectorValue}::vector
        LIMIT ${limit}
      `;
      break;
    case 'transformacion':
    case 'quimica':
      result = await db<RAGChunk>`
        SELECT id, text, metadata, 1 - (embedding <-> ${vectorValue}::vector) AS score
        FROM kb_chunks
        WHERE metadata->>'categoria' = 'politica'
        ORDER BY embedding <-> ${vectorValue}::vector
        LIMIT ${limit}
      `;
      break;
    default:
      result = await db<RAGChunk>`
        SELECT id, text, metadata, 1 - (embedding <-> ${vectorValue}::vector) AS score
        FROM kb_chunks
        ORDER BY embedding <-> ${vectorValue}::vector
        LIMIT ${limit}
      `;
      break;
  }

  return result.rows.map((row) => ({
    id: row.id,
    text: row.text,
    score: row.score,
    payload: row.metadata as Record<string, unknown>,
  }));
};
