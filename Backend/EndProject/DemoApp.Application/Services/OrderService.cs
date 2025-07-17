using AutoMapper;
using DemoApp.Application.DTOs.Orders;
using DemoApp.Application.Interfaces;
using DemoApp.Domain.Interfaces;
using DemoApp.Domain.Entities;
using DemoApp.Domain.Enums;

namespace DemoApp.Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public OrderService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<OrderDto>> GetAllOrdersAsync()
        {
            var orders = await _unitOfWork.Orders.GetAllAsync();
            return _mapper.Map<IEnumerable<OrderDto>>(orders);
        }

        public async Task<OrderDto?> GetOrderByIdAsync(int id)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(id);
            return _mapper.Map<OrderDto>(order);
        }

        public async Task<IEnumerable<OrderDto>> GetOrdersByUserIdAsync(int userId)
        {
            var orders = await _unitOfWork.Orders.FindAsync(o => o.UserId == userId);
            return _mapper.Map<IEnumerable<OrderDto>>(orders);
        }

        public async Task<OrderDto> CreateOrderAsync(CreateOrderDto createOrderDto)
        {
            // Validate user exists
            var user = await _unitOfWork.Users.GetByIdAsync(createOrderDto.UserId);
            if (user == null)
                throw new InvalidOperationException($"User with ID {createOrderDto.UserId} not found.");

            // Validate order items
            if (!createOrderDto.OrderItems.Any())
                throw new InvalidOperationException("Order must have at least one item.");

            // Validate products and check stock
            foreach (var item in createOrderDto.OrderItems)
            {
                var product = await _unitOfWork.Products.GetByIdAsync(item.ProductId);
                if (product == null)
                    throw new InvalidOperationException($"Product with ID {item.ProductId} not found.");

                if (!product.IsActive)
                    throw new InvalidOperationException($"Product {product.ProductName} is not active.");

                if (product.StockQuantity < item.Quantity)
                    throw new InvalidOperationException($"Insufficient stock for product {product.ProductName}.");
            }

            // Create order
            var order = new Order
            {
                UserId = createOrderDto.UserId,
                OrderNumber = GenerateOrderNumber(),
                OrderDate = DateTime.UtcNow,
                OrderStatus = "Pending",
                PaymentStatus = "Pending",
                PaymentMethod = createOrderDto.PaymentMethod,
                ShippingAddressId = createOrderDto.ShippingAddressId,
                BillingAddressId = createOrderDto.BillingAddressId,
                Notes = createOrderDto.Notes,
                CreatedDate = DateTime.UtcNow
            };

            await _unitOfWork.Orders.AddAsync(order);
            await _unitOfWork.SaveChangesAsync();

            // Create order items and calculate totals
            decimal subtotal = 0;
            foreach (var item in createOrderDto.OrderItems)
            {
                var product = await _unitOfWork.Products.GetByIdAsync(item.ProductId);
                var orderItem = new OrderItem
                {
                    OrderId = order.OrderId,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = product!.Price,
                    TotalPrice = product.Price * item.Quantity,
                    VariantDetails = item.VariantDetails
                };

                await _unitOfWork.OrderItems.AddAsync(orderItem);
                subtotal += orderItem.TotalPrice;

                // Update product stock
                product.StockQuantity -= item.Quantity;
                product.UpdatedDate = DateTime.UtcNow;
                await _unitOfWork.Products.UpdateAsync(product);
            }

            // Calculate order totals
            order.SubTotal = subtotal;
            order.TaxAmount = CalculateTax(subtotal);
            order.ShippingAmount = CalculateShipping(subtotal);
            order.DiscountAmount = 0; // Could be calculated based on coupons
            order.TotalAmount = order.SubTotal + order.TaxAmount + order.ShippingAmount - order.DiscountAmount;

            await _unitOfWork.Orders.UpdateAsync(order);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<OrderDto>(order);
        }

        public async Task<OrderDto> UpdateOrderStatusAsync(int id, UpdateOrderStatusDto updateOrderStatusDto)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(id);
            if (order == null)
                throw new InvalidOperationException($"Order with ID {id} not found.");

            order.OrderStatus = updateOrderStatusDto.Status;
            order.PaymentStatus = updateOrderStatusDto.PaymentStatus;
            order.Notes = updateOrderStatusDto.Notes;
            order.UpdatedDate = DateTime.UtcNow;

            await _unitOfWork.Orders.UpdateAsync(order);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<OrderDto>(order);
        }

        public async Task<bool> CancelOrderAsync(int id)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(id);
            if (order == null) return false;

            if (order.OrderStatus == "Delivered" || order.OrderStatus == "Shipped")
                throw new InvalidOperationException("Cannot cancel order that has been shipped or delivered.");

            order.OrderStatus = "Cancelled";
            order.UpdatedDate = DateTime.UtcNow;

            // Restore product stock
            var orderItems = await _unitOfWork.OrderItems.FindAsync(oi => oi.OrderId == id);
            foreach (var item in orderItems)
            {
                var product = await _unitOfWork.Products.GetByIdAsync(item.ProductId);
                if (product != null)
                {
                    product.StockQuantity += item.Quantity;
                    product.UpdatedDate = DateTime.UtcNow;
                    await _unitOfWork.Products.UpdateAsync(product);
                }
            }

            await _unitOfWork.Orders.UpdateAsync(order);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteOrderAsync(int id)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(id);
            if (order == null) return false;

            // Check if order can be deleted
            if (order.OrderStatus != "Cancelled" && order.OrderStatus != "Pending")
                throw new InvalidOperationException("Cannot delete order that is not cancelled or pending.");

            await _unitOfWork.Orders.DeleteAsync(order);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        public async Task<decimal> CalculateOrderTotalAsync(int orderId)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(orderId);
            if (order == null) return 0;

            return order.TotalAmount;
        }

        public async Task<bool> ProcessPaymentAsync(int orderId, string paymentMethod)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(orderId);
            if (order == null) return false;

            // In a real application, you would integrate with a payment gateway
            // For now, we'll simulate successful payment
            order.PaymentStatus = "Paid";
            order.PaymentMethod = paymentMethod;
            await _unitOfWork.Orders.UpdateAsync(order);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<OrderDto>> GetOrdersByStatusAsync(string status)
        {
            var orders = await _unitOfWork.Orders.FindAsync(o => o.OrderStatus == status);
            return _mapper.Map<IEnumerable<OrderDto>>(orders);
        }

        public async Task<int> GetOrderCountByStatusAsync(string status)
        {
            var orders = await _unitOfWork.Orders.FindAsync(o => o.OrderStatus == status);
            return orders.Count();
        }

        private string GenerateOrderNumber()
        {
            return $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}";
        }

        private decimal CalculateTax(decimal subtotal)
        {
            // Simple tax calculation (10%)
            return subtotal * 0.10m;
        }

        private decimal CalculateShipping(decimal subtotal)
        {
            // Free shipping for orders over $100, otherwise $10
            return subtotal >= 100 ? 0 : 10;
        }
    }
} 