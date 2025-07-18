import React, { useState } from 'react';
import {
  Box,
  Card,
  CardMedia,
  Typography,
  IconButton,
  TextField,
  Chip,
  Tooltip,
  Collapse,
  Alert,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { CartItem } from '../../types';

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (item: CartItem, quantity: number) => void;
  onRemove: (item: CartItem) => void;
  onMoveToWishlist: (item: CartItem) => void;
  updating: number | null;
  wishlistItems: Set<number>;
}

const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  onMoveToWishlist,
  updating,
  wishlistItems,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [quantityError, setQuantityError] = useState<string | null>(null);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      setQuantityError('Số lượng phải lớn hơn 0');
      return;
    }
    
    if (newQuantity > (item.product?.stockQuantity || 1)) {
      setQuantityError(`Chỉ còn ${item.product?.stockQuantity} sản phẩm trong kho`);
      return;
    }
    
    setQuantityError(null);
    onUpdateQuantity(item, newQuantity);
  };

  const handleQuantityInput = (value: string) => {
    const numValue = parseInt(value);
    if (isNaN(numValue)) {
      setQuantityError('Vui lòng nhập số hợp lệ');
      return;
    }
    
    if (numValue < 1) {
      setQuantityError('Số lượng phải lớn hơn 0');
      return;
    }
    
    if (numValue > (item.product?.stockQuantity || 1)) {
      setQuantityError(`Chỉ còn ${item.product?.stockQuantity} sản phẩm trong kho`);
      return;
    }
    
    setQuantityError(null);
    onUpdateQuantity(item, numValue);
  };

  const isInWishlist = wishlistItems.has(item.productId);
  const isUpdating = updating === item.id;
  const stockQuantity = item.product?.stockQuantity || 0;
  const isOutOfStock = stockQuantity === 0;
  const isLowStock = stockQuantity <= 3 && stockQuantity > 0;

  return (
    <Card sx={{ mb: 2, p: 2, position: 'relative' }}>
      {/* Stock Warning */}
      {isOutOfStock && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Sản phẩm này hiện đã hết hàng
        </Alert>
      )}
      
      {isLowStock && !isOutOfStock && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Chỉ còn {stockQuantity} sản phẩm trong kho
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Product Image */}
        <CardMedia
          component="img"
          image={item.product?.images?.[0]?.imageUrl || '/images/placeholder.jpg'}
          alt={item.product?.productName}
          sx={{ 
            width: 120, 
            height: 120, 
            objectFit: 'cover',
            borderRadius: 1,
            bgcolor: '#fafafa',
            opacity: isOutOfStock ? 0.6 : 1,
          }}
        />

        {/* Product Info */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                {item.product?.productName}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {item.product?.brand?.brandName} • {item.product?.category?.categoryName}
              </Typography>
              
              {/* Product Description */}
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mb: 2,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {item.product?.description}
              </Typography>
              
              {/* Price */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {item.product?.price?.toLocaleString('vi-VN')}đ
                </Typography>
                {item.product?.originalPrice && item.product.originalPrice > item.product.price && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textDecoration: 'line-through' }}
                  >
                    {item.product.originalPrice.toLocaleString('vi-VN')}đ
                  </Typography>
                )}
                {item.product?.discountPercentage && item.product.discountPercentage > 0 && (
                  <Chip
                    label={`-${item.product.discountPercentage}%`}
                    color="error"
                    size="small"
                  />
                )}
              </Box>

              {/* Stock Status */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography
                  variant="body2"
                  color={stockQuantity > 0 ? 'success.main' : 'error.main'}
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                  <InfoIcon sx={{ fontSize: 16 }} />
                  {stockQuantity > 0 ? `Còn ${stockQuantity} sản phẩm` : 'Hết hàng'}
                </Typography>
              </Box>
            </Box>

            {/* Actions */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Tooltip title={isInWishlist ? "Đã có trong yêu thích" : "Thêm vào yêu thích"}>
                <IconButton
                  size="small"
                  onClick={() => onMoveToWishlist(item)}
                  color={isInWishlist ? 'error' : 'default'}
                  disabled={isUpdating}
                >
                  {isInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Xem chi tiết">
                <IconButton
                  size="small"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Xóa khỏi giỏ hàng">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onRemove(item)}
                  disabled={isUpdating}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Quantity Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
            <Typography variant="body2">Số lượng:</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: 1 }}>
              <IconButton
                size="small"
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={item.quantity <= 1 || isUpdating || isOutOfStock}
              >
                <RemoveIcon />
              </IconButton>
              <TextField
                type="number"
                size="small"
                value={item.quantity}
                onChange={(e) => handleQuantityInput(e.target.value)}
                error={!!quantityError}
                helperText={quantityError}
                sx={{ 
                  width: 80, 
                  '& .MuiInputBase-input': { 
                    textAlign: 'center',
                    padding: '8px 4px'
                  },
                  '& .MuiFormHelperText-root': {
                    margin: 0,
                    fontSize: '0.75rem'
                  }
                }}
                disabled={isUpdating || isOutOfStock}
                inputProps={{
                  min: 1,
                  max: stockQuantity,
                }}
              />
              <IconButton
                size="small"
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={
                  item.quantity >= stockQuantity || 
                  isUpdating || 
                  isOutOfStock
                }
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Total Price */}
        <Box sx={{ textAlign: 'right', minWidth: 120 }}>
          <Typography variant="h6" color="primary" fontWeight="bold">
            {((item.product?.price || 0) * item.quantity).toLocaleString('vi-VN')}đ
          </Typography>
          {item.quantity > 1 && (
            <Typography variant="caption" color="text.secondary">
              {item.product?.price?.toLocaleString('vi-VN')}đ × {item.quantity}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Expanded Details */}
      <Collapse in={expanded}>
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
          <Typography variant="subtitle2" gutterBottom>
            Thông tin chi tiết:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {item.product?.description}
          </Typography>
          
          {/* Specifications */}
          {item.product?.specifications && item.product.specifications.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Thông số kỹ thuật:
              </Typography>
              {item.product.specifications.map((spec, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    {spec.specificationName}:
                  </Typography>
                  <Typography variant="body2">
                    {spec.specificationValue}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Collapse>
    </Card>
  );
};

export default CartItemCard; 