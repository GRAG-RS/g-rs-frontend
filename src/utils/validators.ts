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
  name: z.string().min(1, 'Full name is required'),
  email: z.string().min(1, 'Email is required').regex(VALIDATION_RULES.EMAIL_REGEX, 'Invalid email address format'),
  department: z.string().min(1, 'Department is required'),
  status: z.enum(['Active', 'Inactive']),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  price: z.number().positive('Price must be greater than 0'),
  quantity: z.number().min(0, 'Quantity cannot be negative'),
  status: z.enum(['In Stock', 'Out of Stock']),
});

export type ProductFormData = z.infer<typeof productSchema>;
