// backend/src/services/tasksService.js
import * as repo from '../repos/tasksRepo.js';
import { NotFound, BadRequest } from '../utils/httpErrors.js';

function toDTO(row) {
  return {
    id: row.id,
    text: row.title,
    done: !!row.completed,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function list({ userId, offset=0, limit=20, done, sort='id', order='DESC' }) {
  const rows = repo.listTasks({ userId, offset, limit, done, sort, order });
  return { data: rows.map(toDTO), meta: { offset, limit, total: rows.length }};
}

export async function get({ userId, id }) {
  const row = repo.getById({ userId, id });
  if (!row) throw new NotFound('任务不存在');
  return toDTO(row);
}

export async function create({ userId, text }) {
  const t = (text ?? '').trim();
  if (!t) throw new BadRequest('text 不能为空');
  const row = repo.createTask({ userId, text: t });
  return toDTO(row);
}

// 这里只支持 text 或 done 的局部更新
export async function patch({ userId, id, text, done }) {
  // 先处理 text 更新（如果传了）
  if (typeof text === 'string') {
    const t = text.trim();
    if (!t) throw new BadRequest('text 不能为空');
    // 复用 repo.toggle 之外的更新：你目前 repo 只有 toggleTask 和 deleteTask，
    // 因为没有通用 updateTask，我们采用“按需调用”：先改标题，再改完成状态。
    // 这里用一条 UPDATE 改标题（借用 createTask/getById 的习惯）
    const sql = `UPDATE tasks SET title = ?, updatedAt = datetime('now') WHERE userId = ? AND id = ?`;
    const info = (await import('../db/connection.js')).db.prepare(sql).run(text.trim(), userId, id);
    if (info.changes === 0) throw new NotFound('任务不存在');
  }

  // 再处理 done（如果传了）
  if (typeof done === 'boolean') {
    const row = repo.toggleTask({ userId, id, done });
    if (!row) throw new NotFound('任务不存在');
    // 返回最新一份
    return toDTO(row);
  }

  // 只改了 text 的情况：读回
  const latest = repo.getById({ userId, id });
  if (!latest) throw new NotFound('任务不存在');
  return toDTO(latest);
}

export async function remove({ userId, id }) {
  const ok = repo.deleteTask({ userId, id });
  if (!ok) throw new NotFound('任务不存在');
}
