import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const ProductDetailPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Chi tiết sản phẩm
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Trang chi tiết sản phẩm sẽ được phát triển sau.
      </Typography>
    </Container>
  );
};

export default ProductDetailPage; 