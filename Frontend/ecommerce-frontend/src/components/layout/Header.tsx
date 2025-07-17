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
  Close as CloseIcon,
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
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '40ch',
    },
  },
}));

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { totalItems } = useSelector((state: RootState) => state.cart) as { totalItems: number };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <AppBar position="sticky" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              cursor: 'pointer',
              fontWeight: 'bold',
              color: 'primary.main',
            }}
            onClick={() => navigate('/')}
          >
            TechStore
          </Typography>

          {/* Search Bar */}
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
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

          {/* Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <Button
              color="inherit"
              onClick={() => navigate('/products')}
              sx={{ textTransform: 'none' }}
            >
              Sản phẩm
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/products?category=laptops')}
              sx={{ textTransform: 'none' }}
            >
              Laptop
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/products?category=phones')}
              sx={{ textTransform: 'none' }}
            >
              Điện thoại
            </Button>
          </Box>

          {/* Right side actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Cart */}
            <IconButton
              color="inherit"
              onClick={() => navigate('/cart')}
              sx={{ position: 'relative' }}
            >
              <Badge badgeContent={totalItems} color="secondary">
                <CartIcon />
              </Badge>
            </IconButton>

            {/* User menu */}
            {isAuthenticated ? (
              <>
                <IconButton
                  color="inherit"
                  onClick={handleMenuOpen}
                  sx={{ ml: 1 }}
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
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
                sx={{ textTransform: 'none' }}
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