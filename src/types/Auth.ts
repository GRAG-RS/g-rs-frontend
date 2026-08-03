import type { User } from './User';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
}

export interface JwtPayload {
  sub: string;
  name?: string;
  email?: string;
  role?: string;
  exp?: number;
  iat?: number;
}
