// src/TaskList.js
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "./ThemeContext";
import { useTasks } from "./hooks/useTasks";
import TaskItem from "./components/TaskItem";

export default function TaskList() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [input, setInput] = useState('');
  const { tasks, loading, error, refresh, addTask, toggleTask, removeTask } = useTasks();

  const onSubmit = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    await addTask(text);
    setInput('');
  };

  return (
    <div style={{
      background: theme === 'light' ? '#fff' : '#333', 
      color: theme === 'light' ? '#000' : '#fff',
      padding: '20px'
    }}>
      <h2>任务清单</h2>

      <div style={{ display:'flex', gap:8, marginBottom:12 }}>
        <button onClick={toggleTheme}>切换主题 ({theme === 'light' ? '浅色' : '深色'})</button>
        <button onClick={refresh}>刷新</button>
      </div>

      <form onSubmit={onSubmit} style={{ margin: '15px 0' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入任务内容..."
          style={{ marginRight: '10px', padding: '8px 12px', width: '300px' }}
        />
        <button type="submit">添加任务</button>
      </form>

      {loading && <p>加载中...</p>}
      {error && (
        <div style={{ color:'#d32f2f', background:'#ffebee', padding:'10px', borderRadius:'4px', marginBottom:'15px' }}>
          ❌ 出错了：{error}
        </div>
      )}

      {(!loading && tasks.length === 0) ? (
        <p style={{ color: '#666' }}>暂无任务。尝试添加一个任务吧！</p>
      ) : (
        <ul style={{ listStyle:'none', padding:0 }}>
          {tasks.map(task => (
            <div key={task.id} style={{ border:'1px solid #ccc', borderRadius:4, margin:'6px 0', padding:'6px 10px' }}>
              <TaskItem task={task} onToggle={toggleTask} onDelete={removeTask} />
              <div style={{ fontSize:12, marginTop:4 }}>
                <Link to={`/task/${task.id}`}>详情</Link>
              </div>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
}
