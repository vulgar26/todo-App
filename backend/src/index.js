import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 访问日志
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 简单测试路由
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!', timestamp: new Date().toISOString() });
});

// 尝试导入和注册tasks路由，有错误就跳过
try {
  const { migrate } = await import('./db/migrate.js');
  const { tasksRouter } = await import('./routers/tasksRouter.js');
  
  // 运行数据库迁移
  migrate();
  console.log('✅ Database migrated successfully');
  
  // 注册任务路由
  app.use('/api/tasks', tasksRouter);
  console.log('✅ Tasks router registered');
  
} catch (error) {
  console.error('❌ Error setting up routes:', error);
  
  // 如果路由设置失败，提供一个备用的简单路由
  app.get('/api/tasks', (req, res) => {
    res.status(500).json({ 
      error: 'Tasks API not available',
      details: error.message
    });
  });
}

// 错误处理中间件 - 放在最后
app.use(errorHandler);

// 404处理
app.use('*', (req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'Not Found',
    code: 'NOT_FOUND',
    path: req.originalUrl,
    method: req.method
  });
});

// 只在非测试环境中启动服务器
let server;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(config.port, () => {
    console.log(`🚀 API listening at http://localhost:${config.port}`);
    console.log(`📝 Test endpoint: http://localhost:${config.port}/api/test`);
    console.log(`📋 Tasks endpoint: http://localhost:${config.port}/api/tasks`);
  });
}

// 导出服务器实例供测试使用
export { server };