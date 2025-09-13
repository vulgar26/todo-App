import { db } from '../db/connection.js';

const rowToEntity = (r) => r && ({
  id: r.id,
  title: r.title,
  completed: !!r.completed,
  createdAt: r.createdAt,
  updatedAt: r.updatedAt,
});

export function findTasks({ offset=0, limit=20, done, sort='createdAt', order='desc' }) {
  const sortCols = new Set(['createdAt','updatedAt','id','title','completed']);
  const col  = sortCols.has(sort) ? sort : 'createdAt';
  const ord  = order?.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

  const conds = [];
  const params = [];
  if (typeof done === 'boolean') { conds.push('completed = ?'); params.push(done ? 1 : 0); }

  const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';
  const sql = `
    SELECT id, title, completed, createdAt, updatedAt
    FROM tasks
    ${where}
    ORDER BY ${col} ${ord}
    LIMIT ? OFFSET ?
  `;
  return db.prepare(sql).all(...params, limit, offset).map(rowToEntity);
}

export function countTasks({ done }) {
  const conds = [];
  const params = [];
  if (typeof done === 'boolean') { conds.push('completed = ?'); params.push(done ? 1 : 0); }
  const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';
  return db.prepare(`SELECT COUNT(*) as n FROM tasks ${where}`).get(...params).n;
}

export function insertTask({ title }) {
  const info = db.prepare(`
    INSERT INTO tasks (title, completed, createdAt, updatedAt)
    VALUES (?, 0, datetime('now'), datetime('now'))
  `).run(title);
  return findTaskById(info.lastInsertRowid);
}

export function findTaskById(id) {
  const row = db.prepare(`
    SELECT id, title, completed, createdAt, updatedAt
    FROM tasks WHERE id = ?
  `).get(id);
  return rowToEntity(row);
}

export function updateTask({ id, title, completed }) {
  let sql = `UPDATE tasks SET updatedAt = datetime('now')`;
  const params = [];
  if (typeof title === 'string')       { sql += `, title = ?`;     params.push(title); }
  if (typeof completed === 'boolean')  { sql += `, completed = ?`; params.push(completed ? 1 : 0); }
  sql += ` WHERE id = ?`;
  params.push(id);

  const info = db.prepare(sql).run(...params);
  if (info.changes === 0) return null;
  return findTaskById(id);
}

export function deleteTask(id) {
  const info = db.prepare(`DELETE FROM tasks WHERE id = ?`).run(id);
  return info.changes > 0;
}