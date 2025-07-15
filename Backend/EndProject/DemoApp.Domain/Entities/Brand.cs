using System.ComponentModel.DataAnnotations;

namespace DemoApp.Domain.Entities
{
    public class Brand
    {
        public int BrandId { get; set; }
        
        [Required]
        [StringLength(100)]
        public string BrandName { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        [StringLength(255)]
        public string? LogoUrl { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual ICollection<Product> Products { get; set; } = new List<Product>();
    }
} 