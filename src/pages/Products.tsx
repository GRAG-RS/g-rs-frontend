import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, Package, Layers } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productService } from '../services/productService';
import type { Product } from '../types';
import { productSchema, type ProductFormData } from '../utils/validators';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { Table, Thead, Tbody, Tr, Th, Td } from '../components/common/Table';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      status: 'In Stock',
    },
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredProducts = products.filter(prod => 
    prod.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    setEditingId(null);
    reset({
      name: '',
      price: 0,
      quantity: 0,
      status: 'In Stock',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setValue('name', product.name);
    setValue('price', product.price);
    setValue('quantity', product.quantity);
    setValue('status', product.status);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        setProducts(products.filter(prod => prod.id !== id));
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const onSave = async (data: ProductFormData) => {
    try {
      setIsSaving(true);
      if (editingId) {
        const updated = await productService.updateProduct(editingId, data);
        setProducts(products.map(prod => prod.id === updated.id ? updated : prod));
      } else {
        const created = await productService.createProduct(data);
        setProducts([...products, created]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save product:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="sm:flex sm:items-center sm:justify-between bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Product Catalog
            </h2>
            <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-purple-700 border border-purple-200/60">
              Product Service (/api/products)
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 font-medium">Manage inventory items connected via the Application Load Balancer.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={handleAdd} size="md" className="shadow-md shadow-blue-500/20">
            <Plus className="-ml-1 mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Toolbar / Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md text-slate-400 focus-within:text-blue-600">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-xl border border-slate-200/90 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 shadow-xs transition-all"
            placeholder="Search products by name..."
            value={search}
            onChange={handleSearch}
          />
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Showing <span className="text-slate-900 font-bold">{filteredProducts.length}</span> items
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="h-64 flex items-center justify-center bg-white rounded-2xl border border-slate-200/80"><LoadingSpinner /></div>
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Product ID</Th>
              <Th>Product Name</Th>
              <Th>Price</Th>
              <Th>Stock Quantity</Th>
              <Th>Availability</Th>
              <Th className="text-right">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Tr key={product.id}>
                  <Td className="font-mono text-xs text-slate-400 font-semibold">
                    #{product.id}
                  </Td>
                  <Td>
                    <div className="flex items-center space-x-3">
                      <div className="h-9 w-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs shadow-xs">
                        <Package className="h-4 w-4" />
                      </div>
                      <span className="font-bold text-slate-900">{product.name}</span>
                    </div>
                  </Td>
                  <Td>
                    <span className="font-bold text-slate-900">${Number(product.price).toFixed(2)}</span>
                  </Td>
                  <Td>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      <Layers className="h-3 w-3 mr-1 text-slate-400" />
                      {product.quantity} units
                    </span>
                  </Td>
                  <Td>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      product.status === 'In Stock' 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200/60' 
                        : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${product.status === 'In Stock' ? 'bg-blue-500' : 'bg-rose-500'}`}></span>
                      {product.status}
                    </span>
                  </Td>
                  <Td className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Edit Product"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Delete Product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td className="text-center py-12 text-slate-400 font-medium" colSpan={6}>
                  No products matched your criteria.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      )}

      {/* Modal Dialog */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Product Item' : 'Create New Product'}
      >
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <Input
            label="Product Name"
            {...register('name')}
            error={errors.name?.message}
            placeholder="e.g. Enterprise Cloud Suite"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price ($)"
              type="number"
              step="0.01"
              {...register('price', { valueAsNumber: true })}
              error={errors.price?.message}
              placeholder="99.99"
            />
            <Input
              label="Stock Quantity"
              type="number"
              {...register('quantity', { valueAsNumber: true })}
              error={errors.quantity?.message}
              placeholder="50"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Availability Status</label>
            <select
              {...register('status')}
              className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 font-medium"
            >
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-xs text-rose-500 font-semibold">{errors.status.message}</p>
            )}
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              Save to Product Service
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
