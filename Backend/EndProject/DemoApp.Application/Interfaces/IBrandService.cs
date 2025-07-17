using DemoApp.Application.DTOs.Brands;

namespace DemoApp.Application.Interfaces
{
    public interface IBrandService
    {
        Task<IEnumerable<BrandDto>> GetAllBrandsAsync();
        Task<BrandDto?> GetBrandByIdAsync(int id);
        Task<BrandDto?> GetBrandByNameAsync(string name);
        Task<BrandDto> CreateBrandAsync(CreateBrandDto createBrandDto);
        Task<BrandDto> UpdateBrandAsync(int id, UpdateBrandDto updateBrandDto);
        Task<bool> DeleteBrandAsync(int id);
        Task<bool> IsBrandNameUniqueAsync(string name);
        Task<int> GetBrandProductCountAsync(int brandId);
    }
} 