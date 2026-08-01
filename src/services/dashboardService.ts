import { employeeService } from './employeeService';
import { productService } from './productService';
import type { DashboardMetrics } from '../types';

export class DashboardService {
  async getMetrics(): Promise<DashboardMetrics> {
    const [employees, products] = await Promise.all([
      employeeService.getEmployees(),
      productService.getProducts(),
    ]);

    const activeEmployees = employees.filter((e) => e.status === 'Active').length;

    return {
      totalEmployees: employees.length,
      activeEmployees,
      totalProducts: products.length,
      recentEmployees: employees.slice(0, 5),
      recentProducts: products.slice(0, 5),
      systemHealth: 'Optimal',
    };
  }
}

export const dashboardService = new DashboardService();
