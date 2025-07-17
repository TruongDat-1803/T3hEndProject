namespace DemoApp.Application.DTOs.Users
{
    public class AuthResultDto
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public string? Token { get; set; }
        public UserDto? User { get; set; }
    }
} 