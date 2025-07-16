using Microsoft.AspNetCore.Mvc;
using AzaklarApi.Models;
using AzaklarApi.Services;

namespace AzaklarApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly ILogger<EmailController> _logger;

        public EmailController(IEmailService emailService, ILogger<EmailController> logger)
        {
            _emailService = emailService;
            _logger = logger;
        }

        [HttpPost("send-contact-email")]
        public async Task<ActionResult<ApiResponse<object>>> SendContactEmail([FromBody] ContactRequest request)
        {
            _logger.LogInformation("🔍 İletişim formu endpoint çağrıldı: {Email}", request.Email);

            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Where(x => x.Value?.Errors.Count > 0)
                    .SelectMany(x => x.Value.Errors)
                    .Select(x => x.ErrorMessage)
                    .ToList();

                _logger.LogWarning("❌ Validation error for contact form: {Errors}", string.Join(", ", errors));

                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Geçersiz veri",
                    Error = string.Join(", ", errors)
                });
            }

            try
            {
                var result = await _emailService.SendContactEmailAsync(request);

                if (result)
                {
                    _logger.LogInformation("✅ İletişim formu maili başarıyla gönderildi: {Email}", request.Email);
                    
                    return Ok(new ApiResponse<object>
                    {
                        Success = true,
                        Message = "Mesajınız başarıyla gönderildi",
                        Data = new { 
                            from = request.Email,
                            subject = request.Subject,
                            timestamp = DateTime.Now
                        }
                    });
                }
                else
                {
                    _logger.LogError("❌ İletişim formu maili gönderilemedi: {Email}", request.Email);
                    
                    return StatusCode(500, new ApiResponse<object>
                    {
                        Success = false,
                        Message = "E-mail gönderilemedi",
                        Error = "SMTP server error"
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ İletişim formu mail hatası: {Email}", request.Email);
                
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "E-mail gönderilemedi",
                    Error = ex.Message
                });
            }
        }

        [HttpPost("send-kentsel-email")]
        public async Task<ActionResult<ApiResponse<object>>> SendKentselDonusumEmail([FromForm] KentselDonusumRequest request)
        {
            _logger.LogInformation("🔍 Kentsel dönüşüm formu endpoint çağrıldı: {Email}", request.Email);

            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Where(x => x.Value?.Errors.Count > 0)
                    .SelectMany(x => x.Value.Errors)
                    .Select(x => x.ErrorMessage)
                    .ToList();

                _logger.LogWarning("❌ Validation error for kentsel donusum form: {Errors}", string.Join(", ", errors));

                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Geçersiz veri",
                    Error = string.Join(", ", errors)
                });
            }

            try
            {
                // File validation
                if (request.Files != null && request.Files.Any())
                {
                    var maxFileSize = 10 * 1024 * 1024; // 10MB
                    var allowedExtensions = new[] { ".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx" };

                    foreach (var file in request.Files)
                    {
                        if (file.Length > maxFileSize)
                        {
                            return BadRequest(new ApiResponse<object>
                            {
                                Success = false,
                                Message = $"Dosya boyutu çok büyük: {file.FileName}. Maksimum 10MB olmalıdır.",
                                Error = "File size exceeded"
                            });
                        }

                        var extension = Path.GetExtension(file.FileName).ToLower();
                        if (!allowedExtensions.Contains(extension))
                        {
                            return BadRequest(new ApiResponse<object>
                            {
                                Success = false,
                                Message = $"Desteklenmeyen dosya türü: {file.FileName}. İzin verilen türler: PDF, JPG, PNG, DOC, DOCX",
                                Error = "Unsupported file type"
                            });
                        }
                    }
                }

                var result = await _emailService.SendKentselDonusumEmailAsync(request);

                if (result)
                {
                    var referenceId = $"KD{DateTimeOffset.Now.ToUnixTimeMilliseconds()}";
                    var filesCount = request.Files?.Count ?? 0;
                    var totalSize = request.Files?.Sum(f => f.Length) ?? 0;

                    _logger.LogInformation("✅ Kentsel dönüşüm maili başarıyla gönderildi: {Email}, Files: {FilesCount}", 
                        request.Email, filesCount);
                    
                    return Ok(new ApiResponse<object>
                    {
                        Success = true,
                        Message = "Kentsel dönüşüm talebiniz başarıyla gönderildi",
                        Data = new { 
                            referenceId,
                            customerEmail = request.Email,
                            filesCount,
                            totalSize = $"{totalSize / (1024.0 * 1024.0):F2}MB",
                            timestamp = DateTime.Now
                        }
                    });
                }
                else
                {
                    _logger.LogError("❌ Kentsel dönüşüm maili gönderilemedi: {Email}", request.Email);
                    
                    return StatusCode(500, new ApiResponse<object>
                    {
                        Success = false,
                        Message = "E-mail gönderilemedi",
                        Error = "SMTP server error"
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Kentsel dönüşüm mail hatası: {Email}", request.Email);
                
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "E-mail gönderilemedi",
                    Error = ex.Message
                });
            }
        }

        [HttpGet("health")]
        public ActionResult<ApiResponse<object>> HealthCheck()
        {
            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Azaklar İnşaat Email API is running",
                Data = new
                {
                    status = "OK",
                    timestamp = DateTime.Now,
                    version = "1.0.0",
                    environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production",
                    uptime = Environment.TickCount64 / 1000.0,
                    endpoints = new[]
                    {
                        "/api/email/health",
                        "/api/email/send-contact-email",
                        "/api/email/send-kentsel-email"
                    }
                }
            });
        }
    }
} 