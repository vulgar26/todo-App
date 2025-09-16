import { request } from './client';

export function listTasks(params = { offset:0, limit:20 }) {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/tasks?${qs}`);                            // GET
}

export function createTask(text) {
  return request('/api/tasks', 'POST', { text });                // ✅ POST + body
}

export function toggleTask(id, done) {
  return request(`/api/tasks/${id}`, 'PATCH', { done });         // ✅ PATCH + body
}

export function deleteTask(id) {
  return request(`/api/tasks/${id}`, 'DELETE');                  // ✅ DELETE
}

export const getTask = (id) => {
  const intId = Number(id);
  if (!Number.isInteger(intId) || intId <= 0) {
    throw new Error('id 必须是正整数');
  }
  return request(`/api/tasks/${intId}`);
};
