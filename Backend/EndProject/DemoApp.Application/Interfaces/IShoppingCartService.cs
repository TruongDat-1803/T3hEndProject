using DemoApp.Application.DTOs.Orders;

namespace DemoApp.Application.Interfaces
{
    public interface IShoppingCartService
    {
        Task<IEnumerable<ShoppingCartDto>> GetCartItemsAsync(int userId);
        Task<ShoppingCartDto> AddToCartAsync(AddToCartDto dto);
        Task<ShoppingCartDto?> UpdateCartItemAsync(int cartId, int quantity);
        Task<bool> RemoveFromCartAsync(int cartId);
        Task<bool> ClearCartAsync(int userId);
    }
} 