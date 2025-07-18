import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Rating,
  TextField,
  Divider,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Badge,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Share,
  Star,
  StarBorder,
  Add,
  Remove,
  Visibility,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { addToCart } from '../store/slices/cartSlice';
import productService from '../services/productService';
import { Product, ProductReview } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      setLoading(true);
      setError(null);
      try {
        const data = await productService.getProductById(productId);
        setProduct(data);
      } catch (err: any) {
        setError('Không thể tải thông tin sản phẩm.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    
    if (isAuthenticated) {
      dispatch(addToCart({ productId: product.productId, quantity }));
    } else {
      navigate('/login');
    }
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    // TODO: Implement wishlist API call
  };

  const handleQuantityChange = (increment: boolean) => {
    if (increment) {
      setQuantity(prev => Math.min(prev + 1, product?.stockQuantity || 1));
    } else {
      setQuantity(prev => Math.max(prev - 1, 1));
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Sản phẩm không tồn tại.'}</Alert>
      </Container>
    );
  }

  const averageRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link color="inherit" href="/" underline="hover">
          Trang chủ
        </Link>
        <Link color="inherit" href="/products" underline="hover">
          Sản phẩm
        </Link>
        <Typography color="text.primary">{product.productName}</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {/* Product Images */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' }, minWidth: 0 }}>
          <Box sx={{ position: 'relative' }}>
            {/* Main Image */}
            <Card sx={{ mb: 2 }}>
              <Box
                component="img"
                src={product.images?.[selectedImage]?.imageUrl || '/images/placeholder.jpg'}
                alt={product.productName}
                sx={{
                  width: '100%',
                  height: 400,
                  objectFit: 'cover',
                  borderRadius: 1,
                }}
              />
            </Card>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {product.images.map((image, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={image.imageUrl}
                    alt={`${product.productName} ${index + 1}`}
                    sx={{
                      width: 80,
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: 1,
                      cursor: 'pointer',
                      border: selectedImage === index ? '2px solid primary.main' : '2px solid transparent',
                      '&:hover': {
                        border: '2px solid primary.main',
                      },
                    }}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>

        {/* Product Info */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' }, minWidth: 0 }}>
          <Box sx={{ mb: 3 }}>
            {/* Category & Brand */}
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {product.category?.categoryName} {product.brand ? `• ${product.brand.brandName}` : ''}
            </Typography>

            {/* Product Name */}
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              {product.productName}
            </Typography>

            {/* Rating */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Rating value={averageRating} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary">
                ({product.reviews?.length || 0} đánh giá)
              </Typography>
            </Box>

            {/* Price */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {product.price.toLocaleString('vi-VN')}đ
              </Typography>
              {product.originalPrice > product.price && (
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ textDecoration: 'line-through' }}
                >
                  {product.originalPrice.toLocaleString('vi-VN')}đ
                </Typography>
              )}
              {product.discountPercentage > 0 && (
                <Chip
                  label={`-${product.discountPercentage}%`}
                  color="error"
                  size="small"
                  sx={{ fontWeight: 'bold' }}
                />
              )}
            </Box>

            {/* Stock Status */}
            <Typography
              variant="body1"
              color={product.stockQuantity > 0 ? 'success.main' : 'error.main'}
              sx={{ mb: 3 }}
            >
              {product.stockQuantity > 0 ? 'Còn hàng' : 'Hết hàng'}
            </Typography>

            {/* Description */}
            <Typography variant="body1" sx={{ mb: 3 }}>
              {product.description}
            </Typography>

            {/* Quantity Selector */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography variant="body1">Số lượng:</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: 1 }}>
                <IconButton
                  onClick={() => handleQuantityChange(false)}
                  disabled={quantity <= 1}
                  size="small"
                >
                  <Remove />
                </IconButton>
                <TextField
                  value={quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value > 0 && value <= product.stockQuantity) {
                      setQuantity(value);
                    }
                  }}
                  sx={{ width: 60, '& .MuiInputBase-input': { textAlign: 'center' } }}
                  size="small"
                />
                <IconButton
                  onClick={() => handleQuantityChange(true)}
                  disabled={quantity >= product.stockQuantity}
                  size="small"
                >
                  <Add />
                </IconButton>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                disabled={product.stockQuantity <= 0}
                sx={{ flex: 1, py: 1.5 }}
              >
                Thêm vào giỏ hàng
              </Button>
              <IconButton
                onClick={handleWishlistToggle}
                sx={{ border: '1px solid #ddd' }}
              >
                {isWishlisted ? <Favorite color="error" /> : <FavoriteBorder />}
              </IconButton>
              <IconButton sx={{ border: '1px solid #ddd' }}>
                <Share />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Product Details Tabs */}
      <Box sx={{ mt: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="product details tabs">
          <Tab label="Mô tả" />
          <Tab label="Thông số kỹ thuật" />
          <Tab label="Đánh giá" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            {product.description}
          </Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {product.specifications && product.specifications.length > 0 ? (
            <List>
              {product.specifications.map((spec, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={spec.specificationName}
                    secondary={spec.specificationValue}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1" color="text.secondary">
              Chưa có thông số kỹ thuật.
            </Typography>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {product.reviews && product.reviews.length > 0 ? (
            <Box>
              {product.reviews.map((review, index) => (
                <Card key={index} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Rating value={review.rating} readOnly size="small" />
                      <Typography variant="body2" color="text.secondary">
                        {review.user?.firstName} {review.user?.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                      </Typography>
                    </Box>
                    {review.comment && (
                      <Typography variant="body2">{review.comment}</Typography>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Typography variant="body1" color="text.secondary">
              Chưa có đánh giá nào.
            </Typography>
          )}
        </TabPanel>
      </Box>
    </Container>
  );
};

export default ProductDetailPage; 