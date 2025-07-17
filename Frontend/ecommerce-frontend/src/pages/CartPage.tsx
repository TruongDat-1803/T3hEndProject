import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const CartPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Giỏ hàng
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Trang giỏ hàng sẽ được phát triển sau.
      </Typography>
    </Container>
  );
};

export default CartPage; 