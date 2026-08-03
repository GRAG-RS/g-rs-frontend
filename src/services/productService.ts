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

let localProducts: Product[] = [...FALLBACK_PRODUCTS];

export class ProductService {
  async getProducts(): Promise<Product[]> {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.PRODUCTS.BASE);
      const rawData = response.data?.data?.items || response.data?.data || response.data;
      if (Array.isArray(rawData)) {
        if (rawData.length > 0) {
          localProducts = rawData;
        }
        return localProducts;
      }
      return localProducts;
    } catch (err) {
      logger.warn('Failed to fetch products from API, returning local data:', err);
      return localProducts;
    }
  }

  async getProductById(id: string): Promise<Product> {
    try {
      const response = await apiClient.get<Product>(API_ENDPOINTS.PRODUCTS.BY_ID(id));
      return response.data;
    } catch (err) {
      logger.warn(`Failed to fetch product ${id} from API, checking local store:`, err);
      const found = localProducts.find((p) => p.id === id);
      if (found) return found;
      throw err;
    }
  }

  async createProduct(input: CreateProductInput): Promise<Product> {
    try {
      const response = await apiClient.post<any>(API_ENDPOINTS.PRODUCTS.BASE, input);
      const created = response.data?.data || response.data;
      localProducts.push(created);
      return created;
    } catch (err) {
      logger.warn('API error during product creation, adding to local store:', err);
      const newProd: Product = {
        ...input,
        id: `prod_${Date.now()}`,
      };
      localProducts.push(newProd);
      return newProd;
    }
  }

  async updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
    try {
      const response = await apiClient.put<any>(API_ENDPOINTS.PRODUCTS.BY_ID(id), input);
      const updated = response.data?.data || response.data;
      const index = localProducts.findIndex((p) => p.id === id);
      if (index !== -1) localProducts[index] = updated;
      return updated;
    } catch (err) {
      logger.warn(`API error during product ${id} update, updating local store:`, err);
      const index = localProducts.findIndex((p) => p.id === id);
      if (index !== -1) {
        localProducts[index] = { ...localProducts[index], ...input };
        return localProducts[index];
      }
      const updated = { id, name: 'Product', price: 0, quantity: 0, status: 'In Stock' as const, ...input };
      localProducts.push(updated);
      return updated;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.PRODUCTS.BY_ID(id));
      localProducts = localProducts.filter((p) => p.id !== id);
    } catch (err) {
      logger.warn(`API error during product ${id} deletion, removing from local store:`, err);
      localProducts = localProducts.filter((p) => p.id !== id);
    }
  }
}

export const productService = new ProductService();
