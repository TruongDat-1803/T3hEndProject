import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Rating,
  IconButton,
} from '@mui/material';
import {
  ArrowForward,
  Favorite,
  ShoppingCart,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" gutterBottom fontWeight="bold">
              Công nghệ mới nhất
            </Typography>
            <Typography variant="h5" sx={{ mb: 3, opacity: 0.9 }}>
              Khám phá các sản phẩm công nghệ chất lượng cao với giá cả hợp lý
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/products')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
            >
              Khám phá ngay
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Featured Products */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4">
            Sản phẩm nổi bật
          </Typography>
          <Button
            variant="outlined"
            endIcon={<ArrowForward />}
            onClick={() => navigate('/products')}
          >
            Xem tất cả
          </Button>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {/* Sample Product Cards */}
          {[1, 2, 3, 4].map((id) => (
            <Card
              key={id}
              sx={{
                width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' },
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
              onClick={() => handleProductClick(id)}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image="/images/placeholder.jpg"
                  alt="Product"
                />
                <Chip
                  label="-20%"
                  color="error"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                  }}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'rgba(255,255,255,0.9)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,1)',
                    },
                  }}
                >
                  <Favorite fontSize="small" />
                </IconButton>
              </Box>
              
              <CardContent>
                <Typography variant="h6" gutterBottom noWrap>
                  Sản phẩm mẫu {id}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={4.5} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    (123)
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {(15000000 + id * 1000000).toLocaleString('vi-VN')}đ
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textDecoration: 'line-through' }}
                  >
                    {(18000000 + id * 1000000).toLocaleString('vi-VN')}đ
                  </Typography>
                </Box>
                
                <Button
                  variant="contained"
                  startIcon={<ShoppingCart />}
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add to cart logic
                  }}
                >
                  Thêm vào giỏ
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* Promotional Banner */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Card
          sx={{
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            color: 'white',
            p: 4,
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Khuyến mãi đặc biệt
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
              Giảm giá lên đến 50% cho các sản phẩm công nghệ mới nhất
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
              onClick={() => navigate('/products?promotion=true')}
            >
              Mua ngay
            </Button>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default HomePage; 