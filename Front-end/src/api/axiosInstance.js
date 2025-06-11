import axios from 'axios';

// Retrieve API base URL from environment variables, with a fallback for development
// Using relative URL now to work with the Vite proxy
const API_BASE_URL = '/api'; 

// Store reference to auth context (will be set by AuthProvider)
let authContextRef = null;

// Function to set auth context reference
export const setAuthContext = (authContext) => {
  authContextRef = authContext;
};

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important: This ensures cookies are sent with requests
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get access token from auth context (memory)
    const accessToken = authContextRef?.accessToken;
    
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    // Log request for debugging (remove in production)
    // console.log('Starting Request:', config.method?.toUpperCase(), config.url);
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Track if we're currently refreshing token to avoid multiple refresh calls
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

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Return data directly for convenience
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      const { status, data } = error.response;

      // Handle 401 Unauthorized - Token expired or invalid
      if (status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // If we're already refreshing, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          }).catch(err => {
            return Promise.reject(err);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Try to refresh the token using HTTP-only cookie
          // Updated to use your correct endpoint: /auth/refresh-token
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh-token`,
            {},
            { 
              withCredentials: true,
              timeout: 5000,
            }
          );

          const { accessToken } = response.data;
          
          // Update token in auth context
          if (authContextRef?.updateAccessToken) {
            authContextRef.updateAccessToken(accessToken);
          }

          // Process queued requests
          processQueue(null, accessToken);
          
          // Retry original request with new token
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);

        } catch (refreshError) {
          // Refresh failed - redirect to login
          processQueue(refreshError, null);
          
          // Clear auth state
          if (authContextRef?.logout) {
            authContextRef.logout();
          }
          
          // Redirect to login page
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // Handle other HTTP errors
      if (status === 403) {
        console.error('Forbidden access - 403:', data);
      } else if (status === 404) {
        console.error('Resource not found - 404:', data);
      } else if (status >= 500) {
        console.error('Server error - 5xx:', data);
      }
      
      // Return structured error object
      return Promise.reject({
        message: data?.message || error.message,
        status,
        data,
      });
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.request);
      return Promise.reject({
        message: 'Network error, please check your connection and try again.',
        isNetworkError: true,
      });
    } else {
      // Request setup error
      console.error('Request setup error:', error.message);
      return Promise.reject({
        message: error.message,
      });
    }
  }
);

export default axiosInstance;
