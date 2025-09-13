import { Router } from 'express';
import { z } from 'zod';
import * as svc from '../services/tasksService.js';
import { validate } from '../middlewares/validate.js';
import { ok, created, noContent } from '../middlewares/response.js';
import { parseListQuery } from '../utils/pagination.js';

export const tasksRouter = Router();

// GET /api/tasks?offset&limit&done&sort&order
tasksRouter.get('/',
  validate(z.object({
    query: z.object({
      offset: z.string().optional(),
      limit:  z.string().optional(),
      done:   z.enum(['true','false']).optional(),
      sort:   z.enum(['createdAt','updatedAt','id','title','completed']).optional(),
      order:  z.enum(['asc','desc']).optional(),
    }),
    params: z.object({}),
    body:   z.object({}).optional(),
  })),
  async (req, res, next) => {
    try {
      const qp = parseListQuery(req.valid.query);
      const { items, total } = await svc.list(qp);
      return ok(res, items, { pagination: { offset: qp.offset, limit: qp.limit, total }});
    } catch (e) { next(e); }
  }
);

tasksRouter.post('/',
  validate(z.object({
    body: z.object({ text: z.string().min(1).max(100) }),
    params: z.object({}), query: z.object({}).optional()
  })),
  async (req, res, next) => {
    try {
      const dto = await svc.create({ text: req.valid.body.text });
      return created(res, dto);
    } catch (e) { next(e); }
  }
);

tasksRouter.patch('/:id',
  validate(z.object({
    params: z.object({ id: z.string().regex(/^\d+$/) }),
    body: z.object({
      text: z.string().min(1).max(100).optional(),
      done: z.boolean().optional(),
    }).refine(b => 'text' in b || 'done' in b, { message: '至少提供 text 或 done' }),
    query: z.object({}).optional(),
  })),
  async (req, res, next) => {
    try {
      const id = Number(req.valid.params.id);
      const dto = await svc.patch(id, req.valid.body);
      return ok(res, dto);
    } catch (e) { next(e); }
  }
);

tasksRouter.delete('/:id',
  validate(z.object({
    params: z.object({ id: z.string().regex(/^\d+$/) }),
    query: z.object({}).optional(), body: z.object({}).optional()
  })),
  async (req, res, next) => {
    try {
      const id = Number(req.valid.params.id);
      await svc.remove(id);
      return noContent(res);
    } catch (e) { next(e); }
  }
);