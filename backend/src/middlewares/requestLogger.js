// backend/src/middlewares/requestLogger.js
export function requestLogger(req, res, next) {
  const start = Date.now();
  
  console.log(`\n📥 ${req.method} ${req.url}`);
  if (req.user) {
    console.log(`👤 User: ${req.user.id}`);
  }
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`📦 Body:`, req.body);
  }
  if (req.query && Object.keys(req.query).length > 0) {
    console.log(`🔍 Query:`, req.query);
  }

  // 拦截响应
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - start;
    console.log(`📤 ${res.statusCode} ${req.method} ${req.url} - ${duration}ms`);
    if (res.statusCode >= 400) {
      console.log(`❌ Error response:`, data);
    }
    console.log('---');
    originalSend.call(this, data);
  };

  next();
}