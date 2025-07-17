using DemoApp.Application.DTOs.Orders;

namespace DemoApp.Application.Interfaces
{
    public interface IOrderService
    {
        Task<IEnumerable<OrderDto>> GetAllOrdersAsync();
        Task<OrderDto?> GetOrderByIdAsync(int id);
        Task<IEnumerable<OrderDto>> GetOrdersByUserIdAsync(int userId);
        Task<OrderDto> CreateOrderAsync(CreateOrderDto createOrderDto);
        Task<OrderDto> UpdateOrderStatusAsync(int id, UpdateOrderStatusDto updateOrderStatusDto);
        Task<bool> CancelOrderAsync(int id);
        Task<bool> DeleteOrderAsync(int id);
        Task<decimal> CalculateOrderTotalAsync(int orderId);
        Task<bool> ProcessPaymentAsync(int orderId, string paymentMethod);
        Task<IEnumerable<OrderDto>> GetOrdersByStatusAsync(string status);
        Task<int> GetOrderCountByStatusAsync(string status);
    }
} 