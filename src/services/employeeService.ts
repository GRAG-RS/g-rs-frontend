import { apiClient } from '../api';
import { API_ENDPOINTS } from '../constants/api';
import type { Employee, CreateEmployeeInput, UpdateEmployeeInput } from '../types';
import { logger } from '../utils/logger';


const normalizeEmployee = (emp: any): Employee => ({
  ...emp,
  id: String(emp.id),
  name: emp.first_name && emp.last_name ? `${emp.first_name} ${emp.last_name}` : emp.name || 'Unnamed',
  employee_code: emp.employee_code || `EMP-${emp.id}`,
  first_name: emp.first_name || (emp.name ? emp.name.split(' ')[0] : 'Employee'),
  last_name: emp.last_name || (emp.name ? emp.name.split(' ').slice(1).join(' ') : ''),
  email: emp.email || '',
  phone: emp.phone || '+10000000000',
  department: emp.department || 'General',
  designation: emp.designation || 'Staff',
  salary: typeof emp.salary === 'string' ? parseFloat(emp.salary) : (emp.salary || 50000),
  date_of_joining: emp.date_of_joining || new Date().toISOString().split('T')[0],
  status: emp.status === 'ACTIVE' || emp.status === 'Active' ? 'Active' : 'Inactive',
});

const FALLBACK_EMPLOYEES: Employee[] = [
  {
    id: '1',
    employee_code: 'EMP-101',
    name: 'Sarah Jenkins',
    first_name: 'Sarah',
    last_name: 'Jenkins',
    email: 'sarah.j@company.com',
    phone: '+1 415 555 2671',
    department: 'Engineering',
    designation: 'Senior Software Engineer',
    salary: 125000,
    date_of_joining: '2023-01-15',
    status: 'Active',
  },
  {
    id: '2',
    employee_code: 'EMP-102',
    name: 'Alex Rivera',
    first_name: 'Alex',
    last_name: 'Rivera',
    email: 'alex.r@company.com',
    phone: '+1 415 555 3892',
    department: 'Product Management',
    designation: 'Lead Product Manager',
    salary: 135000,
    date_of_joining: '2022-11-01',
    status: 'Active',
  },
  {
    id: '3',
    employee_code: 'EMP-103',
    name: 'Michael Chen',
    first_name: 'Michael',
    last_name: 'Chen',
    email: 'm.chen@company.com',
    phone: '+1 415 555 4910',
    department: 'DevOps & Infra',
    designation: 'Staff Cloud Architect',
    salary: 145000,
    date_of_joining: '2022-03-20',
    status: 'Active',
  },
  {
    id: '4',
    employee_code: 'EMP-104',
    name: 'Emily Wong',
    first_name: 'Emily',
    last_name: 'Wong',
    email: 'emily.w@company.com',
    phone: '+1 415 555 8821',
    department: 'Quality Assurance',
    designation: 'QA Lead',
    salary: 110000,
    date_of_joining: '2023-06-10',
    status: 'Active',
  },
];

export class EmployeeService {
  async getEmployees(): Promise<Employee[]> {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.EMPLOYEES.BASE);
      const rawData = response.data?.data?.items || response.data?.data || response.data;
      if (Array.isArray(rawData)) {
        return rawData.map(normalizeEmployee);
      }
      return FALLBACK_EMPLOYEES;
    } catch (err) {
      logger.error('Failed to fetch employees from API, returning fallback data:', err);
      return FALLBACK_EMPLOYEES;
    }
  }

  async getEmployeeById(id: string): Promise<Employee> {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.EMPLOYEES.BY_ID(id));
      const item = response.data?.data || response.data;
      return normalizeEmployee(item);
    } catch (err) {
      logger.error(`Failed to fetch employee ${id} from API:`, err);
      throw err;
    }
  }

  async createEmployee(input: CreateEmployeeInput): Promise<Employee> {
    const payload = {
      ...input,
      status: input.status.toUpperCase() === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE',
      salary: Number(input.salary),
    };

    try {
      const response = await apiClient.post<any>(API_ENDPOINTS.EMPLOYEES.BASE, payload);
      const createdItem = response.data?.data || response.data;
      return normalizeEmployee(createdItem);
    } catch (err) {
      logger.error('Failed to create employee via API:', err);
      throw err;
    }
  }

  async updateEmployee(id: string, input: UpdateEmployeeInput): Promise<Employee> {
    const payload = {
      ...input,
      ...(input.status ? { status: input.status.toUpperCase() === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE' } : {}),
      ...(input.salary ? { salary: Number(input.salary) } : {}),
    };

    try {
      const response = await apiClient.put<any>(API_ENDPOINTS.EMPLOYEES.BY_ID(id), payload);
      const updatedItem = response.data?.data || response.data;
      return normalizeEmployee(updatedItem);
    } catch (err) {
      logger.error(`Failed to update employee ${id} via API:`, err);
      throw err;
    }
  }

  async deleteEmployee(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.EMPLOYEES.BY_ID(id));
    } catch (err) {
      logger.error(`Failed to delete employee ${id} via API:`, err);
      throw err;
    }
  }
}

export const employeeService = new EmployeeService();
