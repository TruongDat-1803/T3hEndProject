using DemoApp.Application.DTOs.Orders;
using DemoApp.Application.Interfaces;
using DemoApp.Domain.Entities;
using DemoApp.Domain.Interfaces;
using AutoMapper;

namespace DemoApp.Application.Services
{
    public class ShoppingCartService : IShoppingCartService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ShoppingCartService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ShoppingCartDto>> GetCartItemsAsync(int userId)
        {
            var items = await _unitOfWork.ShoppingCart.FindAsync(c => c.UserId == userId);
            return _mapper.Map<IEnumerable<ShoppingCartDto>>(items);
        }

        public async Task<ShoppingCartDto> AddToCartAsync(AddToCartDto dto)
        {
            var cartItem = new ShoppingCart
            {
                UserId = dto.UserId,
                ProductId = dto.ProductId,
                Quantity = dto.Quantity,
                VariantDetails = dto.VariantDetails
            };
            await _unitOfWork.ShoppingCart.AddAsync(cartItem);
            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<ShoppingCartDto>(cartItem);
        }

        public async Task<ShoppingCartDto?> UpdateCartItemAsync(int cartId, int quantity)
        {
            var cartItem = await _unitOfWork.ShoppingCart.GetByIdAsync(cartId);
            if (cartItem == null) return null;
            cartItem.Quantity = quantity;
            await _unitOfWork.ShoppingCart.UpdateAsync(cartItem);
            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<ShoppingCartDto>(cartItem);
        }

        public async Task<bool> RemoveFromCartAsync(int cartId)
        {
            var cartItem = await _unitOfWork.ShoppingCart.GetByIdAsync(cartId);
            if (cartItem == null) return false;
            await _unitOfWork.ShoppingCart.DeleteAsync(cartItem);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ClearCartAsync(int userId)
        {
            var items = await _unitOfWork.ShoppingCart.FindAsync(c => c.UserId == userId);
            foreach (var item in items)
            {
                await _unitOfWork.ShoppingCart.DeleteAsync(item);
            }
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
    }
} 