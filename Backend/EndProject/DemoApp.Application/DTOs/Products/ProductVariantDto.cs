namespace DemoApp.Application.DTOs.Products
{
    public class ProductVariantDto
    {
        public int VariantId { get; set; }
        public int ProductId { get; set; }
        public string VariantName { get; set; } = string.Empty;
        public string VariantValue { get; set; } = string.Empty;
        public decimal PriceAdjustment { get; set; }
        public int StockQuantity { get; set; }
        public bool IsActive { get; set; }
    }

    public class CreateProductVariantDto
    {
        public string VariantName { get; set; } = string.Empty;
        public string VariantValue { get; set; } = string.Empty;
        public decimal PriceAdjustment { get; set; }
        public int StockQuantity { get; set; }
        public bool IsActive { get; set; } = true;
    }
} 