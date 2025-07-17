import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const CheckoutPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Thanh toán
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Trang thanh toán sẽ được phát triển sau.
      </Typography>
    </Container>
  );
};

export default CheckoutPage; 