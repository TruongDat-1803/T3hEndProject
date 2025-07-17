import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  IconButton,
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import productService from '../services/productService';
import cartService from '../services/cartService';
import { Product } from '../types';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cartError, setCartError] = useState<string | null>(null);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    productService.getProductById(id)
      .then(setProduct)
      .catch(() => setError('Không thể tải chi tiết sản phẩm.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    setCartError(null);
    setSuccess(null);
    if (!product) return;
    try {
      await cartService.addToCart({ productId: product.productId, quantity: 1 });
      setSuccess('Đã thêm vào giỏ hàng!');
    } catch {
      setCartError('Không thể thêm vào giỏ hàng.');
    }
  };

  const images = product?.images || [];
  const currentImage = images[imgIdx]?.imageUrl || '/images/placeholder.jpg';

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
  if (!product) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        <Box sx={{ flex: 1, minWidth: 280 }}>
          <Card>
            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {images.length > 1 && (
                <IconButton
                  onClick={() => setImgIdx((imgIdx - 1 + images.length) % images.length)}
                  sx={{ position: 'absolute', left: 8, zIndex: 1 }}
                  size="small"
                >
                  <ArrowBackIos fontSize="small" />
                </IconButton>
              )}
              <CardMedia
                component="img"
                height="340"
                image={currentImage}
                alt={product.productName}
                sx={{ objectFit: 'contain', bgcolor: '#fafafa' }}
              />
              {images.length > 1 && (
                <IconButton
                  onClick={() => setImgIdx((imgIdx + 1) % images.length)}
                  sx={{ position: 'absolute', right: 8, zIndex: 1 }}
                  size="small"
                >
                  <ArrowForwardIos fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Card>
        </Box>
        <Box sx={{ flex: 2 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {product.productName}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {product.category?.categoryName} {product.brand?.brandName ? `- ${product.brand.brandName}` : ''}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h5" color="primary" fontWeight="bold">
              {product.price.toLocaleString('vi-VN')}đ
            </Typography>
            {product.originalPrice > product.price && (
              <Typography variant="body1" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                {product.originalPrice.toLocaleString('vi-VN')}đ
              </Typography>
            )}
            {product.discountPercentage > 0 && (
              <Chip label={`-${product.discountPercentage}%`} color="error" />
            )}
          </Box>
          <Typography variant="body2" color={product.stockQuantity > 0 ? 'success.main' : 'error.main'} sx={{ mb: 1 }}>
            {product.stockQuantity > 0 ? 'Còn hàng' : 'Hết hàng'}
          </Typography>
          {cartError && <Alert severity="error" sx={{ mb: 2 }}>{cartError}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <Button variant="contained" size="large" sx={{ mb: 2 }} onClick={handleAddToCart} disabled={product.stockQuantity < 1}>
            Thêm vào giỏ hàng
          </Button>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>Mô tả sản phẩm</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {product.description || 'Không có mô tả.'}
          </Typography>
          {product.specifications && product.specifications.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom>Thông số kỹ thuật</Typography>
              <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                {product.specifications.map((spec) => (
                  <li key={spec.id}>
                    <Typography variant="body2">
                      <strong>{spec.specificationName}:</strong> {spec.specificationValue}
                    </Typography>
                  </li>
                ))}
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default ProductDetailPage; 