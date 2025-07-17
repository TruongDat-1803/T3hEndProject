import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const ProfilePage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Thông tin cá nhân
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Trang thông tin cá nhân sẽ được phát triển sau.
      </Typography>
    </Container>
  );
};

export default ProfilePage; 