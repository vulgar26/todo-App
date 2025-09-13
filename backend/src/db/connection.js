import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';
import { config } from '../config.js';

const dbPath = path.resolve(process.cwd(), config.dbFile);
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

export const db = new Database(dbPath, { fileMustExist: false });
db.pragma('journal_mode = WAL');
db.pragma('busy_timeout = 2000');