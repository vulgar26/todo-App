// backend/tests/utils.pagination.test.js
import { parseListQuery } from '../src/utils/pagination.js';

describe('parseListQuery', () => {
  test('defaults and typing', () => {
    const r = parseListQuery({});
    expect(r).toEqual({
      offset: 0,
      limit: 20,
      done: undefined,
      sort: 'createdAt',
      order: 'desc'
    });
  });

  test('coerces strings, clamps numbers', () => {
    const r = parseListQuery({ offset: '-10', limit: '999', done: 'true', sort: 'id', order: 'asc' });
    expect(r.offset).toBe(0);       // 负数归 0
    expect(r.limit).toBeLessThanOrEqual(100); // 上限 100
    expect(r.done).toBe(true);
    expect(r.sort).toBe('id');
    expect(r.order).toBe('asc');
  });

  test('invalid done yields undefined', () => {
    const r = parseListQuery({ done: 'maybe' });
    expect(r.done).toBeUndefined();
  });
});
