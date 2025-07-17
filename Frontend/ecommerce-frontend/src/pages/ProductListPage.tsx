import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const ProductListPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Danh sách sản phẩm
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Trang danh sách sản phẩm sẽ được phát triển sau.
      </Typography>
    </Container>
  );
};

export default ProductListPage; 