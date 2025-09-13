import * as repo from '../repos/tasksRepo.js';
import { BadRequest, NotFound } from '../utils/httpErrors.js';

const toDTO = (e) => e && ({
  id: e.id,
  text: e.title,
  done: e.completed,
  createdAt: e.createdAt,
  updatedAt: e.updatedAt,
});

export async function list(params) {
  const items = repo.findTasks(params);
  const total = repo.countTasks(params);
  return { items: items.map(toDTO), total };
}

export async function create({ text }) {
  const title = (text ?? '').trim();
  if (!title) throw new BadRequest('title 不能为空');
  const entity = repo.insertTask({ title });
  return toDTO(entity);
}

export async function patch(id, { text, done }) {
  const updates = {};
  if (typeof text === 'string') {
    const t = text.trim();
    if (!t) throw new BadRequest('title 不能为空');
    updates.title = t;
  }
  if (typeof done === 'boolean') updates.completed = done;

  const entity = repo.updateTask({ id, ...updates });
  if (!entity) throw new NotFound('任务不存在');
  return toDTO(entity);
}

export async function remove(id) {
  const ok = repo.deleteTask(id);
  if (!ok) throw new NotFound('任务不存在');
}