import { db } from './db';

export const rateLimit = async (
  identifier: string,
  limit = 20,
  windowSeconds = 60
) => {
  const now = new Date();
  const existing = await db<{
    count: number;
    window_start: Date;
  }>`SELECT count, window_start FROM rate_limits WHERE identifier = ${identifier}`;

  if (!existing.rows.length) {
    await db`INSERT INTO rate_limits (identifier, window_start, count) VALUES (${identifier}, ${now}, 1)`;
    return true;
  }

  const { count, window_start } = existing.rows[0];
  const elapsedSeconds = (now.getTime() - new Date(window_start).getTime()) / 1000;

  if (elapsedSeconds > windowSeconds) {
    await db`UPDATE rate_limits SET window_start = ${now}, count = 1 WHERE identifier = ${identifier}`;
    return true;
  }

  const nextCount = count + 1;
  await db`UPDATE rate_limits SET count = ${nextCount} WHERE identifier = ${identifier}`;
  return nextCount <= limit;
};
