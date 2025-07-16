using AzaklarApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Configure Kestrel server
if (builder.Environment.IsProduction())
{
    builder.WebHost.ConfigureKestrel(options =>
    {
        options.ListenAnyIP(80); // HTTP
        options.ListenAnyIP(443, listenOptions =>
        {
            listenOptions.UseHttps(); // HTTPS
        });
    });
}

// Add services to the container.
builder.Services.AddControllers();

// Email Service
builder.Services.AddScoped<IEmailService, EmailService>();

// CORS Configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AzaklarPolicy", policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173",
            "http://localhost:5174", 
            "http://localhost:3000",
            "https://www.azaklaryapi.com",
            "http://www.azaklaryapi.com",
            "https://azaklaryapi.com",
            "http://azaklaryapi.com",
            "http://94.73.149.144",
            "https://www.azaklarinsaat.com",
            "http://www.azaklarinsaat.com",
            "https://azaklarinsaat.com",
            "http://azaklarinsaat.com",
            "https://www.azaklaryapi.com",
            "http://www.azaklaryapi.com",
            "https://azaklaryapi.com",
            "http://azaklaryapi.com"
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
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
    builder.Logging.AddEventLog();
}

var app = builder.Build();

// Configure the HTTP request pipeline.

// Use CORS
app.UseCors("AzaklarPolicy");

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
    context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Add("X-Frame-Options", "DENY");
    context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");
    context.Response.Headers.Add("Referrer-Policy", "strict-origin-when-cross-origin");
    context.Response.Headers.Add("X-Powered-By", "Azaklar API Server");
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

app.Run();
