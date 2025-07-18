import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Slider,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  FilterList,
  Clear,
  ExpandMore,
} from '@mui/icons-material';
import { Category, Brand, ProductFilters } from '../../types';

interface FilterPanelProps {
  categories: Category[];
  brands: Brand[];
  filters: ProductFilters;
  onFilterChange: (filters: ProductFilters) => void;
  onClearFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  categories,
  brands,
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    const [minPrice, maxPrice] = newValue as number[];
    handleFilterChange('minPrice', minPrice);
    handleFilterChange('maxPrice', maxPrice);
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== undefined && value !== '' && value !== null
  ).length;

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterList />
            Bộ lọc
          </Typography>
          {activeFiltersCount > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip label={activeFiltersCount} color="primary" size="small" />
              <Button
                size="small"
                startIcon={<Clear />}
                onClick={onClearFilters}
                sx={{ textTransform: 'none' }}
              >
                Xóa bộ lọc
              </Button>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Search */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight={600}>
                Tìm kiếm
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                fullWidth
                label="Từ khóa"
                value={filters.searchTerm || ''}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                placeholder="Nhập tên sản phẩm..."
                size="small"
              />
            </AccordionDetails>
          </Accordion>

          {/* Category */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight={600}>
                Danh mục
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                select
                fullWidth
                label="Chọn danh mục"
                value={filters.categoryId || ''}
                onChange={(e) => handleFilterChange('categoryId', e.target.value ? Number(e.target.value) : undefined)}
                size="small"
              >
                <MenuItem value="">Tất cả danh mục</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </MenuItem>
                ))}
              </TextField>
            </AccordionDetails>
          </Accordion>

          {/* Brand */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight={600}>
                Thương hiệu
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                select
                fullWidth
                label="Chọn thương hiệu"
                value={filters.brandId || ''}
                onChange={(e) => handleFilterChange('brandId', e.target.value ? Number(e.target.value) : undefined)}
                size="small"
              >
                <MenuItem value="">Tất cả thương hiệu</MenuItem>
                {brands.map((brand) => (
                  <MenuItem key={brand.brandId} value={brand.brandId}>
                    {brand.brandName}
                  </MenuItem>
                ))}
              </TextField>
            </AccordionDetails>
          </Accordion>

          {/* Price Range */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight={600}>
                Khoảng giá
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ px: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {filters.minPrice?.toLocaleString('vi-VN') || '0'}đ - {filters.maxPrice?.toLocaleString('vi-VN') || '50,000,000'}đ
                </Typography>
                <Slider
                  value={[filters.minPrice || 0, filters.maxPrice || 50000000]}
                  onChange={handlePriceChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={50000000}
                  step={100000}
                  valueLabelFormat={(value) => `${value.toLocaleString('vi-VN')}đ`}
                  sx={{ mt: 2 }}
                />
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Sort */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight={600}>
                Sắp xếp
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  select
                  fullWidth
                  label="Sắp xếp theo"
                  value={filters.sortBy || ''}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  size="small"
                >
                  <MenuItem value="">Mặc định</MenuItem>
                  <MenuItem value="name">Tên sản phẩm</MenuItem>
                  <MenuItem value="price">Giá</MenuItem>
                  <MenuItem value="createdAt">Mới nhất</MenuItem>
                </TextField>
                <TextField
                  select
                  fullWidth
                  label="Thứ tự"
                  value={filters.sortOrder || ''}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                  size="small"
                >
                  <MenuItem value="asc">Tăng dần</MenuItem>
                  <MenuItem value="desc">Giảm dần</MenuItem>
                </TextField>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FilterPanel; 