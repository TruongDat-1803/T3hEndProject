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

        public int CategoryId { get; set; }

        public int BrandId { get; set; }

        public int? StockQuantity { get; set; }

        public bool IsActive { get; set; } = true;

        public decimal Price { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? UpdatedDate { get; set; }
        public bool IsFeatured { get; set; } = false;


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
        public decimal FinalPrice => Price;
        public bool IsInStock => StockQuantity > 0;
        
        public string PrimaryImageUrl => Images.FirstOrDefault(i => i.IsPrimary)?.ImageUrl ?? string.Empty;
        
        public double AverageRating => Reviews.Any() 
            ? Reviews.Where(r => r.IsApproved).Average(r => r.Rating) 
            : 0;
        
        public int ReviewCount => Reviews.Count(r => r.IsApproved);
        
        
        public bool HasVariant(string PhienBan, string MauSac)
        {
            return Variants.Any(v => v.PhienBan == PhienBan && v.MauSac == MauSac);
        }
        
        public decimal GetVariantPrice(string PhienBan, string MauSac)
        {
            var variant = Variants.FirstOrDefault(v => v.PhienBan == PhienBan && v.MauSac == MauSac);
            return variant?.PriceAdjustment ?? 0;
        }
    }
} 