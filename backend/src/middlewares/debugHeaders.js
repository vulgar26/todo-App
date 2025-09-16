// backend/src/middlewares/debugHeaders.js
export function debugHeaders(req, res, next) {
  // 计算请求头大小
  const headersString = JSON.stringify(req.headers, null, 2);
  const headersSize = Buffer.byteLength(headersString, 'utf8');
  
  console.log('=== Request Debug Info ===');
  console.log(`URL: ${req.method} ${req.url}`);
  console.log(`Headers size: ${headersSize} bytes`);
  console.log(`Headers count: ${Object.keys(req.headers).length}`);
  
  // 显示所有请求头及其大小
  console.log('Individual headers:');
  for (const [key, value] of Object.entries(req.headers)) {
    const headerSize = Buffer.byteLength(`${key}: ${value}`, 'utf8');
    console.log(`  ${key}: ${headerSize} bytes`);
    if (headerSize > 1000) {
      console.log(`    ⚠️  Large header value: ${String(value).substring(0, 100)}...`);
    }
  }
  
  // 检查cookie
  if (req.headers.cookie) {
    console.log(`Cookie header size: ${Buffer.byteLength(req.headers.cookie, 'utf8')} bytes`);
    console.log(`Cookie content: ${req.headers.cookie.substring(0, 200)}${req.headers.cookie.length > 200 ? '...' : ''}`);
  } else {
    console.log('No cookie header found');
  }
  
  // 如果头部过大，详细记录
  if (headersSize > 8192) {
    console.log('❌ HEADERS TOO LARGE!');
    console.log('Full headers:', headersString);
  }
  
  console.log('========================\n');
  next();
}