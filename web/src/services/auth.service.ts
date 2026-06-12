import api from './api';
import type { AuthResponse, OTPResponse, User } from '../types';

export const authService = {
  adminLogin: async (credentials: { username: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post('/admin/auth/login', credentials);
    const token = response.data?.token;

    if (token) {
      const adminUser: User = {
        id: 'admin',
        name: credentials.username,
        phone: 'Admin',
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(adminUser));

      return {
        success: true,
        message: response.data?.message || 'Admin login successful',
        token,
        user: adminUser,
      };
    }

    return {
      success: false,
      message: response.data?.message || 'Admin login failed',
    };
  },

  adminGoogleLogin: async (credential: string): Promise<AuthResponse> => {
    const response = await api.post('/admin/auth/google', { credential });
    const token = response.data?.token;

    if (token) {
      const adminUser: User = {
        id: 'admin',
        name: 'Admin',
        phone: 'Admin',
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(adminUser));

      return {
        success: true,
        message: response.data?.message || 'Google login successful',
        token,
        user: adminUser,
      };
    }

    return {
      success: false,
      message: response.data?.message || 'Google login failed',
    };
  },

  // Send OTP to phone number
  sendOTP: async (phone: string): Promise<OTPResponse> => {
    const response = await api.post('/auth/send-otp', { phone });
    return response.data;
  },

  // Verify OTP and login
  verifyOTP: async (phone: string, otp: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/verify-otp', { phone, otp });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Register new user
  register: async (userData: {
    name: string;
    phone: string;
    email?: string;
    otp: string;
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};
