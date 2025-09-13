export const ok = (res, data, meta) => {
  return res.json({ data, ...(meta ? { meta } : {}) });
};

export const created = (res, data) => {
  return res.status(201).json({ data });
};

export const noContent = (res) => {
  return res.status(204).end();
};