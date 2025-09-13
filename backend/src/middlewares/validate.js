import { ZodError } from 'zod';
import { BadRequest } from '../utils/httpErrors.js';

export const validate = (schema) => (req, _res, next) => {
  try {
    req.valid = schema.parse({
      params: req.params,
      query:  req.query,
      body:   req.body,
    });
    next();
  } catch (e) {
    if (e instanceof ZodError) {
      const details = e.issues.map(i => ({ path: i.path.join('.'), message: i.message }));
      next(new BadRequest('参数校验失败', { details }));
    } else next(e);
  }
};