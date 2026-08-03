import React, { useState, useEffect, useCallback } from 'react';
import type { User } from '../types/User';
import type { AuthState } from '../types/Auth';
import { tokenStorage } from './tokenStorage';
import { setUnauthorizedCallback } from '../api/interceptors';
import { isTokenExpired } from '../utils/jwt';
import { AuthContext } from './authContextDefinition';


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const logout = useCallback(() => {
    tokenStorage.clearSession();
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const login = useCallback((token: string, user: User) => {
    tokenStorage.setToken(token);
    tokenStorage.setUser(user);
    setState({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const updateUser = useCallback((updatedFields: Partial<User>) => {
    setState((prev) => {
      if (!prev.user) return prev;
      const newUser = { ...prev.user, ...updatedFields };
      tokenStorage.setUser(newUser);
      return { ...prev, user: newUser };
    });
  }, []);

  useEffect(() => {
    setUnauthorizedCallback(logout);

    const token = tokenStorage.getToken();
    const user = tokenStorage.getUser();

    if (token && user) {
      if (isTokenExpired(token)) {
        logout();
      } else {
        setState({
          token,
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      }
    } else {
      setState({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, [logout]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
