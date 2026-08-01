import { apiClient } from '../api';
import { API_ENDPOINTS } from '../constants/api';
import type { Employee, CreateEmployeeInput, UpdateEmployeeInput } from '../types';
import { logger } from '../utils/logger';

let mockEmployees: Employee[] = [
  { id: '101', name: 'Sarah Jenkins', email: 'sarah.j@company.com', department: 'Engineering', status: 'Active' },
  { id: '102', name: 'Michael Chen', email: 'michael.c@company.com', department: 'Product Management', status: 'Active' },
  { id: '103', name: 'Elena Rostova', email: 'elena.r@company.com', department: 'DevOps', status: 'Active' },
  { id: '104', name: 'David Kim', email: 'david.k@company.com', department: 'Quality Assurance', status: 'Inactive' },
];

export class EmployeeService {
  async getEmployees(): Promise<Employee[]> {
    try {
      const response = await apiClient.get<Employee[]>(API_ENDPOINTS.EMPLOYEES.BASE);
      return response.data;
    } catch (err) {
      logger.warn('User Service API unavailable, serving employee records via fallback mock.', err);
      return [...mockEmployees];
    }
  }

  async getEmployeeById(id: string): Promise<Employee> {
    try {
      const response = await apiClient.get<Employee>(API_ENDPOINTS.EMPLOYEES.BY_ID(id));
      return response.data;
    } catch (err) {
      const found = mockEmployees.find((e) => e.id === id);
      if (found) return found;
      throw err;
    }
  }

  async createEmployee(input: CreateEmployeeInput): Promise<Employee> {
    try {
      const response = await apiClient.post<Employee>(API_ENDPOINTS.EMPLOYEES.BASE, input);
      return response.data;
    } catch (err) {
      logger.warn('User Service API unavailable, adding employee to mock storage.', err);
      const newEmp: Employee = {
        ...input,
        id: String(Date.now()),
      };
      mockEmployees.push(newEmp);
      return newEmp;
    }
  }

  async updateEmployee(id: string, input: UpdateEmployeeInput): Promise<Employee> {
    try {
      const response = await apiClient.put<Employee>(API_ENDPOINTS.EMPLOYEES.BY_ID(id), input);
      return response.data;
    } catch (err) {
      logger.warn('User Service API unavailable, updating employee in mock storage.', err);
      const index = mockEmployees.findIndex((e) => e.id === id);
      if (index !== -1) {
        mockEmployees[index] = { ...mockEmployees[index], ...input };
        return mockEmployees[index];
      }
      throw err;
    }
  }

  async deleteEmployee(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.EMPLOYEES.BY_ID(id));
    } catch (err) {
      logger.warn('User Service API unavailable, removing employee from mock storage.', err);
      mockEmployees = mockEmployees.filter((e) => e.id !== id);
    }
  }
}

export const employeeService = new EmployeeService();
