import { HttpError } from '../utils/httpErrors.js';

export function errorHandler(err, _req, res, _next) {
  console.error('Error caught by errorHandler:', err);
  
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: err.message,
      code:  err.code,
      ...(err.details ? { details: err.details } : {}),
    });
  }
  
  console.error('[Unhandled Error]', err);
  return res.status(500).json({ 
    error: 'Internal Server Error', 
    code: 'INTERNAL_ERROR' 
  });
}