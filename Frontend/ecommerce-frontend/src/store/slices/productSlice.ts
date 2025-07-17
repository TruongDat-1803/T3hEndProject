import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, Category, Brand, ProductFilters } from '../../types';

interface ProductState {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  filters: ProductFilters;
  isLoading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
  };
}

const initialState: ProductState = {
  products: [],
  categories: [],
  brands: [],
  filters: {},
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  },
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (filters: ProductFilters | undefined, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }

      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to fetch products');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'product/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to fetch categories');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const fetchBrands = createAsyncThunk(
  'product/fetchBrands',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/brands');
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to fetch brands');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'product/fetchFeaturedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/products/featured');
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to fetch featured products');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<ProductFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data || action.payload;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Fetch brands
      .addCase(fetchBrands.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.brands = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Fetch featured products
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.products = action.payload;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters, setCurrentPage, clearError } = productSlice.actions;
export default productSlice.reducer; 