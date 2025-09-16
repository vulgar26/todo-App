import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

import Counter from './Counter';
import DataFetcher from './DataFetcher';
import TaskDetail from './TaskDetail';
import TaskList from './TaskList';
import TaskListReducer from './TaskListReducer';
import { ThemeProvider } from './ThemeContext';

import { AuthProvider, useAuth } from './context/AuthContext.js';
import LoginPage from './pages/LoginPage.js'; // 新增：登录页
import PrivateRoute from './components/PrivateRoute.js'; // 新增：受保护路由

// 顶部导航
function NavBar() {
  const { user, logout } = useAuth();
  return (
    <nav style={{ marginBottom: 12 }}>
      <Link to="/">首页/任务清单</Link> |{' '}
      <Link to="/fetch">useEffect 拉数据</Link> |{' '}
      <Link to="/tasks-reducer">useReducer 任务</Link>
      <span style={{ marginLeft: 12, color:'#666' }}>
        {user ? `已登录：${user.email}` : '未登录'}
      </span>
      {user && (
        <button style={{marginLeft:10}} onClick={logout}>退出登录</button>
      )}
    </nav>
  );
}

// 首页内容
function HomePage() {
  return (
    <>
      <Counter />
      <TaskList />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ThemeProvider>
          <div className="App">
            <NavBar />
            <Routes>
              {/* 登录页 */}
              <Route path="/login" element={<LoginPage />} />

              {/* 注册页（如有） */}
              {/*<Route path="/register" element={<RegisterPage />} />

              {/* 首页和主任务列表，受保护 */}
              <Route path="/" element={
                <PrivateRoute>
                  <HomePage />
                </PrivateRoute>
              } />

              {/* 任务详情页，受保护 */}
              <Route path="/task/:id" element={
                <PrivateRoute>
                  <TaskDetail />
                </PrivateRoute>
              } />

              {/* 其它演示页面，受保护 */}
              <Route path="/fetch" element={
                <PrivateRoute>
                  <DataFetcher />
                </PrivateRoute>
              } />
              <Route path="/tasks-reducer" element={
                <PrivateRoute>
                  <TaskListReducer />
                </PrivateRoute>
              } />

              {/* 未定义路由跳转首页 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </ThemeProvider>
      </Router>
    </AuthProvider>
  );
}