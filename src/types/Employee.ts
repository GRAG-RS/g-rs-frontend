export interface Employee {
  id: string;
  employee_code: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  salary: number;
  date_of_joining: string;
  status: 'Active' | 'Inactive' | 'ACTIVE' | 'INACTIVE';
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export type CreateEmployeeInput = Omit<Employee, 'id' | 'name' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by' | 'is_deleted'>;
export type UpdateEmployeeInput = Partial<CreateEmployeeInput>;

