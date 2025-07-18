namespace DemoApp.Application.DTOs.Products
{
    public class ProductSpecificationDto
    {
        public int SpecificationId { get; set; }
        public int ProductId { get; set; }
        public string KichThuocMH { get; set; } = string.Empty;
        public string CongNgheMH { get; set; } = string.Empty;
        public string CameraSauChinh { get; set; } = string.Empty;
        public string? CameraSauPhu { get; set; } = string.Empty;
        public string? CameraTruoc { get; set; } = string.Empty;
        public string? Chipset { get; set; } = string.Empty;
        public string? HeDieuHanh { get; set; } = string.Empty;
        public string? TheSim { get; set; } = string.Empty;
        public string? DoPhanGiaiMH { get; set; } = string.Empty;
        public string? LoaiCPU { get; set; } = string.Empty;
        public string? Pin { get; set; } = string.Empty;
        public int DisplayOrder { get; set; }
    }

    public class CreateProductSpecificationDto
    {
        public string KichThuocMH { get; set; } = string.Empty;
        public string CongNgheMH { get; set; } = string.Empty;
        public string CameraSauChinh { get; set; } = string.Empty;
        public int DisplayOrder { get; set; }
    }
} 