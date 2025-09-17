// src/hooks/useTasks.js
import { useCallback, useEffect, useMemo, useState } from 'react';

import { listTasks, createTask, toggleTask as apiToggle, deleteTask as apiDelete } from '../api/tasks';

export function useTasks() {
  const [tasks, setTasks]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await listTasks({ page: 1, limit:50, q:'', done: undefined });
      setTasks(res.items);
    } catch (e) {
      setError(e.message || '列表加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchList(); }, [fetchList]);

  const refresh = fetchList;

  const addTask = useCallback(async (text) => {
    try {
      setError(null);
      await createTask(text);
      await fetchList(); // 成功后刷新（稳妥）
    } catch (e) {
      setError(e.message || '添加失败');
      throw e;
    }
  }, [fetchList]);

  const toggleTask = useCallback(async (id, nextDone) => {
    try {
      setError(null);
      await apiToggle(id, nextDone);
      await fetchList();
    } catch (e) {
      setError(e.message || '更新失败');
      throw e;
    }
  }, [fetchList]);

  const removeTask = useCallback(async (id) => {
    try {
      setError(null);
      await apiDelete(id);
      await fetchList();
    } catch (e) {
      setError(e.message || '删除失败');
      throw e;
    }
  }, [fetchList]);

  return useMemo(() => ({
    tasks, loading, error, refresh, addTask, toggleTask, removeTask
  }), [tasks, loading, error, refresh, addTask, toggleTask, removeTask]);
}
