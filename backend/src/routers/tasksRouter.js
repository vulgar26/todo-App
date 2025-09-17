import { Router } from 'express';
import { listTasks, createTask, toggleTask, deleteTask, getById } from '../repos/tasksRepo.js';
import { authRequired } from '../middlewares/authRequired.js';
import * as repo from '../repos/tasksRepo.js'

function mapTask(row) {
  if (!row) return null;
  return {
    id: row.id,
    text: row.title,
    done: !!row.completed,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export const tasksRouter = Router();

tasksRouter.use(authRequired);

// 列表 GET /api/tasks
tasksRouter.get('/', (req,res) => {
  const userId = req.user.id;

  const q = (req.query.q || '').toString();
  const page = Number(req.query.page || '1') || 1;
  const limit = Number(req.query.limit || '10') || 10;
  
  let done;
  if (typeof req.query.done === 'string') {
    if(['true', '1'].includes(req.query.done)) done = true;
    if(['false', '0'].includes(req.query.done)) done = false;
  }

  const { rows, total } = repo.listTasks({
    userId, q, done, page, limit,
    sort:'id', order: 'DESC',
  });

  const totalPages = Math.max(1, Math.ceil(total / limit));

  res.json({
    data: rows.map(mapTask),
    meta: { page, limit, totalCount: total, totalPages }
  });
});

// 新增 POST /api/tasks
tasksRouter.post('/', async (req,res) => {
  const text = (req.body?.text || '').trim();
  if (!text) return res.status(400).json({ error:'text 不能为空' });
  const row = await createTask({ userId: req.user.id, text });
  res.status(201).json({ data: mapTask(row) });
});

// 勾选 PATCH /api/tasks/:id
tasksRouter.patch('/:id', async (req,res) => {
  const id = +req.params.id;
  const done = !!req.body?.done;
  const row = await toggleTask({ userId: req.user.id, id, done });
  if (!row) return res.status(404).json({ error:'Not found' });
  res.json({ data: mapTask(row) });
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
  res.json({ data: mapTask(task) });
});