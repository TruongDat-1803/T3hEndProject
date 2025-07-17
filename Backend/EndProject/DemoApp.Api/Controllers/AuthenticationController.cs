using Microsoft.AspNetCore.Mvc;
using DemoApp.Application.Interfaces;
using DemoApp.Application.DTOs.Users;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace DemoApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationService _authService;
        public AuthenticationController(IAuthenticationService authService)
        {
            _authService = authService;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _authService.LoginAsync(dto);
            if (!result.Success) return Unauthorized(result.Message);
            return Ok(result);
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] CreateUserDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _authService.RegisterAsync(dto);
            if (!result.Success) return BadRequest(result.Message);
            return Ok(result);
        }
    }
} 