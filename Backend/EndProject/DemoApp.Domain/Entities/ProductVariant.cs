using System.ComponentModel.DataAnnotations;

namespace DemoApp.Domain.Entities
{
    public class ProductVariant
    {
        public int VariantId { get; set; }
        
        public int ProductId { get; set; }
        
        [Required]
        [StringLength(100)]
        public string PhienBan { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string MauSac { get; set; } = string.Empty;
        
        public decimal PriceAdjustment { get; set; } = 0;
        
        public int StockQuantity { get; set; } = 0;
        
        public bool IsActive { get; set; } = true;
        
        public decimal? PriceDisplay { get; set; }

        // Navigation properties
        public virtual Product Product { get; set; } = null!;

        // Helper methods
        public decimal FinalPrice => PriceDisplay ?? 0;
        
        public bool IsInStock => StockQuantity > 0;
    }
} 