// src/App.test.js
import { render, screen } from '@testing-library/react';
import App from './App';

// 静音 React Router 的 future flags 告警（仅限测试环境）
const warn = console.warn;
beforeAll(() => {
  console.warn = (...args) => {
    const msg = String(args[0] ?? '');
    if (msg.includes('React Router Future Flag Warning')) return;
    warn(...args);
  };
});
afterAll(() => {
  console.warn = warn;
});

test('首页能看到「任务清单」标题', () => {
  render(<App />);
  expect(screen.getByText('任务清单')).toBeInTheDocument();
});
