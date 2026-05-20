import { api } from '@/lib/api';

// Strictly matching your backend response data structure
export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: User;
}

export const authService = {
  login: async (credentials: Record<string, string>) => {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    return data;
  },

  register: async (userData: Record<string, string>) => {
    const { data } = await api.post<AuthResponse>('/auth/register', userData);
    return data;
  },

  logout: async () => {
    const { data } = await api.post('/auth/logout');
    return data;
  },

  getCurrentUser: async () => {
    const { data } = await api.get<AuthResponse>('/auth/me');
    return data;
  },
  
  // Note: /auth/refresh-token is usually handled via an Axios interceptor 
  // behind the scenes, but we can expose it here if manual calls are needed.
  refreshToken: async () => {
    const { data } = await api.post('/auth/refresh-token');
    return data;
  }
};