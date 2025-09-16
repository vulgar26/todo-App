import { request } from './client';

export const authApi = {
  async register(email, password) {
    return request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  async login(email, password) {
    return request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  async logout() {
    return request('/api/auth/logout', { method: 'POST' });
  },
  async me() {
    return request('/api/auth/me');
  }
};