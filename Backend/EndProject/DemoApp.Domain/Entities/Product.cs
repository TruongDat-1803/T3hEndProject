using System.ComponentModel.DataAnnotations;

namespace DemoApp.Domain.Entities
{
    public class Product
    {
        public int ProductId { get; set; }
        
        [Required]
        [StringLength(200)]
        public string ProductName { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        
        [StringLength(500)]
        public string? ShortDescription { get; set; }
        
        public int CategoryId { get; set; }
        
        public int BrandId { get; set; }
        
        [Required]
        [StringLength(50)]
        public string SKU { get; set; } = string.Empty;
        
        [Required]
        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }
        
        [Range(0, double.MaxValue)]
        public decimal? OriginalPrice { get; set; }
        
        [Range(0, 100)]
        public decimal DiscountPercentage { get; set; } = 0;
        
        public int StockQuantity { get; set; } = 0;
        
        [Range(0, double.MaxValue)]
        public decimal? Weight { get; set; }
        
        [StringLength(100)]
        public string? Dimensions { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        public bool IsFeatured { get; set; } = false;
        
        public int ViewCount { get; set; } = 0;
        
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedDate { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual Category Category { get; set; } = null!;
        public virtual Brand Brand { get; set; } = null!;
        public virtual ICollection<ProductSpecification> Specifications { get; set; } = new List<ProductSpecification>();
        public virtual ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
        public virtual ICollection<ProductVariant> Variants { get; set; } = new List<ProductVariant>();
        public virtual ICollection<ShoppingCart> ShoppingCartItems { get; set; } = new List<ShoppingCart>();
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public virtual ICollection<ProductReview> Reviews { get; set; } = new List<ProductReview>();
        public virtual ICollection<Wishlist> WishlistItems { get; set; } = new List<Wishlist>();

        // Helper methods
        public decimal FinalPrice => OriginalPrice.HasValue && OriginalPrice.Value > Price 
            ? Price 
            : Price;
        
        public decimal DiscountAmount => OriginalPrice.HasValue 
            ? OriginalPrice.Value - Price 
            : 0;
        
        public bool HasDiscount => OriginalPrice.HasValue && OriginalPrice.Value > Price;
        
        public bool IsInStock => StockQuantity > 0;
        
        public string PrimaryImageUrl => Images.FirstOrDefault(i => i.IsPrimary)?.ImageUrl ?? string.Empty;
        
        public double AverageRating => Reviews.Any() 
            ? Reviews.Where(r => r.IsApproved).Average(r => r.Rating) 
            : 0;
        
        public int ReviewCount => Reviews.Count(r => r.IsApproved);
        
        public void IncrementViewCount()
        {
            ViewCount++;
            UpdatedDate = DateTime.UtcNow;
        }
        
        public bool HasVariant(string variantName, string variantValue)
        {
            return Variants.Any(v => v.VariantName == variantName && v.VariantValue == variantValue);
        }
        
        public decimal GetVariantPrice(string variantName, string variantValue)
        {
            var variant = Variants.FirstOrDefault(v => v.VariantName == variantName && v.VariantValue == variantValue);
            return variant?.PriceAdjustment ?? 0;
        }
    }
} 