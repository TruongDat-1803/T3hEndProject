using System.ComponentModel.DataAnnotations;

namespace DemoApp.Domain.Entities
{
    public class ProductSpecification
    {
        public int SpecificationId { get; set; }
        
        public int ProductId { get; set; }
        
        [Required]
        [StringLength(50)]
        public string KichThuocMH { get; set; } = string.Empty; // 'Display', 'Processor', 'RAM', etc.
        
        [Required]
        [StringLength(100)]
        public string CongNgheMH { get; set; } = string.Empty;
        
        [Required]
        [StringLength(500)]
        public string CameraSauChinh { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string? CameraSauPhu { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string? CameraTruoc { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string? Chipset { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string? HeDieuHanh { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string? TheSim { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string? DoPhanGiaiMH { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string? LoaiCPU { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string? Pin { get; set; } = string.Empty;
        
        public int DisplayOrder { get; set; } = 0;

        // Navigation properties
        public virtual Product Product { get; set; } = null!;
    }
} 