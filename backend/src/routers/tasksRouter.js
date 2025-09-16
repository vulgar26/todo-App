import { Router } from 'express';
import { listTasks, createTask, toggleTask, deleteTask, getById } from '../repos/tasksRepo.js';

export const tasksRouter = Router();

// 列表 GET /api/tasks
tasksRouter.get('/', async (req,res) => {
  const { offset=0, limit=20 } = req.query;
  const rows = await listTasks({ userId: req.user.id, offset:+offset, limit:+limit });
  res.json({ data: rows.map(r => ({ id:r.id, text:r.title, done: !!r.completed, createdAt:r.createdAt, updatedAt:r.updatedAt })), meta:{ offset:+offset, limit:+limit } });
});

// 新增 POST /api/tasks
tasksRouter.post('/', async (req,res) => {
  const text = (req.body?.text || '').trim();
  if (!text) return res.status(400).json({ error:'text 不能为空' });
  const row = await createTask({ userId: req.user.id, text });
  res.status(201).json({ data: { id: row.id, text: row.title, done: !!row.completed, createdAt: row.createdAt, updatedAt: row.updatedAt } });
});

// 勾选 PATCH /api/tasks/:id
tasksRouter.patch('/:id', async (req,res) => {
  const id = +req.params.id;
  const done = !!req.body?.done;
  const row = await toggleTask({ userId: req.user.id, id, done });
  if (!row) return res.status(404).json({ error:'Not found' });
  res.json({ data: { id: row.id, text: row.title, done: !!row.completed, createdAt: row.createdAt, updatedAt: row.updatedAt } });
});

// 删除 DELETE /api/tasks/:id
tasksRouter.delete('/:id', async (req,res) => {
  const id = +req.params.id;
  const ok = await deleteTask({ userId: req.user.id, id });
  if (!ok) return res.status(404).json({ error:'Not found' });
  res.status(204).end();
});

// 查询详情 GET /api/tasks/:id
tasksRouter.get('/:id', async (req,res) => {
  const id = parseInt(req.params.id, 10);
  const task = await getById({ userId: req.user.id, id });
  if (!task) return res.status(404).json({ error: 'Not Found', code: 'NOT_FOUND' });
  res.json({ data: { id: task.id, text: task.title, done: !!task.completed, createdAt: task.createdAt, updatedAt: task.updatedAt } });
});