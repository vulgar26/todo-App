export const BASE = 'http://localhost:3000';

export async function request(path, method = 'GET', body) {
  if (typeof method === 'object' && body === undefined) {
    body = method; method = 'POST';
  }
  const init = {
    method,
    headers: { Accept: 'application/json' },
    credentials: 'include',          // 🟢 携带 cookie
  };
  if (body !== undefined) {
    init.headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(body);
  }

  const res  = await fetch(BASE + path, init);
  const text = await res.text();
  let data   = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }
  if (!res.ok) {
    const err = new Error(data?.error || data?.message || `${res.status} ${res.statusText}`);
    err.status = res.status; err.details = data?.details; throw err;
  }
  return data;
}
