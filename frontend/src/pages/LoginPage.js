import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { login, error, loading, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    if (!error) nav('/app');
  };

  if (user) {
    nav('/app');
    return null;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>登录</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="邮箱" />
      <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="密码" />
      <button type="submit" disabled={loading}>{loading ? '登录中…' : '登录'}</button>
    </form>
  );
}