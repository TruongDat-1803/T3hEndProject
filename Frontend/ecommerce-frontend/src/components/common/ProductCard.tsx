import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button,
  Rating,
  IconButton,
  Badge,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  ShoppingCart,
  Visibility,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { addToCart } from '../../store/slices/cartSlice';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onWishlistToggle?: (productId: number) => void;
  isWishlisted?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onWishlistToggle,
  isWishlisted = false,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAuthenticated) {
      dispatch(addToCart({ productId: product.productId, quantity: 1 }));
    } else {
      navigate('/login');
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onWishlistToggle?.(product.productId);
  };

  const handleViewDetails = () => {
    navigate(`/products/${product.productId}`);
  };

  const averageRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : 0;

  const reviewCount = product.reviews?.length || 0;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        },
        position: 'relative',
        overflow: 'visible',
      }}
      onClick={handleViewDetails}
    >
      {/* Product Image */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={product.images?.[0]?.imageUrl || '/images/placeholder.jpg'}
          alt={product.productName}
          sx={{ objectFit: 'cover' }}
        />
        
        {/* Discount Badge */}
        {product.discountPercentage > 0 && (
          <Chip
            label={`-${product.discountPercentage}%`}
            color="error"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              fontWeight: 'bold',
            }}
          />
        )}

        {/* Brand Logo */}
        {product.brand?.logoUrl && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#fff',
              border: '1px solid #eee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <img
              src={product.brand.logoUrl}
              alt={product.brand.brandName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
        )}

        {/* Wishlist Button */}
        <IconButton
          onClick={handleWishlistToggle}
          sx={{
            position: 'absolute',
            top: 8,
            right: product.brand?.logoUrl ? 48 : 8,
            bgcolor: 'rgba(255,255,255,0.9)',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,1)',
            },
          }}
        >
          {isWishlisted ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>

        {/* Stock Status */}
        {product.stockQuantity <= 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Chip
              label="Hết hàng"
              color="error"
              variant="filled"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
        )}
      </Box>

      {/* Product Content */}
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Category & Brand */}
        <Typography variant="caption" color="text.secondary" gutterBottom>
          {product.category?.categoryName} {product.brand ? `• ${product.brand.brandName}` : ''}
        </Typography>

        {/* Product Name */}
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: 600,
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minHeight: '2.6em',
          }}
        >
          {product.productName}
        </Typography>

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Rating value={averageRating} precision={0.5} size="small" readOnly />
          <Typography variant="caption" color="text.secondary">
            ({reviewCount})
          </Typography>
        </Box>

        {/* Price */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="h6" color="primary" fontWeight="bold">
            {product.price.toLocaleString('vi-VN')}đ
          </Typography>
          {product.originalPrice > product.price && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: 'line-through' }}
            >
              {product.originalPrice.toLocaleString('vi-VN')}đ
            </Typography>
          )}
        </Box>

        {/* Stock Status */}
        <Typography
          variant="body2"
          color={product.stockQuantity > 0 ? 'success.main' : 'error.main'}
          sx={{ mb: 2 }}
        >
          {product.stockQuantity > 0 ? 'Còn hàng' : 'Hết hàng'}
        </Typography>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Visibility />}
            onClick={handleViewDetails}
            sx={{ flex: 1 }}
          >
            Chi tiết
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<ShoppingCart />}
            onClick={handleAddToCart}
            disabled={product.stockQuantity <= 0}
            sx={{ flex: 1 }}
          >
            Thêm vào giỏ
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard; 