namespace DemoApp.Application.DTOs.Orders
{
    public class ShoppingCartDto
    {
        public int CartId { get; set; }
        public int UserId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public string? VariantDetails { get; set; }
    }
} 