import { useContext } from 'react';
import { AuthContext } from './authContext';
import { hasPermission, type Permission } from './permissions';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const usePermissions = () => {
  const { user } = useAuth();
  
  return {
    can: (permission: Permission) => hasPermission(user?.role, permission),
    role: user?.role,
  };
};
