import { env, assertGemini } from './env';

const extractJson = (text: string) => {
  const match = text.match(/\{[\s\S]*\}/);
  return match ? match[0] : text;
};

export const generateText = async (prompt: string) => {
  const apiKey = assertGemini();
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${env.geminiModel}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 512 },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Gemini returned empty response');
  }
  return text;
};

export const generateJson = async <T>(prompt: string): Promise<T> => {
  const text = await generateText(prompt);
  const raw = extractJson(text);
  return JSON.parse(raw) as T;
};

export const embedText = async (text: string) => {
  const apiKey = assertGemini();
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${env.embeddingModel}:embedContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: { parts: [{ text }] },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini embed error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const values = data?.embedding?.values;
  if (!values) {
    throw new Error('Gemini embed returned empty vector');
  }
  return values as number[];
};

export const embedTexts = async (texts: string[]) => {
  const vectors: number[][] = [];
  for (const text of texts) {
    vectors.push(await embedText(text));
  }
  return vectors;
};
