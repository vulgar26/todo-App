import React, { useEffect, useState } from 'react';
import { listTasks, createTask, toggleTask, deleteTask } from './api/tasks';
import { Link } from 'react-router-dom';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  async function refresh() {
    try {
      setErr(null);
      const resp = await listTasks();
      setTasks(resp.data || []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  async function onAdd(e) {
  e.preventDefault();
  const text = input.trim();
  if (!text) return;
  
  console.log('🚀 Creating task with text:', text);
  console.log(tasks);
  
  try {
    // 调试：检查发送的数据
    console.log('Calling createTask with:', { text });
    const result = await createTask(text);
    console.log('✅ Task created successfully:', result);
    
    setInput('');
    await refresh();
  } catch (e) {
    console.error('❌ Task creation failed:', {
      message: e.message,
      status: e.status,
      stack: e.stack
    });
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
      await refresh();
    } catch (e) {
      setErr(e.message);
    }
  }

  if (loading) return <p>加载中...</p>;
  if (err) return <p style={{color:'red'}}>出错了：{err}</p>;

  return (
    <div style={{ padding: 16 }}>
      <h2>任务清单</h2>
      <form onSubmit={onAdd} style={{ margin: '12px 0' }}>
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="输入任务..." />
        <button type="submit" style={{ marginLeft: 8 }}>添加任务</button>
      </form>
      {tasks.length === 0 ? <p>没有任务</p> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map(t => (
            <li key={t.id} style={{ margin: '6px 0' }}>
              <label style={{ marginRight: 8 }}>
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={e => onToggle(t.id, e.target.checked)}
                />{' '}
                <span style={{ textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</span>
              </label>
              <Link to={`/task/${t.id}`} style={{ textDecoration: t.done ? 'line-through' : 'none' }}>
+               {t.text}
+             </Link>
              <button onClick={() => onDelete(t.id)} style={{ marginLeft: 8 }}>删除</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
