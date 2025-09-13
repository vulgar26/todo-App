import { mapServerTaskToClient } from './mapTask';

describe('mapServerTaskToClient', () => {
  test('maps fields and boolean', () => {
    const r = mapServerTaskToClient({
      id: 1, title: '学习 Jest', completed: 0, createdAt: '2025-09-13', updatedAt: '2025-09-13'
    });
    expect(r).toEqual({
      id: 1, text: '学习 Jest', done: false, createdAt: '2025-09-13', updatedAt: '2025-09-13'
    });
  });

  test('guards invalid input', () => {
    expect(mapServerTaskToClient(null)).toBeNull();
    expect(mapServerTaskToClient('')).toBeNull();
  });
});
