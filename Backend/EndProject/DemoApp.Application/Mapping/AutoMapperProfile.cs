using AutoMapper;
using DemoApp.Application.DTOs.Products;
using DemoApp.Application.DTOs.Users;
using DemoApp.Application.DTOs.Categories;
using DemoApp.Application.DTOs.Brands;
using DemoApp.Application.DTOs.Orders;
using DemoApp.Domain.Entities;

namespace DemoApp.Application.Mapping
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // Product mappings
            CreateMap<Product, ProductDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.CategoryName))
                .ForMember(dest => dest.BrandName, opt => opt.MapFrom(src => src.Brand.BrandName));
            
            CreateMap<CreateProductDto, Product>();
            CreateMap<UpdateProductDto, Product>();
            
            // ProductImage mappings
            CreateMap<ProductImage, ProductImageDto>();
            CreateMap<CreateProductImageDto, ProductImage>();
            
            // ProductSpecification mappings
            CreateMap<ProductSpecification, ProductSpecificationDto>();
            CreateMap<CreateProductSpecificationDto, ProductSpecification>();
            
            // ProductVariant mappings
            CreateMap<ProductVariant, ProductVariantDto>();
            CreateMap<CreateProductVariantDto, ProductVariant>();
            
            // User mappings
            CreateMap<User, UserDto>()
                .ForMember(dest => dest.Roles, opt => opt.MapFrom(src => 
                    src.UserRoleMappings.Select(urm => urm.Role.RoleName).ToList()));
            
            CreateMap<CreateUserDto, User>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.UpdatedDate, opt => opt.MapFrom(src => DateTime.UtcNow));
            
            CreateMap<UpdateUserDto, User>()
                .ForMember(dest => dest.UpdatedDate, opt => opt.MapFrom(src => DateTime.UtcNow));
            
            // Category mappings
            CreateMap<Category, CategoryDto>();
            CreateMap<CreateCategoryDto, Category>();
            CreateMap<UpdateCategoryDto, Category>();
            
            // Brand mappings
            CreateMap<Brand, BrandDto>();
            CreateMap<CreateBrandDto, Brand>();
            CreateMap<UpdateBrandDto, Brand>();
            
            // Order mappings
            CreateMap<Order, OrderDto>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.FullName));
            
            CreateMap<OrderItem, OrderItemDto>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.ProductName))
                .ForMember(dest => dest.SKU, opt => opt.MapFrom(src => src.Product.SKU));

            CreateMap<ShoppingCart, ShoppingCartDto>().ReverseMap();
            CreateMap<AddToCartDto, ShoppingCart>();
        }
    }
} 