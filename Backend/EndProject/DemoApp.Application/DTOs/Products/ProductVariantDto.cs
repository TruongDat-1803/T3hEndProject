namespace DemoApp.Application.DTOs.Products
{
    public class ProductVariantDto
    {
        public int VariantId { get; set; }
        public int ProductId { get; set; }
        public string PhienBan { get; set; } = string.Empty;
        public string MauSac { get; set; } = string.Empty;
        public decimal PriceAdjustment { get; set; }
        public int StockQuantity { get; set; }
        public bool IsActive { get; set; }
        public decimal? PriceDisplay { get; set; }
    }

    public class CreateProductVariantDto
    {
        public string PhienBan { get; set; } = string.Empty;
        public string MauSac { get; set; } = string.Empty;
        public decimal PriceAdjustment { get; set; }
        public int StockQuantity { get; set; }
        public bool IsActive { get; set; } = true;
    }
} 