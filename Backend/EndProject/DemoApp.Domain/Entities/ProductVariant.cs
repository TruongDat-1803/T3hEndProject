using System.ComponentModel.DataAnnotations;

namespace DemoApp.Domain.Entities
{
    public class ProductVariant
    {
        public int VariantId { get; set; }
        
        public int ProductId { get; set; }
        
        [Required]
        [StringLength(100)]
        public string VariantName { get; set; } = string.Empty; // 'Color', 'Storage', 'RAM'
        
        [Required]
        [StringLength(100)]
        public string VariantValue { get; set; } = string.Empty; // 'Red', '256GB', '8GB'
        
        public decimal PriceAdjustment { get; set; } = 0;
        
        public int StockQuantity { get; set; } = 0;
        
        public bool IsActive { get; set; } = true;

        // Navigation properties
        public virtual Product Product { get; set; } = null!;

        // Helper methods
        public decimal FinalPrice => Product.Price + PriceAdjustment;
        
        public bool IsInStock => StockQuantity > 0;
    }
} 