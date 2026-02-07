const required = (key: string, fallback = '') => {
  const value = process.env[key] || fallback;
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
};

const optional = (key: string, fallback = '') => process.env[key] || fallback;

export const env = {
  geminiApiKey: optional('GEMINI_API_KEY'),
  geminiModel: optional('GEMINI_MODEL', 'gemini-1.5-flash'),
  embeddingModel: optional('GEMINI_EMBEDDING_MODEL', 'text-embedding-004'),
  postgresUrl: optional('POSTGRES_URL'),
  ingestToken: optional('INGEST_TOKEN'),
};

export const assertGemini = () => required('GEMINI_API_KEY');
