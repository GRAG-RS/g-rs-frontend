import { createContext } from 'react';
import type { User } from '../types/User';
import type { AuthState } from '../types/Auth';

export interface AuthContextType extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
