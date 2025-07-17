namespace DemoApp.Application.DTOs.Products
{
    public class ProductSpecificationDto
    {
        public int SpecificationId { get; set; }
        public int ProductId { get; set; }
        public string SpecificationType { get; set; } = string.Empty;
        public string SpecificationName { get; set; } = string.Empty;
        public string SpecificationValue { get; set; } = string.Empty;
        public int DisplayOrder { get; set; }
    }

    public class CreateProductSpecificationDto
    {
        public string SpecificationType { get; set; } = string.Empty;
        public string SpecificationName { get; set; } = string.Empty;
        public string SpecificationValue { get; set; } = string.Empty;
        public int DisplayOrder { get; set; }
    }
} 