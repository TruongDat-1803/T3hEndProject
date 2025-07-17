using AutoMapper;
using DemoApp.Application.DTOs.Brands;
using DemoApp.Application.Interfaces;
using DemoApp.Domain.Interfaces;
using DemoApp.Domain.Entities;

namespace DemoApp.Application.Services
{
    public class BrandService : IBrandService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public BrandService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<BrandDto>> GetAllBrandsAsync()
        {
            var brands = await _unitOfWork.Brands.GetAllAsync();
            return _mapper.Map<IEnumerable<BrandDto>>(brands);
        }

        public async Task<BrandDto?> GetBrandByIdAsync(int id)
        {
            var brand = await _unitOfWork.Brands.GetByIdAsync(id);
            return _mapper.Map<BrandDto>(brand);
        }

        public async Task<BrandDto?> GetBrandByNameAsync(string name)
        {
            var brands = await _unitOfWork.Brands.FindAsync(b => b.BrandName == name);
            var brand = brands.FirstOrDefault();
            return _mapper.Map<BrandDto>(brand);
        }

        public async Task<BrandDto> CreateBrandAsync(CreateBrandDto createBrandDto)
        {
            // Validate name uniqueness
            var existingBrand = await _unitOfWork.Brands.FindAsync(b => b.BrandName == createBrandDto.BrandName);
            if (existingBrand.Any())
                throw new InvalidOperationException($"Brand with name '{createBrandDto.BrandName}' already exists.");

            var brand = _mapper.Map<Brand>(createBrandDto);
            brand.CreatedDate = DateTime.UtcNow;

            await _unitOfWork.Brands.AddAsync(brand);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<BrandDto>(brand);
        }

        public async Task<BrandDto> UpdateBrandAsync(int id, UpdateBrandDto updateBrandDto)
        {
            var brand = await _unitOfWork.Brands.GetByIdAsync(id);
            if (brand == null)
                throw new InvalidOperationException($"Brand with ID {id} not found.");

            // Validate name uniqueness if changed
            if (updateBrandDto.BrandName != brand.BrandName)
            {
                var existingBrand = await _unitOfWork.Brands.FindAsync(b => b.BrandName == updateBrandDto.BrandName);
                if (existingBrand.Any())
                    throw new InvalidOperationException($"Brand with name '{updateBrandDto.BrandName}' already exists.");
            }

            // Update brand properties
            _mapper.Map(updateBrandDto, brand);

            await _unitOfWork.Brands.UpdateAsync(brand);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<BrandDto>(brand);
        }

        public async Task<bool> DeleteBrandAsync(int id)
        {
            var brand = await _unitOfWork.Brands.GetByIdAsync(id);
            if (brand == null) return false;

            // Check if brand has products
            var hasProducts = await _unitOfWork.Products.FindAsync(p => p.BrandId == id);
            if (hasProducts.Any())
                throw new InvalidOperationException("Cannot delete brand that has associated products.");

            await _unitOfWork.Brands.DeleteAsync(brand);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        public async Task<bool> IsBrandNameUniqueAsync(string name)
        {
            var existingBrand = await _unitOfWork.Brands.FindAsync(b => b.BrandName == name);
            return !existingBrand.Any();
        }

        public async Task<int> GetBrandProductCountAsync(int brandId)
        {
            var products = await _unitOfWork.Products.FindAsync(p => p.BrandId == brandId);
            return products.Count();
        }
    }
} 