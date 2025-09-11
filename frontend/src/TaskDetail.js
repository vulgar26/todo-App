// 概念：动态路由 /task/:id，用 useParams 读取 URL 参数
// 为什么：同一套组件模板，根据不同 id 展示不同任务
// 原理：Route 注册了 :id 占位符；useParams 从路由上下文读出 { id }
// 底层逻辑：匹配成功后，渲染 element，并把 params 注入 context

import React from "react";
import { useParams, Link } from "react-router-dom";

export default function TaskDetail() {
  const { id } = useParams(); // { id: '0' } 之类的字符串

  return (
    <div>
      <h2>任务详情</h2>
      <p>当前任务 ID：{id}</p>

      {/* 真实项目里：可以根据 id 去 store 或接口拿详情 */}
      {/* <TaskContent id={id} /> */}

      <Link to="/" style={{ display: 'inline-block', marginTop: 12 }}>
        ← 返回任务清单
      </Link>
    </div>
  );
}

