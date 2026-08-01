export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  status: 'In Stock' | 'Out of Stock';
  category?: string;
  createdAt?: string;
}

export type CreateProductInput = Omit<Product, 'id'>;
export type UpdateProductInput = Partial<CreateProductInput>;
