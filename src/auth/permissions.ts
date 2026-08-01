import { ROLES, type UserRole } from '../constants/roles';

export type Permission = 
  | 'VIEW_EMPLOYEES' 
  | 'MANAGE_EMPLOYEES' 
  | 'VIEW_PRODUCTS' 
  | 'MANAGE_PRODUCTS' 
  | 'VIEW_PROFILE';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [ROLES.ADMIN]: ['VIEW_EMPLOYEES', 'MANAGE_EMPLOYEES', 'VIEW_PRODUCTS', 'MANAGE_PRODUCTS', 'VIEW_PROFILE'],
  [ROLES.HR]: ['VIEW_EMPLOYEES', 'MANAGE_EMPLOYEES', 'VIEW_PRODUCTS', 'VIEW_PROFILE'],
  [ROLES.EMPLOYEE]: ['VIEW_EMPLOYEES', 'VIEW_PRODUCTS', 'VIEW_PROFILE'],
};

export const hasPermission = (role: UserRole | undefined, permission: Permission): boolean => {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
};
