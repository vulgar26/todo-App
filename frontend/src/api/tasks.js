// src/api/tasks.js
import { api } from './client';

/** @typedef {{ id:number, text:string, done:boolean, createdAt:string, updatedAt:string }} Task */

export async function listTasks(params = {}) {
  const q = new URLSearchParams();
  if (params.offset != null) q.set('offset', String(params.offset));
  if (params.limit  != null) q.set('limit',  String(params.limit));
  if (params.done  != null)  q.set('done',   params.done ? 'true' : 'false');
  if (params.sort)           q.set('sort',   params.sort);
  if (params.order)          q.set('order',  params.order);
  const res = await api.get(`/tasks?${q.toString()}`);
  return {
    items: Array.isArray(res?.data) ? res.data : [],
    total: res?.meta?.pagination?.total ?? 0,
  };
}

export async function createTask(text) {
  const res = await api.post('/tasks', { text });
  return res?.data; // Task
}

export async function toggleTask(id, done) {
  const res = await api.patch(`/tasks/${id}`, { done });
  return res?.data; // Task
}

export async function deleteTask(id) {
  await api.delete(`/tasks/${id}`); // 204
  return true;
}
