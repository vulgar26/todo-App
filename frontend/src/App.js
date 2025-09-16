import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Counter from './Counter';
import DataFetcher from './DataFetcher';
import TaskDetail from './TaskDetail';
import TaskList from './TaskList';
import TaskListReducer from './TaskListReducer';
import { ThemeProvider } from './ThemeContext';
import { me , logout } from './api/auth';
import AuthForm from './components/AuthForm';   // ★ 必须存在且路径正确

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const resp = await me();
        setUser(resp.data);
      } catch {
        setUser(null);
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  return (
    <Router>
      <ThemeProvider>
        <div className="App">
          <nav style={{ marginBottom: 12 }}>
            <Link to="/">首页/任务清单</Link> |{' '}
            <Link to="/fetch">useEffect 拉数据</Link> |{' '}
            <Link to="/tasks-reducer">useReducer 任务</Link>
            <span style={{ marginLeft: 12, color:'#666' }}>
              {user ? `已登录：${user.email}` : '未登录'}
            </span>
          </nav>

          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Counter />
                  {/* ★★★ 没登录时应该能看到这个表单 ★★★ */}
                  {!user && <AuthForm onLogin={setUser} />}

                  {checking ? (
                    <p>检查登录状态...</p>
                  ) : user ? (
                    <TaskList />   // 已登录 → 展示任务
                  ) : (
                    <p style={{color:'#a33'}}>请先登录后再操作任务</p>
                  )}
                  {user && (
                    <button onClick={async () => {
                    await logout();
                    setUser(null);
                    }}>
                      退出登录
                    </button>
                  )}
                </>
              }
            />
            <Route path="/task/:id" element={<TaskDetail />} />
            <Route path="/fetch" element={<DataFetcher />} />
            <Route path="/tasks-reducer" element={<TaskListReducer />} />
          </Routes>
        </div>
      </ThemeProvider>
    </Router>
  );
}
