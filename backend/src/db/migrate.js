// backend/src/db/migrate.js
import { db } from './connection.js';

export function migrate() {
  console.log('🔄 Running database migrations...');

  try {
    // 启用外键约束
    db.pragma('foreign_keys = ON');
    
    // users 表
    db.prepare(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        createdAt TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `).run();

    // tasks 表
    db.prepare(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0,
        createdAt TEXT NOT NULL DEFAULT (datetime('now')),
        updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
        userId INTEGER REFERENCES users(id) ON DELETE CASCADE
      )
    `).run();

    // 检查是否需要添加 userId 列（兼容旧数据）
    const columns = db.prepare(`PRAGMA table_info(tasks)`).all();
    const hasUserId = columns.some(c => c.name === 'userId');
    
    if (!hasUserId) {
      console.log('添加 userId 列到 tasks 表...');
      db.prepare(`ALTER TABLE tasks ADD COLUMN userId INTEGER REFERENCES users(id) ON DELETE CASCADE`).run();
    }

    // 创建索引
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_tasks_userId ON tasks(userId)`).run();
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed)`).run();

    console.log('✅ Database migrations completed');

    // 显示表结构信息
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const taskCount = db.prepare('SELECT COUNT(*) as count FROM tasks').get().count;
    console.log(`📊 Database info: ${userCount} users, ${taskCount} tasks`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}