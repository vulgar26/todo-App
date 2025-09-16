// backend/src/routers/authRouter.js
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db/connection.js';
import { signToken, verifyToken } from '../utils/jwt.js';

export const authRouter = Router();

function isValidEmail(email) {
  return typeof email === 'string' && /\S+@\S+\.\S+/.test(email);
}

// 注册
authRouter.post('/register', (req, res) => {
  const email = (req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: '邮箱格式不合法', code: 'VALIDATION_ERROR' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: '密码至少 8 位', code: 'VALIDATION_ERROR' });
  }

  try {
    const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (exists) return res.status(400).json({ error: '邮箱已被注册', code: 'VALIDATION_ERROR' });

    const hash = bcrypt.hashSync(password, 10);
    const info = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)').run(email, hash);

    return res.status(201).json({ data: { id: info.lastInsertRowid, email } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: '服务器错误', code: 'SERVER_ERROR' });
  }
});

// 登录
authRouter.post('/login', (req, res) => {
  const email = (req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');

  if (!isValidEmail(email) || password.length === 0) {
    return res.status(400).json({ error: '邮箱或密码不合法', code: 'VALIDATION_ERROR' });
  }

  try {
    const user = db.prepare('SELECT id, email, password_hash FROM users WHERE email = ?').get(email);
    if (!user) return res.status(401).json({ error: '账号或密码错误', code: 'UNAUTHORIZED' });

    const ok = bcrypt.compareSync(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: '账号或密码错误', code: 'UNAUTHORIZED' });

    // ✅ 确保payload最小化，只包含必要信息
    const payload = { uid: user.id };
    const token = signToken(payload);

    // ✅ 先清除旧cookie，避免重复设置
    res.clearCookie('token', { path: '/' });
    
    // ✅ 设置新cookie，使用更保守的设置
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'strict', // 改为更严格的设置
      secure: process.env.NODE_ENV === 'production', // 生产环境才使用secure
      path: '/',
      maxAge: 7 * 24 * 3600 * 1000, // 7天
    });

    return res.json({ 
      data: { 
        id: user.id, 
        email: user.email 
      } 
    });
  } catch (e) {
    console.error('Login error:', e);
    return res.status(500).json({ error: '服务器错误', code: 'SERVER_ERROR' });
  }
});

// 当前用户
authRouter.get('/me', (req, res) => {
  const cookieToken = req.cookies?.token;
  const headerToken = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : null;

  const token = cookieToken || headerToken;
  
  if (!token) {
    return res.status(401).json({ error: '未登录', code: 'UNAUTHORIZED' });
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded?.uid) {
      return res.status(401).json({ error: '登录状态无效', code: 'UNAUTHORIZED' });
    }

    const user = db.prepare('SELECT id, email FROM users WHERE id = ?').get(decoded.uid);
    if (!user) {
      return res.status(401).json({ error: '用户不存在', code: 'UNAUTHORIZED' });
    }

    return res.json({ data: user });
  } catch (e) {
    console.error('Token verification error:', e);
    return res.status(401).json({ error: '登录状态无效', code: 'UNAUTHORIZED' });
  }
});

// 登出
authRouter.post('/logout', (req, res) => {
  // 清除cookie
  res.clearCookie('token', { path: '/' });
  res.json({ data: { message: '已成功登出' } });
});