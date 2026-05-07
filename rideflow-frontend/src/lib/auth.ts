import { api } from './api';

export const authAPI = {
  login:    (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: object) =>
    api.post('/auth/register', data),
  me:       () => api.get('/auth/me'),
};
