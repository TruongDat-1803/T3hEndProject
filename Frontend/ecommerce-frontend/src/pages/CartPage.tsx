import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  TextField,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  Paper,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Badge,
  Tooltip,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  LocalShipping as ShippingIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { RootState, AppDispatch } from '../store';
import { CartItem, Product } from '../types';
import CartItemCard from '../components/common/CartItemCard';
import OrderSummary from '../components/common/OrderSummary';
import EmptyCart from '../components/common/EmptyCart';
import CartHeader from '../components/common/CartHeader';

// Mock cart data for testing
const mockCartItems: CartItem[] = [
  {
    id: 1,
    userId: 1,
    productId: 1,
    quantity: 2,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    product: {
      productId: 1,
      productName: "iPhone 15 Pro Max 256GB",
      description: "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ, camera 48MP, màn hình 6.7 inch Super Retina XDR OLED",
      price: 29990000,
      originalPrice: 32990000,
      discountPercentage: 9,
      stockQuantity: 15,
      categoryId: 1,
      brandId: 1,
      isActive: true,
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      category: { categoryId: 1, categoryName: "Điện thoại", description: "Smartphones", isActive: true, createdDate: "2024-01-01", updatedAt: "2024-01-01" },
      brand: { brandId: 1, brandName: "Apple", description: "Apple Inc.", isActive: true, createdDate: "2024-01-01", updatedAt: "2024-01-01" },
      images: [
        { id: 1, productId: 1, imageUrl: "/images/iphone-15-pro-max.webp", isPrimary: true, createdAt: "2024-01-15" }
      ],
      specifications: [],
      reviews: []
    }
  },
  {
    id: 2,
    userId: 1,
    productId: 3,
    quantity: 1,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    product: {
      productId: 3,
      productName: "MacBook Pro 14 inch M3 Pro",
      description: "MacBook Pro với chip M3 Pro, màn hình 14 inch Liquid Retina XDR, 18GB RAM, 512GB SSD",
      price: 45990000,
      originalPrice: 49990000,
      discountPercentage: 8,
      stockQuantity: 5,
      categoryId: 2,
      brandId: 1,
      isActive: true,
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      category: { categoryId: 2, categoryName: "Laptop", description: "Laptops", isActive: true, createdDate: "2024-01-01", updatedAt: "2024-01-01" },
      brand: { brandId: 1, brandName: "Apple", description: "Apple Inc.", isActive: true, createdDate: "2024-01-01", updatedAt: "2024-01-01" },
      images: [
        { id: 3, productId: 3, imageUrl: "/images/macbook-pro-14.webp", isPrimary: true, createdAt: "2024-01-15" }
      ],
      specifications: [],
      reviews: []
    }
  }
];

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);
  const [wishlistItems, setWishlistItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, [isAuthenticated, navigate]);

  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API call
      // const data = await cartService.getCart();
      // setCartItems(data);
      setCartItems(mockCartItems);
    } catch (err) {
      setError('Không thể tải giỏ hàng.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (item: CartItem, quantity: number) => {
    if (quantity < 1 || quantity > (item.product?.stockQuantity || 1)) return;
    
    setUpdating(item.id);
    try {
      // TODO: Replace with actual API call
      // await cartService.updateCartItem(item.id, { quantity });
      
      setCartItems(prev => 
        prev.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity } 
            : cartItem
        )
      );
      
      setSnackbarMessage('Đã cập nhật số lượng sản phẩm');
      setSnackbarOpen(true);
    } catch (err) {
      setError('Không thể cập nhật số lượng.');
    } finally {
      setUpdating(null);
    }
  };

  const handleRemove = async (item: CartItem) => {
    setItemToRemove(item);
    setRemoveDialogOpen(true);
  };

  const confirmRemove = async () => {
    if (!itemToRemove) return;
    
    setUpdating(itemToRemove.id);
    try {
      // TODO: Replace with actual API call
      // await cartService.removeCartItem(itemToRemove.id);
      
      setCartItems(prev => prev.filter(item => item.id !== itemToRemove.id));
      setSnackbarMessage('Đã xóa sản phẩm khỏi giỏ hàng');
      setSnackbarOpen(true);
    } catch (err) {
      setError('Không thể xóa sản phẩm khỏi giỏ hàng.');
    } finally {
      setUpdating(null);
      setRemoveDialogOpen(false);
      setItemToRemove(null);
    }
  };

  const handleMoveToWishlist = (item: CartItem) => {
    setWishlistItems(prev => new Set(prev).add(item.productId));
    setSnackbarMessage('Đã thêm vào danh sách yêu thích');
    setSnackbarOpen(true);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <CartHeader
        totalItems={totalItems}
        onBack={() => navigate(-1)}
        showClearButton={cartItems.length > 0}
        onClearCart={() => {
          // TODO: Implement clear cart functionality
          setSnackbarMessage('Tính năng xóa tất cả đang được phát triển');
          setSnackbarOpen(true);
        }}
      />

      {cartItems.length === 0 ? (
        <EmptyCart onContinueShopping={handleContinueShopping} />
      ) : (
        <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Cart Items */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              Sản phẩm ({totalItems})
            </Typography>
            
            {cartItems.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemove}
                onMoveToWishlist={handleMoveToWishlist}
                updating={updating}
                wishlistItems={wishlistItems}
              />
            ))}
          </Box>

          {/* Order Summary */}
          <Box sx={{ width: { xs: '100%', md: 400 } }}>
            <OrderSummary
              cartItems={cartItems}
              onCheckout={handleCheckout}
              onContinueShopping={handleContinueShopping}
              isLoading={loading}
            />
          </Box>
        </Box>
      )}

      {/* Remove Item Dialog */}
      <Dialog
        open={removeDialogOpen}
        onClose={() => setRemoveDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Xác nhận xóa sản phẩm
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa "{itemToRemove?.product?.productName}" khỏi giỏ hàng?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoveDialogOpen(false)}>
            Hủy
          </Button>
          <Button 
            color="error" 
            variant="contained"
            onClick={confirmRemove}
            disabled={updating !== null}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => setSnackbarOpen(false)}
          >
            <CloseIcon />
          </IconButton>
        }
      />
    </Container>
  );
};

export default CartPage; 