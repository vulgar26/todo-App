import { verifyToken } from '../utils/jwt.js';

export function authRequired(req, res, next) {
  const cookieToken = req.cookies?.token;
  const auth = req.headers.authorization;
  const bearer = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
  const token = cookieToken || bearer;

  if (!token) {
    return res.status(401).json({ error: '未登录', code: 'UNAUTHORIZED' });
  }
  const decoded = verifyToken(token);
  if (!decoded?.uid) {
    return res.status(401).json({ error: '登录状态无效或已过期', code: 'UNAUTHORIZED' });
  }
  req.user = { id: decoded.uid };
  next();
}
