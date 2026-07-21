import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response Interceptor for handling expired access tokens
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // We do NOT want to intercept 401s on login, register, or refresh routes
    const isAuthRoute = 
      originalRequest.url?.includes('/auth/login') || 
      originalRequest.url?.includes('/auth/register') ||
      originalRequest.url?.includes('/auth/refresh-token');

    // If it's a 401, we haven't retried yet, AND it's not an auth route
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${baseURL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        return api(originalRequest);
        
      } catch (refreshError) {
        // Only force a redirect if the user isn't already on the landing page
        if (typeof window !== 'undefined' && 
            window.location.pathname !== '/' && 
            !window.location.pathname.startsWith('/register')) {
          window.location.href = '/';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);