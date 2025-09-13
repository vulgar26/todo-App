import 'dotenv/config';

const need = (key, fallback) => {
  const v = process.env[key] ?? fallback;
  if (v === undefined) throw new Error(`Missing env ${key}`);
  return v;
};

export const config = {
  env: process.env.NODE_ENV ?? 'development',
  port: Number(need('PORT', 3000)),
  dbFile: need('DB_FILE', './data/tasks.db'),
};