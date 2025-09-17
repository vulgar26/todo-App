// 概念：动态路由 /task/:id，用 useParams 读取 URL 参数
// 为什么：同一套组件模板，根据不同 id 展示不同任务
// 原理：Route 注册了 :id 占位符；useParams 从路由上下文读出 { id }
// 底层逻辑：匹配成功后，渲染 element，并把 params 注入 context

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTask, toggleTask, deleteTask } from './api/tasks';

export default function TaskDetail() {
  const { id } = useParams(); // { id: '0' } 之类的字符串
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  async function load() {
    try {
      setErr(null);
      const resp = await getTask(id);
      setTask(resp.data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { 
    setLoading(true);
    setErr(null);
    getTask(id)
      .then((resp) => setTask(resp.data))
      .catch((e) => setErr(e.message || String(e)))
      .finally(() => setLoading(false));
  }, [id]);

  if (err) {
  return <p style={{color: 'red'}}>{err.message || String(err)}</p>;
  }

  async function onToggle() {
    try {
      await toggleTask(task.id, !task.done);
      await load();
    } catch (e) { setErr(e.message); }
  }

  async function onDelete() {
    try {
      await deleteTask(task.id);
      // 删除后返回列表
      window.history.back();
    } catch (e) { setErr(e.message); }
  }

  if (loading) return <p>加载中...</p>;
  if (err) return <p style={{color:'red'}}>出错了：{err}</p>;
  if (!task) return <p>未找到该任务</p>;

  return (
    <div>
      <h2>任务详情</h2>
      <p><b>ID：</b>{task.id}</p>
      <p><b>内容：</b>{task.text}</p>
      <p>
        <b>状态：</b>
        <label>
          <input type="checkbox" checked={task.done} onChange={onToggle} />{' '}
          {task.done ? '已完成' : '未完成'}
        </label>
      </p>
      <button onClick={onDelete}>删除</button>
      <div style={{ marginTop: 12 }}>
        <Link to="/">← 返回任务清单</Link>
      </div>
    </div>
  );
}

