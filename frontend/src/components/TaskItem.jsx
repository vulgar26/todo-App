// src/components/TaskItem.jsx
import React from 'react';

export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 0',
        listStyle: 'none',
        borderBottom: '1px solid #eee',
        textDecoration: task.done ? 'line-through' : 'none'
      }}
    >
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => onToggle(task.id, e.target.checked)}
        title="切换完成状态"
      />
      <span style={{ flex: 1 }}>{task.text}</span>
      <button onClick={() => onDelete(task.id)} aria-label="删除">删除</button>
    </li>
  );
}
