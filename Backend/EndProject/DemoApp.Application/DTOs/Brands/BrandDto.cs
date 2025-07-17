using System.ComponentModel.DataAnnotations;

namespace DemoApp.Application.DTOs.Brands
{
    public class BrandDto
    {
        public int BrandId { get; set; }
        public string BrandName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? LogoUrl { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    public class CreateBrandDto
    {
        [Required]
        [StringLength(100)]
        public string BrandName { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        [StringLength(255)]
        public string? LogoUrl { get; set; }
        
        public bool IsActive { get; set; } = true;
    }

    public class UpdateBrandDto
    {
        [Required]
        [StringLength(100)]
        public string BrandName { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        [StringLength(255)]
        public string? LogoUrl { get; set; }
        
        public bool IsActive { get; set; } = true;
    }
} 