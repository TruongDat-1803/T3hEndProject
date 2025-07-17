using AutoMapper;
using DemoApp.Application.DTOs.Users;
using DemoApp.Application.Interfaces;
using DemoApp.Domain.Interfaces;
using DemoApp.Domain.Entities;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace DemoApp.Application.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly string _jwtSecret;
        private readonly string _jwtIssuer;
        private readonly string _jwtAudience;
        private readonly IConfiguration _configuration;

        public AuthenticationService(IUnitOfWork unitOfWork, IMapper mapper, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _configuration = configuration;
            _jwtSecret = configuration["Jwt:Key"];
            _jwtIssuer = configuration["Jwt:Issuer"];
            _jwtAudience = configuration["Jwt:Audience"];
        }

        public async Task<string> GenerateJwtTokenAsync(UserDto user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSecret);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim("FirstName", user.FirstName),
                new Claim("LastName", user.LastName)
            };

            // Add roles to claims
            foreach (var role in user.Roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(24),
                Issuer = _jwtIssuer,
                Audience = _jwtAudience,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public async Task<bool> ValidatePasswordAsync(string password, string passwordHash)
        {
            var hashedInput = HashPassword(password);
            return hashedInput == passwordHash;
        }

        public async Task<string> HashPasswordAsync(string password)
        {
            return HashPassword(password);
        }

        public async Task<UserDto?> AuthenticateUserAsync(string username, string password)
        {
            var users = await _unitOfWork.Users.FindAsync(u => u.Username == username && u.IsActive);
            var user = users.FirstOrDefault();

            if (user == null) return null;

            var isValidPassword = await ValidatePasswordAsync(password, user.PasswordHash);
            if (!isValidPassword) return null;

            return _mapper.Map<UserDto>(user);
        }

        public async Task<bool> ValidateTokenAsync(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_jwtSecret);

                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = _jwtIssuer,
                    ValidateAudience = true,
                    ValidAudience = _jwtAudience,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<UserDto?> GetUserFromTokenAsync(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var jwtToken = tokenHandler.ReadJwtToken(token);

                var userIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                    return null;

                var user = await _unitOfWork.Users.GetByIdAsync(userId);
                if (user == null || !user.IsActive)
                    return null;

                return _mapper.Map<UserDto>(user);
            }
            catch
            {
                return null;
            }
        }

        public async Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null) return false;

            var isValidCurrentPassword = await ValidatePasswordAsync(currentPassword, user.PasswordHash);
            if (!isValidCurrentPassword) return false;

            user.PasswordHash = HashPassword(newPassword);
            user.UpdatedDate = DateTime.UtcNow;

            await _unitOfWork.Users.UpdateAsync(user);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        public async Task<bool> ResetPasswordAsync(string email)
        {
            var users = await _unitOfWork.Users.FindAsync(u => u.Email == email && u.IsActive);
            var user = users.FirstOrDefault();

            if (user == null) return false;

            // In a real application, you would:
            // 1. Generate a reset token
            // 2. Send an email with the reset link
            // 3. Store the reset token with expiration

            // For now, we'll just return true
            return true;
        }

        public async Task<bool> ConfirmEmailAsync(string email, string token)
        {
            var users = await _unitOfWork.Users.FindAsync(u => u.Email == email);
            var user = users.FirstOrDefault();

            if (user == null) return false;

            // In a real application, you would:
            // 1. Validate the confirmation token
            // 2. Check if the token is expired
            // 3. Mark the email as confirmed

            user.IsEmailVerified = true;
            user.UpdatedDate = DateTime.UtcNow;

            await _unitOfWork.Users.UpdateAsync(user);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        public async Task<AuthResultDto> LoginAsync(LoginDto dto)
        {
            var user = await AuthenticateUserAsync(dto.Username, dto.Password);
            if (user == null)
            {
                return new AuthResultDto { Success = false, Message = "Invalid username or password." };
            }
            var token = await GenerateJwtTokenAsync(user);
            return new AuthResultDto { Success = true, Token = token, User = user };
        }

        public async Task<AuthResultDto> RegisterAsync(CreateUserDto dto)
        {
            // Check if username or email already exists
            var existingUsers = await _unitOfWork.Users.FindAsync(u => u.Username == dto.Username || u.Email == dto.Email);
            if (existingUsers.Any())
            {
                return new AuthResultDto { Success = false, Message = "Username or email already exists." };
            }
            // Map and create user
            var user = _mapper.Map<User>(dto);
            user.PasswordHash = HashPassword(dto.Password);
            user.IsActive = true;
            user.CreatedDate = DateTime.UtcNow;
            user.UpdatedDate = DateTime.UtcNow;
            await _unitOfWork.Users.AddAsync(user);
            await _unitOfWork.SaveChangesAsync();
            var userDto = _mapper.Map<UserDto>(user);
            var token = await GenerateJwtTokenAsync(userDto);
            return new AuthResultDto { Success = true, Token = token, User = userDto };
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }
    }
} 