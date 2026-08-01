import type { Employee } from './Employee';
import type { Product } from './Product';

export interface DashboardMetrics {
  totalEmployees: number;
  activeEmployees: number;
  totalProducts: number;
  recentEmployees: Employee[];
  recentProducts: Product[];
  systemHealth: string;
}
