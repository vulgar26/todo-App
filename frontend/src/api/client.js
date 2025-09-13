// src/api/client.js
async function request(path, options = {}) {
  const url = path.startsWith('/api') ? path : `/api${path}`;
  const resp = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  if (resp.status === 204) return null;

  const text = await resp.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // 忽略 JSON 解析失败：非 JSON 响应（如 HTML 错页）时保留原始 text 到 err.raw
    data = null;
  }

  if (!resp.ok) {
    const message = data?.error || `HTTP ${resp.status} ${resp.statusText}`;
    const err = new Error(message);
    err.code = data?.code || 'HTTP_ERROR';
    err.status = resp.status;
    err.details = data?.details;
    err.raw = text;
    throw err;
  }
  return data;
}

export const api = {
  get:    (p)        => request(p, { method: 'GET' }),
  post:   (p, body)  => request(p, { method: 'POST',  body: JSON.stringify(body) }),
  patch:  (p, body)  => request(p, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (p)        => request(p, { method: 'DELETE' }),
};
