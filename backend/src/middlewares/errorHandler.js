export function errorHandler(err, _req, res, _next) {
  // 统一错误出口
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: '服务器错误', code: 'SERVER_ERROR' });
}
