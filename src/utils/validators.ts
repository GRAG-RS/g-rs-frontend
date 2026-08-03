import { z } from 'zod';
import { VALIDATION_RULES } from '../constants/validation';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(VALIDATION_RULES.EMAIL_REGEX, 'Invalid email address format'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(VALIDATION_RULES.MIN_PASSWORD_LENGTH, `Password must be at least ${VALIDATION_RULES.MIN_PASSWORD_LENGTH} characters`),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const employeeSchema = z.object({
  employee_code: z.string().min(3, 'Employee code must be at least 3 characters (e.g. EMP-101)'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().min(1, 'Email is required').regex(VALIDATION_RULES.EMAIL_REGEX, 'Invalid email address format'),
  phone: z.string().min(7, 'Phone number must be at least 7 digits'),
  department: z.string().min(1, 'Department is required'),
  designation: z.string().min(1, 'Designation / job title is required'),
  salary: z.number().positive('Salary must be greater than 0'),
  date_of_joining: z.string().min(1, 'Date of joining is required'),
  status: z.enum(['Active', 'Inactive', 'ACTIVE', 'INACTIVE']),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  price: z.number().positive('Price must be greater than 0'),
  quantity: z.number().min(0, 'Quantity cannot be negative'),
  status: z.enum(['In Stock', 'Out of Stock']),
});

export type ProductFormData = z.infer<typeof productSchema>;
