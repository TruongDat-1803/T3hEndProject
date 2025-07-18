import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
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
  Dialog,
  DialogContent,
  DialogActions,
  Paper,
  Avatar,
  TextareaAutosize,
  Snackbar,
  Fab,
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
  ZoomIn,
  Close,
  LocalShipping,
  Security,
  Support,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { addToCart } from '../store/slices/cartSlice';
import productService from '../services/productService';
import ProductCard from '../components/common/ProductCard';
import { Product, ProductReview, Category, Brand } from '../types';

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
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageZoomOpen, setImageZoomOpen] = useState(false);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      setLoading(true);
      setError(null);
      try {
        const data = await productService.getProductById(productId);
        setProduct(data);
        
        // Fetch related products
        if (data.category?.categoryId) {
          const related = await productService.getProducts({
            categoryId: data.category.categoryId
          });
          setRelatedProducts(Array.isArray(related) ? related : (related as any).data || []);
        }
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
      setSnackbarMessage('Đã thêm sản phẩm vào giỏ hàng!');
      setSnackbarOpen(true);
    } else {
      navigate('/login');
    }
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    setSnackbarMessage(isWishlisted ? 'Đã xóa khỏi yêu thích' : 'Đã thêm vào yêu thích');
    setSnackbarOpen(true);
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

  const handleImageZoom = () => {
    setImageZoomOpen(true);
  };

  const handleReviewSubmit = async () => {
    if (!product || !isAuthenticated) return;
    
    try {
      // TODO: Implement review submission API
      setReviewFormOpen(false);
      setReviewRating(5);
      setReviewComment('');
      setSnackbarMessage('Đánh giá đã được gửi thành công!');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Có lỗi xảy ra khi gửi đánh giá.');
      setSnackbarOpen(true);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.productName,
          text: product?.description,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      setSnackbarMessage('Đã sao chép link vào clipboard!');
      setSnackbarOpen(true);
    }
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

  const totalReviews = product.reviews?.length || 0;

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
        {product.category && (
          <Link color="inherit" href={`/products?category=${product.category.categoryId}`} underline="hover">
            {product.category.categoryName}
          </Link>
        )}
        <Typography color="text.primary">{product.productName}</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {/* Product Images */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' }, minWidth: 0 }}>
          <Box sx={{ position: 'relative' }}>
            {/* Main Image */}
            <Card 
              sx={{ 
                mb: 2, 
                cursor: 'pointer',
                '&:hover': {
                  '& .zoom-overlay': {
                    opacity: 1,
                  }
                }
              }}
              onClick={handleImageZoom}
            >
              <Box sx={{ position: 'relative' }}>
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
                <Box
                  className="zoom-overlay"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: 'rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.3s',
                  }}
                >
                  <ZoomIn sx={{ color: 'white', fontSize: 40 }} />
                </Box>
              </Box>
            </Card>

            {/* Thumbnail Gallery */}
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

            {/* Rating & Reviews */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Rating value={averageRating} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary">
                ({totalReviews} đánh giá)
              </Typography>
              <Button
                size="small"
                onClick={() => setTabValue(2)}
                sx={{ textTransform: 'none' }}
              >
                Xem tất cả đánh giá
              </Button>
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

            {/* Short Description */}
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
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
              <IconButton 
                onClick={handleShare}
                sx={{ border: '1px solid #ddd' }}
              >
                <Share />
              </IconButton>
            </Box>

            {/* Product Features */}
            <Paper sx={{ p: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <LocalShipping sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="body2" fontWeight="bold">
                    Miễn phí vận chuyển
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Cho đơn hàng từ 500k
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <Security sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="body2" fontWeight="bold">
                    Bảo hành chính hãng
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    12-24 tháng
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <Support sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="body2" fontWeight="bold">
                    Hỗ trợ 24/7
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Hotline miễn phí
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Product Details Tabs */}
      <Box sx={{ mt: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="product details tabs">
          <Tab label="Mô tả" />
          <Tab label="Thông số kỹ thuật" />
          <Tab label={`Đánh giá (${totalReviews})`} />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            {product.description}
          </Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {product.specifications && product.specifications.length > 0 ? (
            <Box>
              {product.specifications.map((spec, index) => (
                <Box key={index} sx={{ p: 2, border: '1px solid #eee', borderRadius: 1, mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {spec.specificationName}
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {spec.specificationValue}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body1" color="text.secondary">
              Chưa có thông số kỹ thuật.
            </Typography>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Đánh giá sản phẩm</Typography>
              {isAuthenticated && (
                <Button
                  variant="outlined"
                  onClick={() => setReviewFormOpen(true)}
                >
                  Viết đánh giá
                </Button>
              )}
            </Box>
            
            {product.reviews && product.reviews.length > 0 ? (
              <Box>
                {product.reviews.map((review, index) => (
                  <Card key={index} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Avatar sx={{ width: 40, height: 40 }}>
                          {review.user?.firstName?.[0] || 'U'}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" fontWeight="bold">
                            {review.user?.firstName} {review.user?.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                          </Typography>
                        </Box>
                        <Rating value={review.rating} readOnly size="small" />
                      </Box>
                      {review.comment && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {review.comment}
                        </Typography>
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
          </Box>
        </TabPanel>
      </Box>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom>
            Sản phẩm liên quan
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {relatedProducts
              .filter(p => p.productId !== product.productId)
              .slice(0, 4)
              .map((relatedProduct) => (
                <Box key={relatedProduct.productId} sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
                  <ProductCard product={relatedProduct} />
                </Box>
              ))}
          </Box>
        </Box>
      )}

      {/* Image Zoom Dialog */}
      <Dialog
        open={imageZoomOpen}
        onClose={() => setImageZoomOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ position: 'relative' }}>
            <IconButton
              onClick={() => setImageZoomOpen(false)}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.7)',
                },
              }}
            >
              <Close />
            </IconButton>
            <Box
              component="img"
              src={product.images?.[selectedImage]?.imageUrl || '/images/placeholder.jpg'}
              alt={product.productName}
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: '80vh',
                objectFit: 'contain',
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* Review Form Dialog */}
      <Dialog
        open={reviewFormOpen}
        onClose={() => setReviewFormOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Viết đánh giá
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" gutterBottom>
              Đánh giá của bạn
            </Typography>
            <Rating
              value={reviewRating}
              onChange={(event, newValue) => {
                setReviewRating(newValue || 5);
              }}
              size="large"
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" gutterBottom>
              Nhận xét (tùy chọn)
            </Typography>
            <TextareaAutosize
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
              style={{
                width: '100%',
                minHeight: 100,
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontFamily: 'inherit',
                fontSize: '14px',
                resize: 'vertical',
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewFormOpen(false)}>
            Hủy
          </Button>
          <Button 
            variant="contained" 
            onClick={handleReviewSubmit}
            disabled={!reviewRating}
          >
            Gửi đánh giá
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />

      {/* Floating Action Button for quick actions */}
      <Fab
        color="primary"
        aria-label="add to cart"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}
        onClick={handleAddToCart}
        disabled={product.stockQuantity <= 0}
      >
        <ShoppingCart />
      </Fab>
    </Container>
  );
};

export default ProductDetailPage; 