import { create } from 'zustand';
import api from '../utils/api';

const useAdminStore = create((set) => ({
  isAdmin: !!localStorage.getItem('admin_token'),
  token: localStorage.getItem('admin_token'),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('admin_token', res.data.token);
      set({ isAdmin: true, token: res.data.token, loading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Login failed', loading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('admin_token');
    set({ isAdmin: false, token: null });
  },

  verifyToken: async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) return set({ isAdmin: false });
    try {
      await api.get('/auth/verify');
      set({ isAdmin: true, token });
    } catch {
      localStorage.removeItem('admin_token');
      set({ isAdmin: false, token: null });
    }
  }
}));

export default useAdminStore;
