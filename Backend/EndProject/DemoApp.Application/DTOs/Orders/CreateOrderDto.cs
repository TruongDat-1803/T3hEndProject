namespace DemoApp.Application.DTOs.Orders
{
    public class CreateOrderDto
    {
        public int UserId { get; set; }
        public string? PaymentMethod { get; set; }
        public int ShippingAddressId { get; set; }
        public int BillingAddressId { get; set; }
        public string? Notes { get; set; }
        public List<CreateOrderItemDto> OrderItems { get; set; } = new();
    }

    public class CreateOrderItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public string? VariantDetails { get; set; }
    }
} 