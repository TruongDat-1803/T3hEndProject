using AutoMapper;
using DemoApp.Application.DTOs.Products;
using DemoApp.Application.Interfaces;
using DemoApp.Domain.Interfaces;
using DemoApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DemoApp.Application.Services
{
    public class ProductService : IProductService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ProductService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
        {
            var products = await _unitOfWork.Products.GetAllAsync();
            return _mapper.Map<IEnumerable<ProductDto>>(products);
        }

        public async Task<ProductDto?> GetProductByIdAsync(int id)
        {
            var product = await _unitOfWork.Products.GetByIdAsync(id);
            if (product == null) return null;

            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<ProductDto>(product);
        }

        public async Task<ProductDto?> GetProductBySkuAsync(string sku)
        {
            // This method is obsolete as SKU is no longer part of the Product entity/table.
            throw new NotImplementedException("SKU is no longer supported in the Product entity.");
        }

        public async Task<IEnumerable<ProductDto>> GetProductsByCategoryAsync(int categoryId)
        {
            var products = await _unitOfWork.Products.FindAsync(p => p.CategoryId == categoryId && p.IsActive);
            return _mapper.Map<IEnumerable<ProductDto>>(products);
        }

        public async Task<IEnumerable<ProductDto>> GetFeaturedProductsAsync()
        {
            var products = await _unitOfWork.Products.FindAsync(p => p.IsFeatured && p.IsActive);
            return _mapper.Map<IEnumerable<ProductDto>>(products);
        }

        public async Task<IEnumerable<ProductDto>> SearchProductsAsync(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return Enumerable.Empty<ProductDto>();

            var products = await _unitOfWork.Products.FindAsync(p => 
                p.IsActive == true && 
                (p.ProductName.Contains(searchTerm) || 
                 (p.Description != null && p.Description.Contains(searchTerm))));

            return _mapper.Map<IEnumerable<ProductDto>>(products);
        }

        public async Task<ProductDto> CreateProductAsync(CreateProductDto createProductDto)
        {
            // Validate category exists
            var category = await _unitOfWork.Categories.GetByIdAsync(createProductDto.CategoryId);
            if (category == null)
                throw new InvalidOperationException($"Category with ID {createProductDto.CategoryId} not found.");

            // Validate brand exists
            var brand = await _unitOfWork.Brands.GetByIdAsync(createProductDto.BrandId);
            if (brand == null)
                throw new InvalidOperationException($"Brand with ID {createProductDto.BrandId} not found.");

            var product = _mapper.Map<Product>(createProductDto);
            product.CreatedDate = DateTime.UtcNow;
            product.UpdatedDate = DateTime.UtcNow;

            await _unitOfWork.Products.AddAsync(product);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<ProductDto>(product);
        }

        public async Task<ProductDto> UpdateProductAsync(int id, UpdateProductDto updateProductDto)
        {
            var product = await _unitOfWork.Products.GetByIdAsync(id);
            if (product == null)
                throw new InvalidOperationException($"Product with ID {id} not found.");

            // Validate category exists if changed
            if (updateProductDto.CategoryId != product.CategoryId)
            {
                var category = await _unitOfWork.Categories.GetByIdAsync(updateProductDto.CategoryId);
                if (category == null)
                    throw new InvalidOperationException($"Category with ID {updateProductDto.CategoryId} not found.");
            }

            // Validate brand exists if changed
            if (updateProductDto.BrandId != product.BrandId)
            {
                var brand = await _unitOfWork.Brands.GetByIdAsync(updateProductDto.BrandId);
                if (brand == null)
                    throw new InvalidOperationException($"Brand with ID {updateProductDto.BrandId} not found.");
            }

            // Update product properties
            _mapper.Map(updateProductDto, product);
            product.UpdatedDate = DateTime.UtcNow;

            await _unitOfWork.Products.UpdateAsync(product);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<ProductDto>(product);
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            var product = await _unitOfWork.Products.GetByIdAsync(id);
            if (product == null) return false;

            // Check if product has orders
            var hasOrders = await _unitOfWork.OrderItems.FindAsync(oi => oi.ProductId == id);
            if (hasOrders.Any())
                throw new InvalidOperationException("Cannot delete product that has associated orders.");

            await _unitOfWork.Products.DeleteAsync(product);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        public async Task<bool> UpdateProductStockAsync(int productId, int quantity)
        {
            var product = await _unitOfWork.Products.GetByIdAsync(productId);
            if (product == null) return false;


            product.UpdatedDate = DateTime.UtcNow;

            await _unitOfWork.Products.UpdateAsync(product);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        public async Task<bool> IsProductInStockAsync(int productId, int quantity = 1)
        {
            var product = await _unitOfWork.Products.GetByIdAsync(productId);
            if (product == null) return false;

            return product.StockQuantity >= quantity;
        }
    }
} 