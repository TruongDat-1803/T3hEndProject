namespace DemoApp.Application.DTOs.Products
{
    public class ProductDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public int BrandId { get; set; }
        public string BrandName { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public bool? IsFeatured { get; set; }
        public decimal? Price { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }

        // Navigation properties for related data
        public List<ProductImageDto> Images { get; set; } = new();
        public List<ProductSpecificationDto> Specifications { get; set; } = new();
        public List<ProductVariantDto> Variants { get; set; } = new();
    }
} 