import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const OrderHistoryPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Lịch sử đơn hàng
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Trang lịch sử đơn hàng sẽ được phát triển sau.
      </Typography>
    </Container>
  );
};

export default OrderHistoryPage; 