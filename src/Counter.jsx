import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0); // 初始化 count 为 0

  const increment = () => setCount(count + 1);  // 增加
  const decrement = () => setCount(count > 0 ? count - 1 : 0);  // 减少，防止负数

  return (
    <div>
      <h2>计数器</h2>
      <p>当前计数: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement} disabled={count === 0}>-</button>
    </div>
  );
}

export default Counter;
