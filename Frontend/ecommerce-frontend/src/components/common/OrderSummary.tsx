import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  Chip,
} from '@mui/material';
import {
  LocalShipping as ShippingIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { CartItem } from '../../types';

interface OrderSummaryProps {
  cartItems: CartItem[];
  onCheckout: () => void;
  onContinueShopping: () => void;
  isLoading?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  cartItems,
  onCheckout,
  onContinueShopping,
  isLoading = false,
}) => {
  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + (price * item.quantity);
  }, 0);

  const totalDiscount = cartItems.reduce((sum, item) => {
    const originalPrice = item.product?.originalPrice || 0;
    const currentPrice = item.product?.price || 0;
    const discount = originalPrice - currentPrice;
    return sum + (discount * item.quantity);
  }, 0);

  const shippingFee = subtotal > 500000 ? 0 : 30000; // Free shipping for orders > 500k
  const total = subtotal + shippingFee;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate savings
  const totalSavings = totalDiscount + (shippingFee === 0 ? 30000 : 0);

  return (
    <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
      <Typography variant="h6" gutterBottom>
        Tóm tắt đơn hàng
      </Typography>
      
      {/* Order Details */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">Tạm tính ({totalItems} sản phẩm):</Typography>
          <Typography variant="body2">{subtotal.toLocaleString('vi-VN')}đ</Typography>
        </Box>
        
        {totalDiscount > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="success.main">Giảm giá sản phẩm:</Typography>
            <Typography variant="body2" color="success.main">-{totalDiscount.toLocaleString('vi-VN')}đ</Typography>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">Phí vận chuyển:</Typography>
          <Typography variant="body2">
            {shippingFee === 0 ? (
              <Chip label="Miễn phí" color="success" size="small" />
            ) : (
              `${shippingFee.toLocaleString('vi-VN')}đ`
            )}
          </Typography>
        </Box>
        
        {totalSavings > 0 && (
          <Box sx={{ 
            p: 2, 
            bgcolor: 'success.light', 
            borderRadius: 1, 
            mb: 2,
            border: '1px solid',
            borderColor: 'success.main',
          }}>
            <Typography variant="body2" color="success.dark" fontWeight="bold">
              Bạn tiết kiệm được: {totalSavings.toLocaleString('vi-VN')}đ
            </Typography>
          </Box>
        )}
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight="bold">Tổng cộng:</Typography>
          <Typography variant="h6" color="primary" fontWeight="bold">
            {total.toLocaleString('vi-VN')}đ
          </Typography>
        </Box>
      </Box>

      {/* Shipping Info */}
      <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <ShippingIcon color="primary" />
          <Typography variant="body2" fontWeight="bold">
            Miễn phí vận chuyển
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">
          Cho đơn hàng từ 500.000đ
        </Typography>
      </Box>

      {/* Benefits */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Lợi ích khi mua hàng:
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="caption" color="text.secondary">
            ✓ Giao hàng miễn phí cho đơn hàng từ 500k
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ✓ Bảo hành chính hãng 12 tháng
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ✓ Đổi trả trong 30 ngày
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ✓ Hỗ trợ 24/7
          </Typography>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Button
        variant="contained"
        size="large"
        fullWidth
        onClick={onCheckout}
        disabled={cartItems.length === 0 || isLoading}
        sx={{ mb: 2 }}
      >
        {isLoading ? 'Đang xử lý...' : 'Tiến hành đặt hàng'}
      </Button>
      
      <Button
        variant="outlined"
        size="large"
        fullWidth
        onClick={onContinueShopping}
        startIcon={<ShoppingCartIcon />}
      >
        Tiếp tục mua sắm
      </Button>
    </Paper>
  );
};

export default OrderSummary; 