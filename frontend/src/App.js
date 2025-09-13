// 概念：整站入口布局 + 路由表（v6）
// 为什么：让“去哪一页就渲染哪一页”，避免所有组件同时出现
// 原理：BrowserRouter 提供路由上下文；Routes 根据 URL 匹配一个 Route 的 element 渲染
// 底层逻辑：Link 改变 history，不刷新页面；Route 用路径匹配规则选择组件

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import { ThemeProvider } from './ThemeContext';
import './App.css';

import Counter from './Counter';
import DataFetcher from './DataFetcher';
import LoginForm from './LoginForm';
import TaskDetail from './TaskDetail';
import TaskList from './TaskList';
import TaskListReducer from './TaskListReducer';

export default function App() {
  return (
    // BrowserRouter 必须包裹全局，子树里的 Link/Route 才能工作
    <ThemeProvider>
    <Router>
      <div className="App">

        {/* 🔗 顶部导航（客户端跳转，不会整页刷新） */}
        <nav style={{ marginBottom: 12 }}>
          <Link to="/">首页/任务清单</Link> |{' '}
          <Link to="/fetch">useEffect 拉数据</Link> |{' '}
          <Link to="/tasks-reducer">useReducer 任务</Link>
        </nav>

        {/* 🎯 路由出口：只渲染匹配到的那个页面 */}
        <Routes>
          {/* 首页：把只想在“列表页”显示的组件都放到 "/" 这个 Route 的 element 里 */}
          <Route
            path="/"
            element={
              <>
                {/* 这些组件只会出现在首页，不会出现在 /task/:id */}
                <Counter />
                <LoginForm />
                <TaskList />
              </>
            }
          />

          {/* 任务详情页：匹配 /task/任意id */}
          <Route path="/task/:id" element={<TaskDetail />} />

          {/* 练习页：高级 hooks */}
          <Route path="/fetch" element={<DataFetcher />} />
          <Route path="/tasks-reducer" element={<TaskListReducer />} />
        </Routes>
      </div>
    </Router>
    </ThemeProvider>

  );
}


