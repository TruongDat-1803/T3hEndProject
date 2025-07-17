import apiClient from './api';
import { CartItem, AddToCartDto, UpdateCartItemDto } from '../types';

const cartService = {
  async getCart(): Promise<CartItem[]> {
    const response = await apiClient.get('/shoppingcart');
    return response.data;
  },
  async addToCart(data: AddToCartDto): Promise<CartItem[]> {
    const response = await apiClient.post('/shoppingcart/add', data);
    return response.data;
  },
  async updateCartItem(id: number, data: UpdateCartItemDto): Promise<CartItem[]> {
    const response = await apiClient.put(`/shoppingcart/update/${id}`, data);
    return response.data;
  },
  async removeCartItem(id: number): Promise<CartItem[]> {
    const response = await apiClient.delete(`/shoppingcart/remove/${id}`);
    return response.data;
  },
  async clearCart(): Promise<void> {
    await apiClient.delete('/shoppingcart/clear');
  },
};

export default cartService; 