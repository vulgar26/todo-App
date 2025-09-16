import { request } from './client';

export const me      = ()         => request('/api/auth/me');
export const login   = (email,pw) => request('/api/auth/login','POST',{ email, password: pw });
export const register= (email,pw) => request('/api/auth/register','POST',{ email, password: pw });
export const logout  = ()         => request('/api/auth/logout','POST'); // 如果你实现了
