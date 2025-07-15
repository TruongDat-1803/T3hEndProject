using System.ComponentModel.DataAnnotations;

namespace DemoApp.Domain.Entities
{
    public class ShoppingCart
    {
        public int CartId { get; set; }
        
        public int UserId { get; set; }
        
        public int ProductId { get; set; }
        
        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; } = 1;
        
        [StringLength(500)]
        public string? VariantDetails { get; set; } // JSON string for selected variants
        
        public DateTime AddedDate { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual Product Product { get; set; } = null!;

        // Helper methods
        public decimal TotalPrice => Product.FinalPrice * Quantity;
        
        public bool IsProductInStock => Product.IsInStock && Quantity <= Product.StockQuantity;
        
        public string GetVariantDisplay()
        {
            if (string.IsNullOrEmpty(VariantDetails))
                return string.Empty;
            
            // Parse JSON and return formatted variant string
            // This is a simplified version - in real implementation, you'd parse the JSON
            return VariantDetails;
        }
    }
} 