using System.Threading.Tasks;
using DemoApp.Application.DTOs.Users;

namespace DemoApp.Application.Interfaces
{
    public interface IAuthenticationService
    {
        Task<string> GenerateJwtTokenAsync(UserDto user);
        Task<bool> ValidatePasswordAsync(string password, string passwordHash);
        Task<string> HashPasswordAsync(string password);
        Task<UserDto?> AuthenticateUserAsync(string username, string password);
        Task<bool> ValidateTokenAsync(string token);
        Task<UserDto?> GetUserFromTokenAsync(string token);
        Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword);
        Task<bool> ResetPasswordAsync(string email);
        Task<bool> ConfirmEmailAsync(string email, string token);
        Task<AuthResultDto> LoginAsync(LoginDto dto);
        Task<AuthResultDto> RegisterAsync(CreateUserDto dto);
    }
} 