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

let mockEmployees: Employee[] = [
  { id: '101', employee_code: 'EMP-101', first_name: 'Sarah', last_name: 'Jenkins', name: 'Sarah Jenkins', email: 'sarah.j@company.com', phone: '+14155551001', department: 'Engineering', designation: 'Senior Software Engineer', salary: 120000, date_of_joining: '2024-01-15', status: 'Active' },
  { id: '102', employee_code: 'EMP-102', first_name: 'Michael', last_name: 'Chen', name: 'Michael Chen', email: 'michael.c@company.com', phone: '+14155551002', department: 'Product Management', designation: 'Product Manager', salary: 115000, date_of_joining: '2024-02-01', status: 'Active' },
  { id: '103', employee_code: 'EMP-103', first_name: 'Elena', last_name: 'Rostova', name: 'Elena Rostova', email: 'elena.r@company.com', phone: '+14155551003', department: 'DevOps', designation: 'DevOps Lead', salary: 130000, date_of_joining: '2023-11-10', status: 'Active' },
  { id: '104', employee_code: 'EMP-104', first_name: 'David', last_name: 'Kim', name: 'David Kim', email: 'david.k@company.com', phone: '+14155551004', department: 'Quality Assurance', designation: 'QA Specialist', salary: 90000, date_of_joining: '2024-03-15', status: 'Inactive' },
];

export class EmployeeService {
  async getEmployees(): Promise<Employee[]> {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.EMPLOYEES.BASE);
      const rawData = response.data?.data?.items || response.data?.data || response.data;
      if (Array.isArray(rawData)) {
        return rawData.map(normalizeEmployee);
      }
      return [...mockEmployees];
    } catch (err) {
      logger.warn('Employee Service API unavailable, serving fallback data.', err);
      return [...mockEmployees];
    }
  }

  async getEmployeeById(id: string): Promise<Employee> {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.EMPLOYEES.BY_ID(id));
      const item = response.data?.data || response.data;
      return normalizeEmployee(item);
    } catch (err) {
      const found = mockEmployees.find((e) => e.id === id);
      if (found) return found;
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
      logger.warn('User Service API unavailable, saving newly created employee to fallback mock state.', err);
      const newEmp: Employee = normalizeEmployee({
        ...payload,
        id: String(Date.now()),
      });
      mockEmployees.push(newEmp);
      return newEmp;
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
      logger.warn('User Service API unavailable, updating mock storage.', err);
      const index = mockEmployees.findIndex((e) => e.id === id);
      if (index !== -1) {
        mockEmployees[index] = normalizeEmployee({ ...mockEmployees[index], ...payload });
        return mockEmployees[index];
      }
      throw err;
    }
  }

  async deleteEmployee(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.EMPLOYEES.BY_ID(id));
      mockEmployees = mockEmployees.filter((e) => e.id !== id);
    } catch (err) {
      logger.warn('User Service API unavailable, deleting from mock storage.', err);
      mockEmployees = mockEmployees.filter((e) => e.id !== id);
    }
  }
}

export const employeeService = new EmployeeService();
