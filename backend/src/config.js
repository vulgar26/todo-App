import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT ?? 3000),
  dbFile: process.env.DB_FILE ?? './data/tasks.db',
  jwtSecret: process.env.JWT_SECRET ?? 'change_me',
  jwtExpires: process.env.JWT_EXPIRES ?? '7d',
  isTest: process.env.NODE_ENV === 'test'
};
