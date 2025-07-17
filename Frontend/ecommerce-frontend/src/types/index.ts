// Product Types
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  stockQuantity: number;
  categoryId: number;
  brandId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  brand?: Brand;
  images?: ProductImage[];
  specifications?: ProductSpecification[];
  variants?: ProductVariant[];
  reviews?: ProductReview[];
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  stockQuantity: number;
  categoryId: number;
  brandId: number;
  isActive: boolean;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  discountPercentage?: number;
  stockQuantity?: number;
  categoryId?: number;
  brandId?: number;
  isActive?: boolean;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  description: string;
  parentCategoryId?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  parentCategory?: Category;
  subCategories?: Category[];
  products?: Product[];
}

export interface CreateCategoryDto {
  name: string;
  description: string;
  parentCategoryId?: number;
  isActive: boolean;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  parentCategoryId?: number;
  isActive?: boolean;
}

// Brand Types
export interface Brand {
  id: number;
  name: string;
  description: string;
  logoUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  products?: Product[];
}

export interface CreateBrandDto {
  name: string;
  description: string;
  logoUrl?: string;
  isActive: boolean;
}

export interface UpdateBrandDto {
  name?: string;
  description?: string;
  logoUrl?: string;
  isActive?: boolean;
}

// User Types
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  addresses?: Address[];
  orders?: Order[];
  reviews?: ProductReview[];
  wishlist?: Wishlist[];
}

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
}

// Authentication Types
export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResultDto {
  token: string;
  user: User;
  expiresAt: string;
}

// Order Types
export interface Order {
  id: number;
  userId: number;
  orderNumber: string;
  orderDate: string;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingAddressId: number;
  billingAddressId: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  items?: OrderItem[];
  shippingAddress?: Address;
  billingAddress?: Address;
}

export interface CreateOrderDto {
  userId: number;
  items: CreateOrderItemDto[];
  shippingAddressId: number;
  billingAddressId: number;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
  paymentStatus?: PaymentStatus;
}

// Order Item Types
export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product?: Product;
}

export interface CreateOrderItemDto {
  productId: number;
  quantity: number;
  unitPrice: number;
}

// Shopping Cart Types
export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product?: Product;
}

export interface AddToCartDto {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

// Address Types
export interface Address {
  id: number;
  userId: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  isShippingAddress: boolean;
  isBillingAddress: boolean;
  createdAt: string;
  updatedAt: string;
}

// Product Related Types
export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  isPrimary: boolean;
  altText?: string;
  createdAt: string;
}

export interface ProductSpecification {
  id: number;
  productId: number;
  specificationName: string;
  specificationValue: string;
  createdAt: string;
}

export interface ProductVariant {
  id: number;
  productId: number;
  variantName: string;
  variantValue: string;
  priceAdjustment: number;
  stockQuantity: number;
  createdAt: string;
}

export interface ProductReview {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Wishlist {
  id: number;
  userId: number;
  productId: number;
  createdAt: string;
  product?: Product;
}

// Enums
export enum OrderStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled',
  Returned = 'Returned'
}

export enum PaymentMethod {
  CreditCard = 'CreditCard',
  DebitCard = 'DebitCard',
  BankTransfer = 'BankTransfer',
  CashOnDelivery = 'CashOnDelivery',
  DigitalWallet = 'DigitalWallet'
}

export enum PaymentStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Completed = 'Completed',
  Failed = 'Failed',
  Refunded = 'Refunded'
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Filter and Search Types
export interface ProductFilters {
  categoryId?: number;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// UI State Types
export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  isLoading: boolean;
  error: string | null;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ProductState {
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