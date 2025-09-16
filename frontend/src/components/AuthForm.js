import { useState } from 'react';
import { login, register, me } from '../api/auth.js'; // 你的路径可能是 ./auth.js

export default function AuthForm({ onAuthed }) {
  const [tab, setTab] = useState('login');      // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  async function handleLogin(e) {
    e.preventDefault();                         // ✅ 阻止表单默认提交(否则会 GET /api/auth/login)
    setErr('');
    try {
      await login(email, password);             // ✅ 触发 POST /api/auth/login
      const resp = await me();                               // 可选：刷新自己的登录态
      onAuthed?.(resp.data);
    } catch (ex) {
      setErr(ex.message || '登录失败');
    }
  }

  async function handleRegister(e) {
    e.preventDefault();                         // ✅ 同理
    setErr('');
    try {
      await register(email, password);          // ✅ POST /api/auth/register
      await login(email, password);             // 注册后直接登录（可选）
      await me();
      onAuthed?.();
    } catch (ex) {
      setErr(ex.message || '注册失败');
    }
  }

  return (
    <div>
      <div style={{marginBottom:8}}>
        <button type="button" onClick={()=>setTab('login')}>登录</button>
        <button type="button" onClick={()=>setTab('register')} style={{marginLeft:8}}>注册</button>
      </div>

      {tab === 'login' ? (
        <form onSubmit={handleLogin}>          {/* ✅ 没有 action 属性 */}
          <div>
            <label>邮箱：</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div>
            <label>密码：</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <button type="submit">登录</button>   {/* ✅ type=submit */}
        </form>
      ) : (
        <form onSubmit={handleRegister}>       {/* ✅ 没有 action */}
          <div>
            <label>邮箱：</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div>
            <label>密码：</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <button type="submit">注册</button>   {/* ✅ type=submit */}
        </form>
      )}

      {err && <p style={{color:'red'}}>{err}</p>}
    </div>
  );
}
