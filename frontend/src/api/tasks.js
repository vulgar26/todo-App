// src/api/tasks.js
import { request } from './client';

export function listTasks({ page=1, limit=10, q='',done } = {}) {
  const params = new URLSearchParams();
  params.set('page', page);
  params.set('limit', limit);
  if (q) params.set('q', q);
  if (typeof done === 'boolean') params.set('done', done ? 'true' : 'false');

  return request(`/api/tasks?${params.toString()}`); // GET
}

export function createTask(text) {
  return request('/api/tasks', { method: 'POST', body: { text } });
}

export function toggleTask(id, done) {
  return request(`/api/tasks/${id}`, {method: 'PATCH', body: { done } });
}

export function deleteTask(id) {
  return request(`/api/tasks/${id}`, { method: 'DELETE' });
}

export function getTask(id) {
  const intId = Number(id);
  if (!Number.isInteger(intId) || intId <= 0) throw new Error('id 必须是正整数');
  return request(`/api/tasks/${intId}`);
}
