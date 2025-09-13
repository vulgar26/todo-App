export function parseListQuery(q) {
  const offset = Math.max(0, Number(q.offset ?? 0));
  const limit  = Math.min(100, Math.max(1, Number(q.limit ?? 20)));
  const done   = q.done === undefined ? undefined :
                 q.done === 'true' ? true :
                 q.done === 'false' ? false : undefined;
  const sort   = q.sort ?? 'createdAt';
  const order  = (q.order ?? 'desc').toLowerCase() === 'asc' ? 'asc' : 'desc';
  return { offset, limit, done, sort, order };
}