import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

export const app = express();

// ✅ CORS配置优化
app.use(cors({ 
  origin: 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // 24小时预检缓存
}));

// ✅ 增加请求大小和头部限制
app.use(express.json({ 
  limit: '10mb',
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb',
}));

// ✅ Cookie解析器 - 在body解析器之前
app.use(cookieParser());

import { config } from './config.js';
import { migrate } from './db/migrate.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { authRequired } from './middlewares/authRequired.js';
import { authRouter } from './routers/authRouter.js';
import { tasksRouter } from './routers/tasksRouter.js';
import { debugHeaders } from './middlewares/debugHeaders.js';

// 放在 app.use(express.json(...)) 之前也行，反正非常靠前
app.use((req, _res, next) => {
  console.log(`➡️  ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ 添加调试中间件（开发环境）
if (process.env.NODE_ENV === 'development') {
  app.use(debugHeaders);
}

// ✅ Helmet配置优化
app.use(helmet({
  crossOriginEmbedderPolicy: false, // 避免某些问题
}));

// ✅ 添加请求头大小检查中间件
app.use((req, res, next) => {
  const headerSize = JSON.stringify(req.headers).length;
  
  // 如果请求头过大，记录并返回错误
  if (headerSize > 8192) { // 8KB限制
    console.warn(`Large request headers detected: ${headerSize} bytes`);
    console.warn('Headers:', Object.keys(req.headers));
    return res.status(431).json({ 
      error: '请求头过大，请尝试清除浏览器cookie或重新登录', 
      code: 'HEADERS_TOO_LARGE' 
    });
  }
  
  next();
});

// ping
app.get('/api/test', (_req, res) => res.json({ ok: true, ts: Date.now() }));

// DB migrate
migrate();

// open routes
app.use('/api/auth', authRouter);

// protected routes
app.use('/api/tasks', authRequired, tasksRouter);

// ✅ 统一的登出路由（移除重复定义）
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token', { 
    path: '/',
    httpOnly: true,
    sameSite: 'strict'
  });
  res.json({ data: { message: '已成功登出' } });
});

// 404
app.use('*', (req, res) => res.status(404).json({ error: 'Not Found', code: 'NOT_FOUND' }));

// error handler
app.use(errorHandler);

if (!config.isTest) {
  const server = app.listen(config.port, () => {
    console.log(`🚀 API listening http://localhost:${config.port}`);
  });
  
  // ✅ 设置服务器限制
  server.maxHeadersCount = 20; // 限制头部数量
  server.headersTimeout = 5000; // 5秒头部超时
}

// 临时调试用，生产环境请删除
app.get('/api/debug/tasks', async (req, res) => {
  const rows = await db.all('SELECT * FROM tasks');
  res.json(rows);
});