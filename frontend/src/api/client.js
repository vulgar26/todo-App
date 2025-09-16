// src/api/client.js
export const BASE = 'http://localhost:3000'; // 本地开发直连后端

export async function request(path, options = {}) {
  const {
    method = 'GET',
    body,
    headers = {},
    ...rest
  } = options;

  const init = {
    method,
    credentials: 'include',                  // 自动带上 HttpOnly cookie
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : null),
      ...headers,
    },
    ...(body ? { body: typeof body === 'string' ? body : JSON.stringify(body) } : null),
    ...rest,
  };

  const res = await fetch(BASE + path, init);
  const text = await res.text();

  let data = null;
  try { data = text ? JSON.parse(text) : null; }
  catch { data = { raw: text }; }

  if (!res.ok) {
    const err = new Error(data?.error || data?.message || `${res.status} ${res.statusText}`);
    err.status = res.status;
    err.details = data?.details;
    throw err;
  }
  return data;
}
