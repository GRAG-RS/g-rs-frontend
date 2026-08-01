import { apiClient } from '../api';
import { API_ENDPOINTS } from '../constants/api';
import type { Product, CreateProductInput, UpdateProductInput } from '../types';
import { logger } from '../utils/logger';

let mockProducts: Product[] = [
  { id: '201', name: 'Enterprise Cloud Suite', price: 299.99, quantity: 45, status: 'In Stock' },
  { id: '202', name: 'Security Gateway License', price: 499.00, quantity: 12, status: 'In Stock' },
  { id: '203', name: 'Data Pipeline Accelerator', price: 150.00, quantity: 0, status: 'Out of Stock' },
  { id: '204', name: 'Kubernetes Cluster Manager', price: 899.50, quantity: 8, status: 'In Stock' },
];

export class ProductService {
  async getProducts(): Promise<Product[]> {
    try {
      const response = await apiClient.get<Product[]>(API_ENDPOINTS.PRODUCTS.BASE);
      return response.data;
    } catch (err) {
      logger.warn('Product Service API unavailable, serving product records via fallback mock.', err);
      return [...mockProducts];
    }
  }

  async getProductById(id: string): Promise<Product> {
    try {
      const response = await apiClient.get<Product>(API_ENDPOINTS.PRODUCTS.BY_ID(id));
      return response.data;
    } catch (err) {
      const found = mockProducts.find((p) => p.id === id);
      if (found) return found;
      throw err;
    }
  }

  async createProduct(input: CreateProductInput): Promise<Product> {
    try {
      const response = await apiClient.post<Product>(API_ENDPOINTS.PRODUCTS.BASE, input);
      return response.data;
    } catch (err) {
      logger.warn('Product Service API unavailable, adding product to mock storage.', err);
      const newProd: Product = {
        ...input,
        id: String(Date.now()),
      };
      mockProducts.push(newProd);
      return newProd;
    }
  }

  async updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
    try {
      const response = await apiClient.put<Product>(API_ENDPOINTS.PRODUCTS.BY_ID(id), input);
      return response.data;
    } catch (err) {
      logger.warn('Product Service API unavailable, updating product in mock storage.', err);
      const index = mockProducts.findIndex((p) => p.id === id);
      if (index !== -1) {
        mockProducts[index] = { ...mockProducts[index], ...input };
        return mockProducts[index];
      }
      throw err;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.PRODUCTS.BY_ID(id));
    } catch (err) {
      logger.warn('Product Service API unavailable, removing product from mock storage.', err);
      mockProducts = mockProducts.filter((p) => p.id !== id);
    }
  }
}

export const productService = new ProductService();
