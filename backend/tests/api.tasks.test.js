// backend/tests/api.tasks.test.js
import request from 'supertest';
import { app } from '../src/index.js';
import { migrate } from '../src/db/migrate.js';

// 每个 test suite 之前，建表（内存 DB）
beforeAll(() => {
  migrate();
});

describe('Tasks API', () => {
  test('GET /api/tasks returns 200 and array', async () => {
    const res = await request(app).get('/api/tasks').expect(200);
    // 你的统一成功格式：{ data: [...], meta: { pagination: ... } }
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body).toHaveProperty('meta.pagination');
  });

  test('POST /api/tasks 400 if title missing', async () => {
    // 后端校验：text 不能为空
    const res = await request(app)
      .post('/api/tasks')
      .send({ text: '' })
      .expect(400);

    expect(res.body).toMatchObject({
      error: expect.any(String),
      code: 'VALIDATION_ERROR',
    });
  });

  test('POST /api/tasks then GET has the new item', async () => {
    const create = await request(app)
      .post('/api/tasks')
      .send({ text: '写单元测试' })
      .expect(201);

    expect(create.body.data).toMatchObject({
      id: expect.any(Number),
      text: '写单元测试',
      done: false
    });

    const list = await request(app).get('/api/tasks').expect(200);
    const texts = list.body.data.map(t => t.text);
    expect(texts).toContain('写单元测试');
  });
});
