using System.ComponentModel.DataAnnotations;

namespace DemoApp.Application.DTOs.Products
{
    public class CreateProductDto
    {
        [Required]
        [StringLength(200)]
        public string ProductName { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        
        [StringLength(500)]
        public string? ShortDescription { get; set; }
        
        [Required]
        public int CategoryId { get; set; }
        
        [Required]
        public int BrandId { get; set; }
        
        [Required]
        [StringLength(50)]
        public string SKU { get; set; } = string.Empty;
        
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
        public decimal Price { get; set; }
        
        [Range(0.01, double.MaxValue)]
        public decimal? OriginalPrice { get; set; }
        
        [Range(0, 100)]
        public decimal DiscountPercentage { get; set; } = 0;
        
        [Range(0, int.MaxValue)]
        public int StockQuantity { get; set; } = 0;
        
        [Range(0, double.MaxValue)]
        public decimal? Weight { get; set; }
        
        [StringLength(100)]
        public string? Dimensions { get; set; }
        
        public bool IsActive { get; set; } = true;
        public bool IsFeatured { get; set; } = false;
        
        // Related data
        public List<CreateProductImageDto> Images { get; set; } = new();
        public List<CreateProductSpecificationDto> Specifications { get; set; } = new();
        public List<CreateProductVariantDto> Variants { get; set; } = new();
    }
} 