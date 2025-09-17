import React, { useEffect, useState } from 'react';
import { listTasks, createTask, toggleTask, deleteTask } from './api/tasks';
import { Link } from 'react-router-dom';

const TABS = [
  { key: 'all', label: '全部', done: undefined },
  { key: 'undone', label: '未完成', done: false },
  { key: 'done', label: '已完成', done: true },
]

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, totalPages: 1, totalCount:0 });
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q.trim()), 300);
    return () => clearTimeout(t);
  }, [q]);

  async function refresh(page = meta.page) {
    try {
      setLoading(true);
      setErr(null);

      const tabConf = TABS.find(t => t.key === tab);
      const resp = await listTasks({
        page,
        limit: meta.limit || 10,
        q: debouncedQ,
        done: tabConf.done,
      });
      
      setTasks(resp.data || []);
      setMeta(resp.meta || { page:1, limit: 10, totalPages: 1, totalCount: 0});    
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(1); }, [tab, debouncedQ]);

  useEffect(() => { refresh(1); }, []);

  async function onAdd(e) {
  e.preventDefault();
  const text = input.trim();
  if (!text) return;
  try {
    await createTask(text);
    setInput('');
    await refresh(1);
  } catch (e) {
    setErr(e.message);
  }
}

  async function onToggle(id, done) {
    try {
      await toggleTask(id, done);
      await refresh();
    } catch (e) {
      setErr(e.message);
    }
  }

  async function onDelete(id) {
    try {
      await deleteTask(id);
      const nextPage = (tasks.length === 1 && meta.page > 1) ? meta.page - 1 : meta.page;
      await refresh(nextPage);
    } catch (e) {
      setErr(e.message);
    }
  }

  function switchTab(next) {
    setTab(next);
  }

  function goPrev() {
    if (meta.page > 1) refresh(meta.page -1);
  }

  function goNext() {
    if(meta.page < meta.totalPages ) refresh(meta.page + 1);
  }

  if (loading && tasks.length === 0) return <p>加载中...</p>;
  if (err) return <p style={{color:'red'}}>出错了：{err}</p>;

  return (
    <div style={{ padding: 16, maxWidth: 640, margin: '0 auto' }}>
      <h2>任务清单</h2>

      <div style={{display:'flex', gap: 8, flexWrap: 'wrap', margin: '12px 0'}}>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder='搜索标题关键字...'
        style={{ flex: 1, minWidth: 200 }}
        />
      <form onSubmit={onAdd} style={{ display: 'flex', gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="输入任务..." />
        <button type="submit" style={{ marginLeft: 8 }}>添加任务</button>
      </form>
      </div>

      <div style={{display: 'flex', gap: 8, marginBottom: 12}}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => switchTab(t.key)}
            style={{
              padding: '6px 10px',
              borderRadius: 6,
              border: '1px solid #ddd',
              background: tab === t.key ? '#eef6ff' : '#fff',
              fontWeight: tab === t.key ? 600 : 400,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
        
      {tasks.length === 0 ? <p>没有任务</p> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map(t => (
            <li key={t.id} style={{ margin: '8px 0', display: 'flex', alignItems: 'center' }}>
              <label style={{ flex: 1, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={e => onToggle(t.id, e.target.checked)}
                  style={{ marginRight: 8}}
                />
                <span style={{ textDecoration: t.done ? 'line-through' : 'none' }}>
                  {t.text}
                </span>
              </label>
              <Link to={`/task/${t.id}`} style={{ textDecoration: t.done ? 'line-through' : 'none' }}>
                详情
              </Link>
              <button onClick={() => onDelete(t.id)} style={{ marginLeft: 8 }}>删除</button>
            </li>
          ))} 
        </ul>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12}}>
        <button onClick={goPrev} disabled={meta.page <= 1}>上一页</button>
        <span>第{meta.page}/{meta.totalPages}页（共{meta.totalPages}条）</span>
        <button onClick={goNext} disabled={meta.page >= meta.totalCount}>下一页</button>
      </div>
    </div>
  );
}
