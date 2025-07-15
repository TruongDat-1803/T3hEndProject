using System.ComponentModel.DataAnnotations;

namespace DemoApp.Domain.Entities
{
    public class ProductSpecification
    {
        public int SpecificationId { get; set; }
        
        public int ProductId { get; set; }
        
        [Required]
        [StringLength(50)]
        public string SpecificationType { get; set; } = string.Empty; // 'Display', 'Processor', 'RAM', etc.
        
        [Required]
        [StringLength(100)]
        public string SpecificationName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(500)]
        public string SpecificationValue { get; set; } = string.Empty;
        
        public int DisplayOrder { get; set; } = 0;

        // Navigation properties
        public virtual Product Product { get; set; } = null!;
    }
} 