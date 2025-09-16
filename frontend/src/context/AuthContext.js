import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 开机自动检测登录状态
  useEffect(() => {
    authApi.me().then(r => {
      setUser(r.data);
      setLoading(false);
    }).catch(() => {
      setUser(null);
      setLoading(false);
    });
  }, []);

  // 登录
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      await authApi.login(email, password);
      const r = await authApi.me();
      setUser(r.data);
    } catch (e) {
      setError(e.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 注册
  const register = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      await authApi.register(email, password);
      const r = await authApi.me();
      setUser(r.data);
    } catch (e) {
      setError(e.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 登出
  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await authApi.logout();
      setUser(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // 手动刷新用户
  const refreshMe = async () => {
    setLoading(true);
    try {
      const r = await authApi.me();
      setUser(r.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user, loading, error,
      login, register, logout, refreshMe
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}