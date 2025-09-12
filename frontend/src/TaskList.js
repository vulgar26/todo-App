import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "./ThemeContext";

function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [input, setInput] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { theme, toggleTheme } = useContext(ThemeContext);

    const [version, setVersion] = useState(0);
    const bump = () => setVersion(v => v + 1);

    async function addTask() {
        const t = input.trim();
        if (!t) return;
        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type':'application/json' },
                body: JSON.stringify({ text: t })
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const created = await res.json();
            setTasks(prev => [...prev, created]);
            setInput('');
            bump();
        } catch (e) {
            setError(`添加失败：${e.message}`);
        }
    }

    async function deleteTask(id) {
        try {
            const res = await fetch(`/api/tasks/${id}`, { method:'DELETE' });
            if (res.status !== 204) throw new Error(`HTTP ${res.status}`);
            setTasks(prev => prev.filter(t => t.id !== id));
            bump();
        } catch (e) {
            setError(`删除失败：${e.message}`);
        }
    }

    async function toggleDone(task) {
    try {
        setError(null);
        const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ done: !task.done })
        });
        if (!res.ok) {
        const text = await res.text().catch(()=> '');
        throw new Error(`HTTP ${res.status} ${text}`);
        }
        bump(); // 成功后刷新列表
        } catch (e) {
        setError(`更新失败：${e.message}`);
        }
    }

    useEffect(() => {
        (async () => {
            try {
                if (version === 0) setLoading(true);
                setError(null);
                const res = await fetch('/api/tasks');
                if (!res.ok) {
                    const text = await res.text().catch(()=> '');
                    throw new Error(`HTTP ${res.status} ${res.statusText} | ${text.slice(0,120)}`);
                }
                const data = await res.json();
                setTasks(data);
            } catch (e) {
                console.error('GET /api/tasks failed:', e);
                setError(e.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [version]);

    if (loading) return <p>加载中...</p>;
    if (error) return <p style={{ color: 'red' }}>出错了：{error}</p>;

    return (
        <div style={{
            background: theme === 'light' ? '#fff' : '#333', 
            color: theme === 'light' ? '#000' : '#fff',
            padding: '20px'
        }}>
            <h2>任务清单</h2>
            <button onClick={toggleTheme}>切换主题</button>
            <div style={{ margin: '10px 0' }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="输入任务"
                    style={{ marginRight: '10px', padding: '5px' }}
                />
                <button onClick={addTask}>添加任务</button>
            </div>

            {tasks.length === 0 ? (
                <p>没有任务</p>
            ) : (
                <ul>
                    {tasks.map((task) => (
                        <li key={task.id} style={{ margin: '5px 0', listStyle: 'none' }}>
                            <label style={{marginRight: 10}}>
                                <input
                                  type="checkbox"
                                  checked={task.done}
                                  onChange={() => toggleDone(task)}
                                />
                                <span style={{ textDecoration: task.done ? 'line-through' : 'none'}}>
                                    {task.text}
                                </span>
                            </label>
                            <Link to={`/task/${task.id}`} style={{ marginRight: '10px' }}>详情</Link>
                            <button 
                                onClick={() => deleteTask(task.id)}
                                style={{ marginLeft: '10px' }}
                            >
                                删除
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default TaskList;