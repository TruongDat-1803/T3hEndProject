import React from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';

interface CartHeaderProps {
  totalItems: number;
  onBack: () => void;
  onClearCart?: () => void;
  showClearButton?: boolean;
}

const CartHeader: React.FC<CartHeaderProps> = ({
  totalItems,
  onBack,
  onClearCart,
  showClearButton = false,
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={onBack}
        sx={{ mb: 2 }}
        variant="text"
      >
        Quay lại
      </Button>

      {/* Header Content */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 2,
      }}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Giỏ hàng của bạn
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1" color="text.secondary">
              {totalItems} sản phẩm trong giỏ hàng
            </Typography>
            <Chip
              icon={<ShoppingCartIcon />}
              label={`${totalItems} sản phẩm`}
              color="primary"
              variant="outlined"
              size="small"
            />
          </Box>
        </Box>

        {/* Action Buttons */}
        {showClearButton && onClearCart && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={onClearCart}
            sx={{ minWidth: 'auto' }}
          >
            Xóa tất cả
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default CartHeader; 