import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { RegisterRequest } from '../services/authService';

const genders = [
  { value: '', label: 'Không xác định' },
  { value: 'Nam', label: 'Nam' },
  { value: 'Nữ', label: 'Nữ' },
  { value: 'Khác', label: 'Khác' },
];

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterRequest>({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.username || form.username.length > 50) return 'Tên đăng nhập là bắt buộc và tối đa 50 ký tự';
    if (!form.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email) || form.email.length > 100) return 'Email không hợp lệ hoặc quá dài';
    if (!form.password || form.password.length < 6 ) return 'Mật khẩu phải từ 6 ký tự';
    if (!form.firstName || form.firstName.length > 20) return 'Tên là bắt buộc và tối đa 20 ký tự';
    if (!form.lastName || form.lastName.length > 20) return 'Họ là bắt buộc và tối đa 20 ký tự';
    if (form.phoneNumber && form.phoneNumber.length > 10) return 'Số điện thoại tối đa 10 ký tự';
    if (form.gender && form.gender.length > 10) return 'Giới tính tối đa 10 ký tự';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      const result = await authService.register(form);
      if (result.success) {
        setSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(result.message || 'Đăng ký thất bại.');
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối đến máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Đăng ký tài khoản
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <TextField
            label="Tên đăng nhập"
            name="username"
            value={form.username}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            inputProps={{ maxLength: 50 }}
          />
          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            inputProps={{ maxLength: 100 }}
            type="email"
          />
          <TextField
            label="Mật khẩu"
            name="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            inputProps={{ maxLength: 100 }}
            type="password"
          />
          <TextField
            label="Tên"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            inputProps={{ maxLength: 50 }}
          />
          <TextField
            label="Họ"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            inputProps={{ maxLength: 50 }}
          />
          <TextField
            label="Số điện thoại"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
            inputProps={{ maxLength: 20 }}
          />
          <TextField
            label="Ngày sinh"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="date"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Giới tính"
            name="gender"
            value={form.gender}
            onChange={handleChange}
            fullWidth
            margin="normal"
            select
          >
            {genders.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>
        </Box>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Đã có tài khoản?{' '}
            <Button variant="text" onClick={() => navigate('/login')}>Đăng nhập</Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage; 