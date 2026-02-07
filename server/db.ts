import { sql } from '@vercel/postgres';

export const db = sql;

export const vectorLiteral = (values: number[]) => `[${values.join(',')}]`;
