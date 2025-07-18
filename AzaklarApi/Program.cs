using AzaklarApi.Services;
using AzaklarApi.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Configure Kestrel server
if (builder.Environment.IsProduction())
{
    builder.WebHost.ConfigureKestrel(options =>
    {
        // Production'da port konfigürasyonunu daha esnek yap
        var port = Environment.GetEnvironmentVariable("ASPNETCORE_PORT") ?? "80";
        var httpsPort = Environment.GetEnvironmentVariable("ASPNETCORE_HTTPS_PORT") ?? "443";
        
        options.ListenAnyIP(int.Parse(port)); // HTTP
        options.ListenAnyIP(int.Parse(httpsPort), listenOptions =>
        {
            listenOptions.UseHttps(); // HTTPS
        });
    });
}

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true;
    });

// EF Core MSSQL
builder.Services.AddDbContext<AzaklarDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Email Service
builder.Services.AddScoped<IEmailService, EmailService>();

// CORS Configuration - Allow all origins for now
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

// Health Checks
builder.Services.AddHealthChecks();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Azaklar İnşaat API",
        Version = "v1",
        Description = "Email ve form işlemleri için API servisi",
        Contact = new Microsoft.OpenApi.Models.OpenApiContact
        {
            Name = "Azaklar Yapı Sanayi Tic. Ltd. Şti.",
            Email = "kentsel@azaklaryapi.com",
            Url = new Uri("https://www.azaklaryapi.com")
        }
    });
});

// Logging configuration
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
if (builder.Environment.IsProduction())
{
#if WINDOWS
    builder.Logging.AddEventLog();
#endif
}

var app = builder.Build();

// Configure the HTTP request pipeline.

// Use CORS - en üstte olmalı
app.UseCors("AllowAll");

// Create uploads directory if it doesn't exist
var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
if (!Directory.Exists(uploadsDir))
{
    Directory.CreateDirectory(uploadsDir);
    app.Logger.LogInformation("📁 Uploads directory created: {Path}", uploadsDir);
}

// Static files for uploads
app.UseStaticFiles();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(uploadsDir),
    RequestPath = "/uploads"
});

// Swagger - only in development or when explicitly enabled
if (app.Environment.IsDevelopment() || app.Configuration.GetValue<bool>("EnableSwagger"))
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Azaklar İnşaat API v1");
        c.RoutePrefix = "swagger";
    });
}

// Security headers middleware
app.Use(async (context, next) =>
{
    context.Response.Headers["X-Content-Type-Options"] = "nosniff";
    context.Response.Headers["X-Frame-Options"] = "DENY";
    context.Response.Headers["X-XSS-Protection"] = "1; mode=block";
    context.Response.Headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
    context.Response.Headers["X-Powered-By"] = "Azaklar API Server";
    await next();
});

// Request logging middleware
app.Use(async (context, next) =>
{
    var logger = app.Logger;
    var timestamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
    var method = context.Request.Method;
    var path = context.Request.Path;
    var ip = context.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
    
    logger.LogInformation("📝 {Timestamp} | {Method} {Path} | IP: {IP}", timestamp, method, path, ip);
    await next();
});

// Global error handling middleware
app.Use(async (context, next) =>
{
    try
    {
        await next();
    }
    catch (Exception ex)
    {
        var logger = app.Logger;
        logger.LogError(ex, "❌ Unhandled exception: {Method} {Path}", context.Request.Method, context.Request.Path);
        
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        
        var errorResponse = new
        {
            success = false,
            message = "Sunucu hatası oluştu",
            error = app.Environment.IsDevelopment() ? ex.Message : "Internal server error",
            timestamp = DateTime.Now
        };
        
        await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(errorResponse));
    }
});

// Remove HTTPS redirection for production Windows hosting compatibility
// app.UseHttpsRedirection();

app.UseAuthorization();

// Health check endpoint
app.MapHealthChecks("/health");

app.MapControllers();

// Root endpoint
app.MapGet("/", () => new
{
    name = "Azaklar İnşaat API",
    version = "1.0.0",
    description = "Email ve form işlemleri için API servisi",
    timestamp = DateTime.Now,
    environment = app.Environment.EnvironmentName,
    endpoints = new
    {
        health = "/health",
        swagger = "/swagger",
        email = "/api/email"
    }
});

// Startup log
app.Logger.LogInformation("🚀 Azaklar İnşaat API Server başlatılıyor");
app.Logger.LogInformation("🌍 Environment: {Environment}", app.Environment.EnvironmentName);
app.Logger.LogInformation("📧 SMTP: {SmtpHost}", app.Configuration["Smtp:Host"] ?? "mail.kurumsaleposta.com");
app.Logger.LogInformation("✉️  Mail: {CompanyEmail}", app.Configuration["Company:Email"] ?? "kentsel@azaklaryapi.com");
app.Logger.LogInformation("🔧 Port: {Port}", Environment.GetEnvironmentVariable("ASPNETCORE_PORT") ?? "80");
app.Logger.LogInformation("🔒 HTTPS Port: {HttpsPort}", Environment.GetEnvironmentVariable("ASPNETCORE_HTTPS_PORT") ?? "443");
app.Logger.LogInformation("📁 Content Root: {ContentRoot}", app.Environment.ContentRootPath);
app.Logger.LogInformation("🌐 Web Root: {WebRoot}", app.Environment.WebRootPath);

try
{
    app.Logger.LogInformation("✅ API Server başarıyla başlatıldı!");
}
catch (Exception ex)
{
    app.Logger.LogError(ex, "❌ API Server başlatılırken hata oluştu!");
    throw;
}

app.Run();
