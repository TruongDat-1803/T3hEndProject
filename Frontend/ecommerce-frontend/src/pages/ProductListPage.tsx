import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import productService from '../services/productService';
import { Product, Category, Brand, ProductFilters } from '../types';

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [cats, brs] = await Promise.all([
          productService.getCategories(),
          productService.getBrands(),
        ]);
        setCategories(cats);
        setBrands(brs);
      } catch (err: any) {
        setError('Không thể tải bộ lọc.');
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productService.getProducts({ ...filters, searchTerm: search });
        setProducts(data);
      } catch (err: any) {
        setError('Không thể tải sản phẩm.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters, search]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  console.log(categories);
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Danh sách sản phẩm
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          label="Tìm kiếm"
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 220 }}
        />
        <TextField
          select
          label="Danh mục"
          name="categoryId"
          value={filters.categoryId || ''}
          onChange={handleFilterChange}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">Tất cả</MenuItem>
          {(Array.isArray(categories) ? categories : []).map((cat) => (
            <MenuItem key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Thương hiệu"
          name="brandId"
          value={filters.brandId || ''}
          onChange={handleFilterChange}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">Tất cả</MenuItem>
          {(Array.isArray(brands) ? brands : []).map((brand) => (
            <MenuItem key={brand.brandId} value={brand.brandId}>{brand.brandName}</MenuItem>
          ))}
        </TextField>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {(Array.isArray(products) && products.length === 0) ? (
            <Box sx={{ width: '100%' }}>
              <Typography variant="body1" color="text.secondary" align="center">
                Không có sản phẩm nào phù hợp.
              </Typography>
            </Box>
          ) : (
            (Array.isArray(products) ? products : []).map((product) => (
              <Box key={product.productId} sx={{ flex: '1 1 260px', minWidth: 260, maxWidth: 320 }}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="180"
                      image={product.images?.[0]?.imageUrl || '/images/placeholder.jpg'}
                      alt={product.productName}
                    />
                    {product.discountPercentage > 0 && (
                      <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
                        <Chip label={`-${product.discountPercentage}%`} color="error" />
                      </Box>
                    )}
                    {product.brand?.logoUrl && (
                      <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                        <img src={product.brand.logoUrl} alt={product.brand.brandName} style={{ width: 32, height: 32, borderRadius: '50%', background: '#fff', border: '1px solid #eee' }} />
                      </Box>
                    )}
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom noWrap>
                      {product.productName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {product.category?.categoryName} {product.brand ? `- ${product.brand.brandName}` : ''}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }} noWrap>
                      {product.description || ''}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        {product.price?.toLocaleString('vi-VN')}đ
                      </Typography>
                      {product.originalPrice > product.price && (
                        <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                          {product.originalPrice?.toLocaleString('vi-VN')}đ
                        </Typography>
                      )}
                    </Box>
                    <Typography variant="body2" color={product.stockQuantity > 0 ? 'success.main' : 'error.main'}>
                      {product.stockQuantity > 0 ? 'Còn hàng' : 'Hết hàng'}
                    </Typography>
                    <Button variant="outlined" fullWidth sx={{ mt: 1 }}>
                      Xem chi tiết
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            ))
          )}
        </Box>
      )}
    </Container>
  );
};

export default ProductListPage; 