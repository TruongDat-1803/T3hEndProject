import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Container,
  InputBase,
  Menu,
  MenuItem,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart as CartIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { logoutUser } from '../../store/slices/authSlice';

// Styled components
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.common.white, // trắng
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.9),
  },
  marginLeft: theme.spacing(2),
  width: '450px', // giảm xuống 450px
  minWidth: '450px', // giảm xuống 450px
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.primary, // kính lúp màu đen
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary, // chữ đen
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

// Custom Category Button
const CategoryButton: React.FC<{ onClick: (e: React.MouseEvent<HTMLElement>) => void }> = ({ onClick }) => (
  <Button
    variant="contained"
    onClick={onClick}
    sx={{
      color: 'white',
      bgcolor: 'rgba(255, 255, 255, 0.2)', // màu nhạt hơn
      textTransform: 'none',
      fontWeight: 500,
      boxShadow: 'none',
      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' }, // nhạt hơn khi hover
      mr: 2,
    }}
    startIcon={<MenuIcon />}
  >
    Danh mục
  </Button>
);

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { totalItems } = useSelector((state: RootState) => state.cart) as { totalItems: number };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [categoryAnchorEl, setCategoryAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // User menu
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    dispatch(logoutUser());
    handleMenuClose();
    navigate('/');
  };

  // Category menu
  const handleCategoryMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setCategoryAnchorEl(event.currentTarget);
  };
  const handleCategoryMenuClose = () => {
    setCategoryAnchorEl(null);
  };
  const handleCategorySelect = (category: string) => {
    navigate(`/products?category=${category}`);
    handleCategoryMenuClose();
  };

  // Search
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <AppBar position="sticky" elevation={1} sx={{ bgcolor: 'primary.main' }}>
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', gap: 2, minHeight: 64 }}>
          {/* Left side */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Store Name */}
            <Typography
              variant="h5"
              component="div"
              sx={{
                cursor: 'pointer',
                fontWeight: 'bold',
                color: 'white',
                letterSpacing: 1,
                ml: '140px', // dịch sang phải 145px
              }}
              onClick={() => navigate('/')}
            >
              Shyphone
            </Typography>

            {/* Category Button */}
            <CategoryButton onClick={handleCategoryMenuOpen} />
            <Menu
              anchorEl={categoryAnchorEl}
              open={Boolean(categoryAnchorEl)}
              onClose={handleCategoryMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
              <MenuItem onClick={() => handleCategorySelect('laptops')}>Laptop</MenuItem>
              <MenuItem onClick={() => handleCategorySelect('phones')}>Điện thoại</MenuItem>
            </Menu>

            {/* Search Bar */}
            <Box sx={{ width: '450px', minWidth: '450px' }}> {/* giảm xuống 450px */}
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <form onSubmit={handleSearch} style={{ width: '100%' }}>
                  <StyledInputBase
                    placeholder="Tìm kiếm sản phẩm..."
                    inputProps={{ 'aria-label': 'search' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
              </Search>
            </Box>
          </Box>

          {/* Right side */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: '130px' }}> {/* dịch sang trái 140px */}
            {/* Cart Button with label and icon */}
            <Button
              color="inherit"
              onClick={() => navigate('/cart')}
              sx={{ display: 'flex', alignItems: 'center', textTransform: 'none', fontWeight: 500 }}
              startIcon={
                <Badge badgeContent={totalItems} color="secondary">
                  <CartIcon />
                </Badge>
              }
            >
              Giỏ hàng
            </Button>

            {/* Login/User */}
            {isAuthenticated ? (
              <>
                <IconButton
                  color="inherit"
                  onClick={handleMenuOpen}
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                    {user?.firstName?.charAt(0) || 'U'}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                    Thông tin cá nhân
                  </MenuItem>
                  <MenuItem onClick={() => { navigate('/orders'); handleMenuClose(); }}>
                    Đơn hàng của tôi
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    Đăng xuất
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                color="inherit"
                startIcon={<PersonIcon />}
                onClick={() => navigate('/login')}
                sx={{ textTransform: 'none', fontWeight: 500 }}
              >
                Đăng nhập
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header; 