using Microsoft.AspNetCore.Mvc;
using AzaklarApi.Models;
using Microsoft.EntityFrameworkCore;

namespace AzaklarApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AzaklarDbContext _context;
        public UserController(AzaklarDbContext context)
        {
            _context = context;
        }

        public class LoginRequest
        {
            public string Username { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
                return BadRequest(new { success = false, message = "Kullanıcı adı ve şifre zorunludur." });

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username && u.Password == request.Password);
            if (user == null)
                return Unauthorized(new { success = false, message = "Kullanıcı adı veya şifre hatalı." });

            return Ok(new { success = true });
        }
    }
} 