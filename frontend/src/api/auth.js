// 让 auth.js 兼容老代码，同时用新对象实现
import { authApi } from './authApi';

export const me = authApi.me;
export const login = authApi.login;
export const logout = authApi.logout;
export const register = authApi.register; // 如果有注册功能