// src/api/tasks.js
import { request } from './client';

export function listTasks(params = { offset: 0, limit: 20 }) {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/tasks?${qs}`); // GET
}

export function createTask(text) {
  return request('/api/tasks', { method: 'POST', body: { text } });
}

export function toggleTask(id, done) {
  return request(`/api/tasks/${id}`, { method: 'PATCH', body: { done } });
}

export function deleteTask(id) {
  return request(`/api/tasks/${id}`, { method: 'DELETE' });
}

export function getTask(id) {
  const intId = Number(id);
  if (!Number.isInteger(intId) || intId <= 0) throw new Error('id 必须是正整数');
  return request(`/api/tasks/${intId}`);
}
