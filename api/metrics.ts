import { db } from '../server/db';

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'method_not_allowed' }), { status: 405 });
  }

  const url = new URL(req.url);
  const date = url.searchParams.get('date') || new Date().toISOString().slice(0, 10);
  const metrics = await db<Record<string, string>>`
    SELECT *
    FROM metrics_daily
    WHERE day = ${date}
  `;
  return new Response(JSON.stringify(metrics.rows[0] || {}), {
    headers: { 'Content-Type': 'application/json' },
  });
}
