import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, AddToCartDto } from '../../types';

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  isLoading: false,
  error: null,
};

// Async thunks
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (cartData: AddToCartDto, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shoppingcart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(cartData),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to add to cart');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shoppingcart', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to fetch cart');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.productId === action.payload.productId);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce((total, item) => {
        const price = item.product?.price || 0;
        return total + (price * item.quantity);
      }, 0);
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce((total, item) => {
        const price = item.product?.price || 0;
        return total + (price * item.quantity);
      }, 0);
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
        state.totalAmount = state.items.reduce((total, item) => {
          const price = item.product?.price || 0;
          return total + (price * item.quantity);
        }, 0);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update cart with new data
        state.items = action.payload.items || state.items;
        state.totalItems = action.payload.totalItems || state.totalItems;
        state.totalAmount = action.payload.totalAmount || state.totalAmount;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.totalItems = action.payload.totalItems || 0;
        state.totalAmount = action.payload.totalAmount || 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addItem, removeItem, updateQuantity, clearCart, clearError } = cartSlice.actions;
export default cartSlice.reducer; 