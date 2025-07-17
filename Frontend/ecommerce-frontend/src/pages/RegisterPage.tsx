import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const RegisterPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Đăng ký
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Trang đăng ký sẽ được phát triển sau.
      </Typography>
    </Container>
  );
};

export default RegisterPage; 