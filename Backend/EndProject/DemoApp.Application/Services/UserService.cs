using AutoMapper;
using DemoApp.Application.DTOs.Users;
using DemoApp.Application.Interfaces;
using DemoApp.Domain.Interfaces;
using DemoApp.Domain.Entities;
using System.Security.Cryptography;
using System.Text;

namespace DemoApp.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public UserService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            var users = await _unitOfWork.Users.GetAllAsync();
            return _mapper.Map<IEnumerable<UserDto>>(users);
        }

        public async Task<UserDto?> GetUserByIdAsync(int id)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(id);
            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto?> GetUserByEmailAsync(string email)
        {
            var users = await _unitOfWork.Users.FindAsync(u => u.Email == email);
            var user = users.FirstOrDefault();
            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto?> GetUserByUsernameAsync(string username)
        {
            var users = await _unitOfWork.Users.FindAsync(u => u.Username == username);
            var user = users.FirstOrDefault();
            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto> CreateUserAsync(CreateUserDto createUserDto)
        {
            // Validate email uniqueness
            var existingUserByEmail = await _unitOfWork.Users.FindAsync(u => u.Email == createUserDto.Email);
            if (existingUserByEmail.Any())
                throw new InvalidOperationException($"User with email '{createUserDto.Email}' already exists.");

            // Validate username uniqueness
            var existingUserByUsername = await _unitOfWork.Users.FindAsync(u => u.Username == createUserDto.Username);
            if (existingUserByUsername.Any())
                throw new InvalidOperationException($"User with username '{createUserDto.Username}' already exists.");

            var user = _mapper.Map<User>(createUserDto);
            
            // Hash password
            user.PasswordHash = HashPassword(createUserDto.Password);
            user.CreatedDate = DateTime.UtcNow;
            user.UpdatedDate = DateTime.UtcNow;

            await _unitOfWork.Users.AddAsync(user);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto> UpdateUserAsync(int id, UpdateUserDto updateUserDto)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(id);
            if (user == null)
                throw new InvalidOperationException($"User with ID {id} not found.");

            // Validate email uniqueness if changed
            if (updateUserDto.Email != user.Email)
            {
                var existingUser = await _unitOfWork.Users.FindAsync(u => u.Email == updateUserDto.Email);
                if (existingUser.Any())
                    throw new InvalidOperationException($"User with email '{updateUserDto.Email}' already exists.");
            }

            // Validate username uniqueness if changed
            if (updateUserDto.Username != user.Username)
            {
                var existingUser = await _unitOfWork.Users.FindAsync(u => u.Username == updateUserDto.Username);
                if (existingUser.Any())
                    throw new InvalidOperationException($"User with username '{updateUserDto.Username}' already exists.");
            }

            // Update user properties
            _mapper.Map(updateUserDto, user);
            user.UpdatedDate = DateTime.UtcNow;

            await _unitOfWork.Users.UpdateAsync(user);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<UserDto>(user);
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(id);
            if (user == null) return false;

            // Check if user has orders
            var hasOrders = await _unitOfWork.Orders.FindAsync(o => o.UserId == id);
            if (hasOrders.Any())
                throw new InvalidOperationException("Cannot delete user that has associated orders.");

            await _unitOfWork.Users.DeleteAsync(user);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        public async Task<bool> IsEmailUniqueAsync(string email)
        {
            var existingUser = await _unitOfWork.Users.FindAsync(u => u.Email == email);
            return !existingUser.Any();
        }

        public async Task<bool> IsUsernameUniqueAsync(string username)
        {
            var existingUser = await _unitOfWork.Users.FindAsync(u => u.Username == username);
            return !existingUser.Any();
        }

        public async Task<bool> UpdateUserRolesAsync(int userId, List<string> roles)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null) return false;

            // Get all available roles
            var allRoles = await _unitOfWork.UserRoles.GetAllAsync();
            var roleDictionary = allRoles.ToDictionary(r => r.RoleName, r => r);

            // Remove existing role mappings
            var existingMappings = await _unitOfWork.Users.FindAsync(u => u.UserId == userId);
            // Note: This is a simplified approach. In a real implementation, you'd need to handle UserRoleMapping properly

            // Add new role mappings
            foreach (var roleName in roles)
            {
                if (roleDictionary.ContainsKey(roleName))
                {
                    var role = roleDictionary[roleName];
                    // Create UserRoleMapping
                    var mapping = new UserRoleMapping
                    {
                        UserId = userId,
                        RoleId = role.RoleId
                    };
                    // Note: You'd need to add UserRoleMapping to UnitOfWork
                }
            }

            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<List<string>> GetUserRolesAsync(int userId)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null) return new List<string>();

            // Note: This is a simplified approach. In a real implementation, you'd need to handle UserRoleMapping properly
            return user.UserRoleMappings.Select(urm => urm.Role.RoleName).ToList();
        }

        public async Task<bool> IsUserActiveAsync(int userId)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            return user?.IsActive ?? false;
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }
    }
} 