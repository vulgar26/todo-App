import React, { useReducer, useEffect, useState } from 'react';

// action 常量
const ADD = 'ADD';
const TOGGLE = 'TOGGLE';
const DELETE = 'DELETE';
const CLEAR = 'CLEAR';

// 纯函数：只根据输入返回新状态，不做副作用
function tasksReducer(state, action) {
  switch (action.type) {
    case ADD: {
      const text = action.payload?.text?.trim();
      if (!text) return state;
      return [...state, { id: Date.now(), text, done: false }];
    }
    case TOGGLE:
      return state.map(t =>
        t.id === action.payload.id ? { ...t, done: !t.done } : t
      );
    case DELETE:
      return state.filter(t => t.id !== action.payload.id);
    case CLEAR:
      return [];
    default:
      return state;
  }
}

// 懒初始化：从 localStorage 恢复
function init(initialArg) {
  try {
    const saved = localStorage.getItem('tasks_reducer');
    return saved ? JSON.parse(saved) : initialArg;
  } catch {
    return initialArg;
  }
}

export default function TaskListReducer() {
  const [tasks, dispatch] = useReducer(tasksReducer, [], init);
  const [input, setInput] = useState('');

  // 持久化
  useEffect(() => {
    localStorage.setItem('tasks_reducer', JSON.stringify(tasks));
  }, [tasks]);

  const onAdd = (e) => {
    e.preventDefault(); // 防止表单刷新
    dispatch({ type: ADD, payload: { text: input } });
    setInput('');
  };

  return (
    <div>
      <h2>useReducer 版任务清单</h2>
      <form onSubmit={onAdd}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="输入任务"
        />
        <button type="submit">添加</button>
        <button
          type="button"
          onClick={() => dispatch({ type: CLEAR })}
          disabled={tasks.length === 0}
        >
          清空
        </button>
      </form>

      {tasks.length === 0 ? (
        <p>没有任务</p>
      ) : (
        <ul>
          {tasks.map(t => (
            <li key={t.id} style={{ textDecoration: t.done ? 'line-through' : 'none' }}>
              <span
                onClick={() => dispatch({ type: TOGGLE, payload: { id: t.id } })}
                style={{ cursor: 'pointer', marginRight: 8 }}
                title="点击切换完成状态"
              >
                {t.text}
              </span>
              <button onClick={() => dispatch({ type: DELETE, payload: { id: t.id } })}>
                删除
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
