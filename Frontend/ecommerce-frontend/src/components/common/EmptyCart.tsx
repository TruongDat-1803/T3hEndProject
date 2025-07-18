import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Add as AddIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';

interface EmptyCartProps {
  onContinueShopping: () => void;
  onViewWishlist?: () => void;
}

const EmptyCart: React.FC<EmptyCartProps> = ({
  onContinueShopping,
  onViewWishlist,
}) => {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 6, 
          maxWidth: 500, 
          mx: 'auto',
          bgcolor: 'grey.50',
          borderRadius: 3,
        }}
      >
        {/* Empty Cart Icon */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              bgcolor: 'primary.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <ShoppingCartIcon sx={{ fontSize: 60, color: 'primary.main' }} />
          </Box>
        </Box>

        {/* Title */}
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Giỏ hàng trống
        </Typography>

        {/* Description */}
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Bạn chưa có sản phẩm nào trong giỏ hàng.
          <br />
          Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!
        </Typography>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={onContinueShopping}
            startIcon={<AddIcon />}
            sx={{ 
              minWidth: 200,
              py: 1.5,
              px: 4,
              borderRadius: 2,
            }}
          >
            Tiếp tục mua sắm
          </Button>
          
          {onViewWishlist && (
            <Button
              variant="outlined"
              size="large"
              onClick={onViewWishlist}
              startIcon={<FavoriteIcon />}
              sx={{ 
                minWidth: 200,
                py: 1.5,
                px: 4,
                borderRadius: 2,
              }}
            >
              Xem danh sách yêu thích
            </Button>
          )}
        </Box>

        {/* Additional Info */}
        <Box sx={{ mt: 6, p: 3, bgcolor: 'white', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Tại sao nên mua sắm tại đây?
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, textAlign: 'left' }}>
            <Typography variant="body2" color="text.secondary">
              ✓ Giao hàng miễn phí cho đơn hàng từ 500k
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ✓ Bảo hành chính hãng 12 tháng
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ✓ Đổi trả trong 30 ngày
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ✓ Hỗ trợ 24/7
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ✓ Thanh toán an toàn
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default EmptyCart; 