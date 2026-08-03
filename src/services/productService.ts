import { apiClient } from '../api';
import { API_ENDPOINTS } from '../constants/api';
import type { Product, CreateProductInput, UpdateProductInput } from '../types';
import { logger } from '../utils/logger';

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: '101',
    name: 'Enterprise Cloud Gateway',
    price: 4999.99,
    quantity: 45,
    status: 'In Stock',
    category: 'Software',
  },
  {
    id: '102',
    name: 'ALB Traffic Controller',
    price: 2999.00,
    quantity: 18,
    status: 'In Stock',
    category: 'Infrastructure',
  },
  {
    id: '103',
    name: 'RDS PostgreSQL Sync Node',
    price: 1499.50,
    quantity: 0,
    status: 'Out of Stock',
    category: 'Database',
  },
];

export class ProductService {
  async getProducts(): Promise<Product[]> {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.PRODUCTS.BASE);
      const rawData = response.data?.data?.items || response.data?.data || response.data;
      if (Array.isArray(rawData)) {
        return rawData;
      }
      return FALLBACK_PRODUCTS;
    } catch (err) {
      logger.error('Failed to fetch products from API, returning fallback data:', err);
      return FALLBACK_PRODUCTS;
    }
  }

  async getProductById(id: string): Promise<Product> {
    try {
      const response = await apiClient.get<Product>(API_ENDPOINTS.PRODUCTS.BY_ID(id));
      return response.data;
    } catch (err) {
      logger.error(`Failed to fetch product ${id} from API:`, err);
      throw err;
    }
  }

  async createProduct(input: CreateProductInput): Promise<Product> {
    try {
      const response = await apiClient.post<Product>(API_ENDPOINTS.PRODUCTS.BASE, input);
      return response.data;
    } catch (err) {
      logger.error('Failed to create product via API:', err);
      throw err;
    }
  }

  async updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
    try {
      const response = await apiClient.put<Product>(API_ENDPOINTS.PRODUCTS.BY_ID(id), input);
      return response.data;
    } catch (err) {
      logger.error(`Failed to update product ${id} via API:`, err);
      throw err;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.PRODUCTS.BY_ID(id));
    } catch (err) {
      logger.error(`Failed to delete product ${id} via API:`, err);
      throw err;
    }
  }
}

export const productService = new ProductService();
