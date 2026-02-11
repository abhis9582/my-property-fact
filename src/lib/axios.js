import axios from 'axios';
import Cookies from 'js-cookie';
import { API_V1 } from './apiConfig';

// Create axios instance (all APIs are versioned under /api/v1)
const apiClient = axios.create({
  baseURL: API_V1,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor - Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = Cookies.get('refreshToken');

      if (!refreshToken) {
        isRefreshing = false;
        processQueue(error, null);
        // Redirect to login if no refresh token
        if (typeof window !== 'undefined') {
          const isAdminRoute = window.location.pathname.startsWith('/admin');
          const isPortalRoute = window.location.pathname.startsWith('/portal');
          
          if (isAdminRoute) {
            window.location.href = '/admin';
          } else if (isPortalRoute) {
            window.location.href = '/portal';
          }
        }
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${API_V1}auth/refresh`,
          { refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const { token: newToken, refreshToken: newRefreshToken } = response.data;

        if (newToken) {
          // Update cookies with new tokens
          Cookies.set('token', newToken, {
            expires: 1, // 1 day
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            path: '/',
          });
          
          if (newRefreshToken) {
            Cookies.set('refreshToken', newRefreshToken, {
              expires: 7, // 7 days
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'Strict',
              path: '/',
            });
          }

          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          // Process queued requests
          processQueue(null, newToken);
          isRefreshing = false;

          // Retry the original request
          return apiClient(originalRequest);
        } else {
          throw new Error('No token received from refresh endpoint');
        }
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);
        
        // Clear cookies and redirect to login
        Cookies.remove('token', { path: '/' });
        Cookies.remove('refreshToken', { path: '/' });

        if (typeof window !== 'undefined') {
          const isAdminRoute = window.location.pathname.startsWith('/admin');
          const isPortalRoute = window.location.pathname.startsWith('/portal');
          
          if (isAdminRoute) {
            window.location.href = '/admin';
          } else if (isPortalRoute) {
            window.location.href = '/portal';
          }
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

