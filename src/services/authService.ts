import { apiClient } from '../api';
import { API_ENDPOINTS } from '../constants/api';
import type { AuthResponse, User } from '../types';
import { logger } from '../utils/logger';

export const DEMO_JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzcl9wcm9kXzEwMSIsImVtYWlsIjoidXNlckBjb21wYW55LmNvbSIsInJvbGUiOiJBRE1JTiIsImV4cCI6MjUyNDYwODAwMH0.c2VjdXJlX2RlbW9fc2lnbmF0dXJlX2hhc2hfcHJvZHVjdGlvbg';

export class AuthService {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<any>(API_ENDPOINTS.AUTH.LOGIN, { email, password });
      const body = response.data;
      const rawData = body?.data || body;

      if (body?.success === false) {
        throw new Error(body?.message || 'Invalid username or password.');
      }

      const token = rawData?.token || rawData?.access_token || rawData?.accessToken || rawData?.jwt;

      if (!token) {
        throw new Error('Authentication failed: No valid JWT access token received from backend server.');
      }

      const user: User = rawData.user || {
        id: String(rawData.id || rawData.user_id || '101'),
        name: email.split('@')[0] ? email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1) : 'User',
        email: email,
        role: rawData.role || 'ADMIN',
      };

      return { token, user };
    } catch (err: any) {
      if (err.response) {
        const serverMessage = err.response.data?.message || err.response.data?.detail || 'Invalid username or password.';
        throw new Error(serverMessage);
      }
      logger.error('Login request failed:', err);
      throw err;
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (err) {
      logger.warn('Backend logout API call skipped.', err);
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>(API_ENDPOINTS.AUTH.ME);
    return response.data;
  }
}

export const authService = new AuthService();
