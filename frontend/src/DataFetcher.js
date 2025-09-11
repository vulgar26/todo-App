// 概念：副作用（请求/订阅/定时器/手动 DOM）写在 useEffect 里
// 为什么：保证“先渲染 UI，再做异步的外部交互”；依赖数组控制时机
// 原理：组件提交到 DOM 后执行 effect；依赖变化时重新执行；返回清理函数做收尾
// 底层逻辑：mount -> run effect；update(dep changed) -> cleanup -> run effect；unmount -> cleanup

import React, { useEffect, useState } from 'react';

export default function DataFetcher() {
  const [users, setUsers]   = useState([]);
  const [loading, setLoad]  = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    const controller = new AbortController(); // 取消请求用

    async function load() {
      try {
        setLoad(true);
        setError(null);
        // 演示公共 API（可换成本地 /data.json）
        const res = await fetch('https://jsonplaceholder.typicode.com/users?_limit=5', {
          signal: controller.signal
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setUsers(data);
      } catch (e) {
        if (e.name !== 'AbortError') setError(e.message || '网络错误');
      } finally {
        setLoad(false);
      }
    }

    load();
    return () => controller.abort(); // 清理：组件离开时中止请求，避免内存泄漏/警告
  }, []); // 依赖[]：只在首次挂载时执行一次

  if (loading) return <p>加载中...</p>;
  if (error)   return <p style={{ color:'red' }}>出错了：{error}</p>;

  return (
    <div>
      <h2>useEffect 拉取用户</h2>
      <ul>
        {users.map(u => <li key={u.id}><b>{u.name}</b> — {u.email}</li>)}
      </ul>
    </div>
  );
}
