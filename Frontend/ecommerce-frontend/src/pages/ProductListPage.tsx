import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Pagination,
  CircularProgress,
  Alert,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  ViewList,
  ViewModule,
  Sort,
} from '@mui/icons-material';
import productService from '../services/productService';
import ProductCard from '../components/common/ProductCard';
import FilterPanel from '../components/common/FilterPanel';
import { Product, Category, Brand, ProductFilters } from '../types';

const ProductListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'createdAt' | ''>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Load filters from URL params
  useEffect(() => {
    const categoryId = searchParams.get('category');
    const brandId = searchParams.get('brand');
    const searchTerm = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const urlFilters: ProductFilters = {};
    if (categoryId) urlFilters.categoryId = parseInt(categoryId);
    if (brandId) urlFilters.brandId = parseInt(brandId);
    if (searchTerm) urlFilters.searchTerm = searchTerm;
    if (minPrice) urlFilters.minPrice = parseInt(minPrice);
    if (maxPrice) urlFilters.maxPrice = parseInt(maxPrice);

    setFilters(urlFilters);
  }, [searchParams]);

  // Fetch categories and brands
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

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          ...filters,
          pageNumber: currentPage,
          pageSize: 12,
          sortBy: sortBy || undefined,
          sortOrder,
        };

        const response = await productService.getProducts(params);
        
        // Handle both array and paginated response
        if (Array.isArray(response)) {
          setProducts(response);
          setTotalPages(1);
          setTotalCount(response.length);
        } else {
          // Type assertion for paginated response
          const paginatedResponse = response as any;
          setProducts(paginatedResponse.data || []);
          setTotalPages(paginatedResponse.totalPages || 1);
          setTotalCount(paginatedResponse.totalCount || 0);
        }
      } catch (err: any) {
        setError('Không thể tải sản phẩm.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, currentPage, sortBy, sortOrder]);

  const handleFilterChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    
    // Update URL params
    const params = new URLSearchParams();
    if (newFilters.categoryId) params.set('category', newFilters.categoryId.toString());
    if (newFilters.brandId) params.set('brand', newFilters.brandId.toString());
    if (newFilters.searchTerm) params.set('search', newFilters.searchTerm);
    if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice.toString());
    if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice.toString());
    
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
    setSearchParams({});
  };

  const handleWishlistToggle = (productId: number) => {
    // TODO: Implement wishlist API call
    console.log('Toggle wishlist for product:', productId);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== undefined && value !== '' && value !== null
  ).length;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Sản phẩm
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {totalCount > 0 ? `${totalCount} sản phẩm` : 'Không có sản phẩm nào'}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Filter Panel */}
        <Box sx={{ width: '25%', minWidth: 280 }}>
          <FilterPanel
            categories={categories}
            brands={brands}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </Box>

        {/* Product Grid */}
        <Box sx={{ flex: 1 }}>
          {/* Toolbar */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 3,
            flexWrap: 'wrap',
            gap: 2
          }}>
            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.secondary">
                  Bộ lọc đang áp dụng:
                </Typography>
                <Chip label={activeFiltersCount} color="primary" size="small" />
                <Button
                  size="small"
                  onClick={handleClearFilters}
                  sx={{ textTransform: 'none' }}
                >
                  Xóa tất cả
                </Button>
              </Box>
            )}

            {/* Sort and View Controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Sort */}
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Sắp xếp</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'createdAt' | '')}
                  label="Sắp xếp"
                >
                  <MenuItem value="">Mặc định</MenuItem>
                  <MenuItem value="name">Tên sản phẩm</MenuItem>
                  <MenuItem value="price">Giá</MenuItem>
                  <MenuItem value="createdAt">Mới nhất</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel>Thứ tự</InputLabel>
                <Select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                  label="Thứ tự"
                >
                  <MenuItem value="asc">Tăng dần</MenuItem>
                  <MenuItem value="desc">Giảm dần</MenuItem>
                </Select>
              </FormControl>

              {/* View Mode */}
              <Box sx={{ display: 'flex', border: '1px solid #ddd', borderRadius: 1 }}>
                <Button
                  size="small"
                  onClick={() => setViewMode('grid')}
                  sx={{
                    minWidth: 'auto',
                    px: 1,
                    bgcolor: viewMode === 'grid' ? 'primary.main' : 'transparent',
                    color: viewMode === 'grid' ? 'white' : 'inherit',
                    '&:hover': {
                      bgcolor: viewMode === 'grid' ? 'primary.dark' : 'rgba(0,0,0,0.04)',
                    },
                  }}
                >
                  <ViewModule />
                </Button>
                <Button
                  size="small"
                  onClick={() => setViewMode('list')}
                  sx={{
                    minWidth: 'auto',
                    px: 1,
                    bgcolor: viewMode === 'list' ? 'primary.main' : 'transparent',
                    color: viewMode === 'list' ? 'white' : 'inherit',
                    '&:hover': {
                      bgcolor: viewMode === 'list' ? 'primary.dark' : 'rgba(0,0,0,0.04)',
                    },
                  }}
                >
                  <ViewList />
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Loading State */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : products.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Không tìm thấy sản phẩm
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
              </Typography>
            </Box>
          ) : (
            <>
              {/* Product Grid */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: viewMode === 'grid' 
                  ? 'repeat(auto-fill, minmax(280px, 1fr))' 
                  : '1fr',
                gap: 3 
              }}>
                {products.map((product) => (
                  <Box key={product.productId}>
                    <ProductCard
                      product={product}
                      onWishlistToggle={handleWishlistToggle}
                    />
                  </Box>
                ))}
              </Box>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default ProductListPage; 