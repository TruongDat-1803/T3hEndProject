using System.ComponentModel.DataAnnotations;

namespace DemoApp.Domain.Entities
{
    public class Wishlist
    {
        public int WishlistId { get; set; }
        
        public int UserId { get; set; }
        
        public int ProductId { get; set; }
        
        public DateTime AddedDate { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual Product Product { get; set; } = null!;

        // Helper methods
        public bool IsProductInStock => Product.IsInStock;
        
        public decimal CurrentPrice => Product.FinalPrice;
        
    }
} 