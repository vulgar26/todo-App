import Database from 'better-sqlite3';
import { config } from '../config.js';
import fs from 'node:fs';
import path from 'node:path';

const file = config.isTest
  ? (process.env.DB_FILE ?? ':memory:')
  : path.resolve(process.cwd(), config.dbFile);

// 确保目录存在
if (file !== ':memory:') {
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export const db = new Database(file, { fileMustExist: false });
db.pragma('journal_mode = WAL');
db.pragma('busy_timeout = 2000');
db.pragma('foreign_keys = ON');