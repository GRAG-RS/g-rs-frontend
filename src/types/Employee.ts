export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  status: 'Active' | 'Inactive';
  phone?: string;
  createdAt?: string;
}

export type CreateEmployeeInput = Omit<Employee, 'id'>;
export type UpdateEmployeeInput = Partial<CreateEmployeeInput>;
