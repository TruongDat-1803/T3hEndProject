import { useEffect, useState } from 'react';
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
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import cartService from '../services/cartService';
import { CartItem } from '../types';

const CartPage = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch {
      setError('Không thể tải giỏ hàng.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (item: CartItem, quantity: number) => {
    if (quantity < 1) return;
    setUpdating(item.id);
    try {
      await cartService.updateCartItem(item.id, { quantity });
      fetchCart();
    } catch {
      setError('Không thể cập nhật số lượng.');
    } finally {
      setUpdating(null);
    }
  };

  const handleRemove = async (id: number) => {
    setUpdating(id);
    try {
      await cartService.removeCartItem(id);
      fetchCart();
    } catch {
      setError('Không thể xóa sản phẩm khỏi giỏ hàng.');
    } finally {
      setUpdating(null);
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" gutterBottom>
        Giỏ hàng của bạn
      </Typography>
      <Divider sx={{ mb: 3 }} />
      {cart.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          Giỏ hàng của bạn đang trống.
        </Typography>
      ) : (
        <>
          {cart.map((item) => (
            <Card key={item.id} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <CardMedia
                component="img"
                image={item.product?.images?.[0]?.imageUrl || '/images/placeholder.jpg'}
                alt={item.product?.productName}
                sx={{ width: 120, height: 120, objectFit: 'contain', bgcolor: '#fafafa' }}
              />
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6">{item.product?.productName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Đơn giá: {item.product?.price?.toLocaleString('vi-VN')}đ
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <TextField
                    type="number"
                    size="small"
                    value={item.quantity}
                    onChange={e => handleUpdateQuantity(item, Number(e.target.value))}
                    inputProps={{ min: 1, style: { width: 60 } }}
                    disabled={updating === item.id}
                  />
                  <IconButton color="error" onClick={() => handleRemove(item.id)} disabled={updating === item.id}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
              <Box sx={{ pr: 2 }}>
                <Typography variant="h6" color="primary">
                  {(item.product?.price || 0 * item.quantity).toLocaleString('vi-VN')}đ
                </Typography>
              </Box>
            </Card>
          ))}
          <Divider sx={{ my: 3 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5">Tổng cộng:</Typography>
            <Typography variant="h5" color="primary">{total.toLocaleString('vi-VN')}đ</Typography>
          </Box>
          <Button variant="contained" color="primary" size="large" fullWidth sx={{ mt: 3 }}>
            Tiến hành đặt hàng
          </Button>
        </>
      )}
    </Container>
  );
};

export default CartPage; 