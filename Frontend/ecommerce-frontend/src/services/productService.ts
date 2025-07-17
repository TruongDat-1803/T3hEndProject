import apiClient from './api';
import { Product, Category, Brand, ProductFilters } from '../types';

interface AdvancedProductFilters extends ProductFilters {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
}

const productService = {
    async getProducts(filters?: ProductFilters): Promise<Product[]> {
        const params = { ...filters };
    const response = await apiClient.get('/products', { params });
    return response.data;
  },
  async getProductById(id: number | string): Promise<Product> {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get('/categories');
    return response.data;
  },
  async getBrands(): Promise<Brand[]> {
    const response = await apiClient.get('/brands');
    return response.data;
  },
};

export default productService; 