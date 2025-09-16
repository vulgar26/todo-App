// src/middlewares/validate.js
import { ZodError } from 'zod';

export function validate(schema) {
  return (req, res, next) => {
    try {
      const input = { body: req.body, query: req.query, params: req.params, headers: req.headers };
      const parsed = schema.parse(input);
      req.valid = parsed;
      next();
    } catch (e) {
      if (e instanceof ZodError) {
        // 明确告诉前端哪里不对
        const details = e.errors.map(er => ({
          path: er.path.join('.'),
          message: er.message
        }));
        return res.status(400).json({ error: 'VALIDATION_ERROR', details });
      }
      next(e);
    }
  };
}
