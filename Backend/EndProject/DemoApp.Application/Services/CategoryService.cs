using AutoMapper;
using DemoApp.Application.DTOs.Categories;
using DemoApp.Application.Interfaces;
using DemoApp.Domain.Interfaces;
using DemoApp.Domain.Entities;

namespace DemoApp.Application.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CategoryService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync()
        {
            var categories = await _unitOfWork.Categories.GetAllAsync();
            return _mapper.Map<IEnumerable<CategoryDto>>(categories);
        }

        public async Task<CategoryDto?> GetCategoryByIdAsync(int id)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            return _mapper.Map<CategoryDto>(category);
        }

        public async Task<CategoryDto?> GetCategoryByNameAsync(string name)
        {
            var categories = await _unitOfWork.Categories.FindAsync(c => c.CategoryName == name);
            var category = categories.FirstOrDefault();
            return _mapper.Map<CategoryDto>(category);
        }

        public async Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto createCategoryDto)
        {
            // Validate name uniqueness
            var existingCategory = await _unitOfWork.Categories.FindAsync(c => c.CategoryName == createCategoryDto.CategoryName);
            if (existingCategory.Any())
                throw new InvalidOperationException($"Category with name '{createCategoryDto.CategoryName}' already exists.");

            var category = _mapper.Map<Category>(createCategoryDto);
            category.CreatedDate = DateTime.UtcNow;

            await _unitOfWork.Categories.AddAsync(category);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<CategoryDto>(category);
        }

        public async Task<CategoryDto> UpdateCategoryAsync(int id, UpdateCategoryDto updateCategoryDto)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            if (category == null)
                throw new InvalidOperationException($"Category with ID {id} not found.");

            // Validate name uniqueness if changed
            if (updateCategoryDto.CategoryName != category.CategoryName)
            {
                var existingCategory = await _unitOfWork.Categories.FindAsync(c => c.CategoryName == updateCategoryDto.CategoryName);
                if (existingCategory.Any())
                    throw new InvalidOperationException($"Category with name '{updateCategoryDto.CategoryName}' already exists.");
            }

            // Update category properties
            _mapper.Map(updateCategoryDto, category);

            await _unitOfWork.Categories.UpdateAsync(category);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<CategoryDto>(category);
        }

        public async Task<bool> DeleteCategoryAsync(int id)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            if (category == null) return false;

            // Check if category has products
            var hasProducts = await _unitOfWork.Products.FindAsync(p => p.CategoryId == id);
            if (hasProducts.Any())
                throw new InvalidOperationException("Cannot delete category that has associated products.");

            await _unitOfWork.Categories.DeleteAsync(category);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        public async Task<bool> IsCategoryNameUniqueAsync(string name)
        {
            var existingCategory = await _unitOfWork.Categories.FindAsync(c => c.CategoryName == name);
            return !existingCategory.Any();
        }

        public async Task<int> GetCategoryProductCountAsync(int categoryId)
        {
            var products = await _unitOfWork.Products.FindAsync(p => p.CategoryId == categoryId);
            return products.Count();
        }
    }
} 