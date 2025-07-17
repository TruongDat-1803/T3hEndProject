namespace DemoApp.Application.DTOs.Orders
{
    public class UpdateOrderStatusDto
    {
        public string Status { get; set; } = string.Empty;
        public string PaymentStatus { get; set; } = string.Empty;
        public string? Notes { get; set; }
    }
} 