using System.ComponentModel.DataAnnotations;

namespace DemoApp.Domain.Entities
{
    public class ProductImage
    {
        public int ImageId { get; set; }
        
        public int ProductId { get; set; }
        
        [Required]
        [StringLength(255)]
        public string ImageUrl { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string? AltText { get; set; }
        
        public bool IsPrimary { get; set; } = false;
        
        public int DisplayOrder { get; set; } = 0;
        
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual Product Product { get; set; } = null!;
    }
} 