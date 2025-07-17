import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  Phone,
  Email,
  LocationOn,
} from '@mui/icons-material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.900',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mb: 4 }}>
          {/* Company Info */}
          <Box sx={{ flex: '1 1 300px' }}>
            <Typography variant="h6" gutterBottom>
              TechStore
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Chuyên cung cấp các sản phẩm công nghệ chất lượng cao với giá cả hợp lý.
              Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất cho khách hàng.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton color="inherit" size="small">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" size="small">
                <Twitter />
              </IconButton>
              <IconButton color="inherit" size="small">
                <Instagram />
              </IconButton>
              <IconButton color="inherit" size="small">
                <YouTube />
              </IconButton>
            </Box>
          </Box>

          {/* Quick Links */}
          <Box sx={{ flex: '1 1 200px' }}>
            <Typography variant="h6" gutterBottom>
              Danh mục
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/products?category=laptops" color="inherit" underline="hover">
                Laptop
              </Link>
              <Link href="/products?category=phones" color="inherit" underline="hover">
                Điện thoại
              </Link>
              <Link href="/products?category=tablets" color="inherit" underline="hover">
                Máy tính bảng
              </Link>
              <Link href="/products?category=accessories" color="inherit" underline="hover">
                Phụ kiện
              </Link>
            </Box>
          </Box>

          {/* Customer Service */}
          <Box sx={{ flex: '1 1 200px' }}>
            <Typography variant="h6" gutterBottom>
              Hỗ trợ
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/help" color="inherit" underline="hover">
                Trung tâm trợ giúp
              </Link>
              <Link href="/shipping" color="inherit" underline="hover">
                Chính sách vận chuyển
              </Link>
              <Link href="/returns" color="inherit" underline="hover">
                Chính sách đổi trả
              </Link>
              <Link href="/warranty" color="inherit" underline="hover">
                Bảo hành
              </Link>
            </Box>
          </Box>

          {/* Contact Info */}
          <Box sx={{ flex: '1 1 250px' }}>
            <Typography variant="h6" gutterBottom>
              Liên hệ
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone fontSize="small" />
                <Typography variant="body2">
                  1900-1234
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email fontSize="small" />
                <Typography variant="body2">
                  support@techstore.vn
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn fontSize="small" />
                <Typography variant="body2">
                  123 Đường ABC, Quận 1, TP.HCM
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 4, borderColor: 'grey.700' }} />

        {/* Bottom Footer */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2" color="grey.400">
            © 2024 TechStore. Tất cả quyền được bảo lưu.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link href="/privacy" color="inherit" underline="hover" variant="body2">
              Chính sách bảo mật
            </Link>
            <Link href="/terms" color="inherit" underline="hover" variant="body2">
              Điều khoản sử dụng
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 