import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h1" gutterBottom color="primary">
          404
        </Typography>
        <Typography variant="h4" gutterBottom>
          Trang không tồn tại
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/')}
        >
          Về trang chủ
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage; 