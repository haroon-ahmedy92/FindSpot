import axiosInstance from './axiosInstance';
import axios from 'axios';

// Get API base URL for direct axios calls (refresh token)
// Vite uses import.meta.env instead of process.env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const AuthService = {
  // Login with credentials
  login: async (credentials) => {
    try {
      // Use axiosInstance for login to get both access token and refresh token (as HTTP-only cookie)
      const response = await axiosInstance.post('/auth/login', credentials);
      
      // Backend returns: { "accessToken": "...", "type": "Bearer", "message": "Login successful" }
      // Refresh token is automatically set as HTTP-only cookie
      
      if (!response.accessToken) {
        throw new Error('No access token received from server');
      }
      
      return {
        accessToken: response.accessToken,
        tokenType: response.type,
        message: response.message,
        // Note: user data is not returned by your backend, will need to fetch separately if needed
        user: null, // You might want to add a separate endpoint to get user profile
      };
    } catch (error) {
      console.error('Login failed in AuthService:', error);
      throw error;
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      // Backend expects: { "fullName", "email", "phone", "username", "password" }
      const response = await axiosInstance.post('/auth/register', userData);
      
      // Backend returns plain text: "User registered successfully!"
      // No auto-login after registration
      return {
        message: response, // This will be the success message string
        success: true,
      };
    } catch (error) {
      console.error('Registration failed in AuthService:', error);
      throw error;
    }
  },

  // Refresh access token using HTTP-only cookie
  refreshToken: async () => {
    try {
      // Use direct axios call to avoid interceptor interference
      // Your endpoint is /auth/refresh-token (not /auth/refresh)
      const response = await axios.post(
        `${API_BASE_URL}/auth/refresh-token`,
        {}, // No body required
        {
          withCredentials: true, // Send HTTP-only cookie
          timeout: 5000,
        }
      );
      
      // Backend returns: { "accessToken": "...", "type": "Bearer", "message": "Token refreshed successfully" }
      return {
        accessToken: response.data.accessToken,
        tokenType: response.data.type,
        message: response.data.message,
        user: null, // User data not returned by refresh endpoint
      };
    } catch (error) {
      // If refresh fails, user needs to login again
      console.error('Token refresh failed:', error);
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      // Notify backend to invalidate refresh token
      const response = await axiosInstance.post('/auth/logout');
      console.log('Logout response:', response); // Will be "Logged out successfully"
    } catch (error) {
      // Log error but don't throw - we still want to clear local state
      console.error('Logout request failed:', error);
    }
    
    // Clear any client-side storage if needed
    // Note: HTTP-only cookies will be cleared by the backend
    return Promise.resolve();
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    try {
      // Backend expects: { "email": "user@example.com" }
      const response = await axiosInstance.post('/auth/forgot-password', { email });
      
      // Backend returns plain text: "Password reset instructions sent to your email."
      return {
        message: response, // This will be the success message string
        success: true,
      };
    } catch (error) {
      console.error('Password reset request failed:', error);
      throw error;
    }
  },

  // Verify if refresh token is still valid (optional - you can implement this later)
  verifyRefreshToken: async () => {
    try {
      // You don't have this endpoint yet, but it's good to have for future
      const response = await axios.post(
        `${API_BASE_URL}/auth/verify-refresh`,
        {},
        {
          withCredentials: true,
          timeout: 5000,
        }
      );
      
      return response.data.valid === true;
    } catch (error) {
      return false;
    }
  },

  // Get current user profile (you might want to add this endpoint to your backend)
  getCurrentUserProfile: async () => {
    try {
      // This endpoint doesn't exist in your backend yet
      // You might want to add GET /api/auth/profile or /api/user/profile
      const response = await axiosInstance.get('/auth/profile');
      return response;
    } catch (error) {
      console.error('Failed to get user profile:', error);
      throw error;
    }
  },
};

export default AuthService;
