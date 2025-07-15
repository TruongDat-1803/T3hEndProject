using System.ComponentModel.DataAnnotations;

namespace DemoApp.Domain.Entities
{
    public class OrderItem
    {
        public int OrderItemId { get; set; }
        
        public int OrderId { get; set; }
        
        public int ProductId { get; set; }
        
        [Required]
        [StringLength(200)]
        public string ProductName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(50)]
        public string SKU { get; set; } = string.Empty;
        
        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }
        
        [Required]
        [Range(0, double.MaxValue)]
        public decimal UnitPrice { get; set; }
        
        [Required]
        [Range(0, double.MaxValue)]
        public decimal TotalPrice { get; set; }
        
        [StringLength(500)]
        public string? VariantDetails { get; set; } // JSON string for variant combinations

        // Navigation properties
        public virtual Order Order { get; set; } = null!;
        public virtual Product Product { get; set; } = null!;

        // Helper methods
        public void CalculateTotal()
        {
            TotalPrice = UnitPrice * Quantity;
        }
        
        public string GetVariantDisplay()
        {
            if (string.IsNullOrEmpty(VariantDetails))
                return string.Empty;
            
            // Parse JSON and return formatted variant string
            return VariantDetails;
        }
    }
} 