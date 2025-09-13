import { db } from './connection.js';

export function migrate() {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS tasks (
      id         INTEGER PRIMARY KEY,
      title      TEXT NOT NULL,
      completed  INTEGER NOT NULL DEFAULT 0,
      createdAt  TEXT   NOT NULL DEFAULT (datetime('now')),
      updatedAt  TEXT   NOT NULL DEFAULT (datetime('now'))
    )
  `).run();
}