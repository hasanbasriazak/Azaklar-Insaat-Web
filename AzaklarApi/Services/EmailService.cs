using MailKit.Net.Smtp;
using MimeKit;
using AzaklarApi.Models;

namespace AzaklarApi.Services
{
    public interface IEmailService
    {
        Task<bool> SendContactEmailAsync(ContactRequest request);
        Task<bool> SendKentselDonusumEmailAsync(KentselDonusumRequest request);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<bool> SendContactEmailAsync(ContactRequest request)
        {
            try
            {
                _logger.LogInformation("📧 Starting email send process for: {Email}", request.Email);
                
                // Company email oluştur
                var companyMessage = CreateContactMessage(request, isCompanyEmail: true);
                
                // Customer confirmation email oluştur
                var customerMessage = CreateContactMessage(request, isCompanyEmail: false);

                using var client = new SmtpClient();
                
                // SSL sertifika doğrulamasını geçici olarak devre dışı bırak (production için düzenlenecek)
                client.ServerCertificateValidationCallback = (s, c, h, e) => true;
                
                var smtpHost = _configuration["Smtp:Host"];
                var smtpPort = int.Parse(_configuration["Smtp:Port"] ?? "587");
                var smtpUsername = _configuration["Smtp:Username"];
                
                _logger.LogInformation("🔗 Connecting to SMTP: {Host}:{Port}", smtpHost, smtpPort);
                
                var secureOption = MailKit.Security.SecureSocketOptions.None;
                if (smtpPort == 465)
                {
                    secureOption = MailKit.Security.SecureSocketOptions.SslOnConnect;
                }
                else if (smtpPort == 587)
                {
                    secureOption = MailKit.Security.SecureSocketOptions.StartTls;
                }
                await client.ConnectAsync(smtpHost, smtpPort, secureOption);
                _logger.LogInformation("✅ SMTP connection established");

                _logger.LogInformation("🔐 Authenticating with username: {Username}", smtpUsername);
                await client.AuthenticateAsync(smtpUsername, _configuration["Smtp:Password"]);
                _logger.LogInformation("✅ SMTP authentication successful");

                // Company email gönder
                _logger.LogInformation("📤 Sending company email...");
                await client.SendAsync(companyMessage);
                _logger.LogInformation("✅ Company email sent for contact form: {Email}", request.Email);

                // Customer confirmation email gönder
                _logger.LogInformation("📤 Sending customer confirmation email...");
                await client.SendAsync(customerMessage);
                _logger.LogInformation("✅ Customer confirmation email sent: {Email}", request.Email);

                await client.DisconnectAsync(true);
                _logger.LogInformation("🔌 SMTP connection closed");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Failed to send contact email for: {Email}. Error: {Error}", request.Email, ex.Message);
                return false;
            }
        }

        public async Task<bool> SendKentselDonusumEmailAsync(KentselDonusumRequest request)
        {
            try
            {
                // Company email oluştur
                var companyMessage = CreateKentselDonusumMessage(request, isCompanyEmail: true);
                
                // Customer confirmation email oluştur
                var customerMessage = CreateKentselDonusumMessage(request, isCompanyEmail: false);

                using var client = new SmtpClient();
                
                // SSL sertifika doğrulamasını geçici olarak devre dışı bırak (production için düzenlenecek)
                client.ServerCertificateValidationCallback = (s, c, h, e) => true;
                
                var smtpHost = _configuration["Smtp:Host"];
                var smtpPort = int.Parse(_configuration["Smtp:Port"] ?? "587");
                
                var secureOption = MailKit.Security.SecureSocketOptions.None;
                if (smtpPort == 465)
                {
                    secureOption = MailKit.Security.SecureSocketOptions.SslOnConnect;
                }
                else if (smtpPort == 587)
                {
                    secureOption = MailKit.Security.SecureSocketOptions.StartTls;
                }
                
                await client.ConnectAsync(smtpHost, smtpPort, secureOption);

                await client.AuthenticateAsync(
                    _configuration["Smtp:Username"], 
                    _configuration["Smtp:Password"]
                );

                // Company email gönder
                await client.SendAsync(companyMessage);
                _logger.LogInformation("✅ Company email sent for kentsel donusum: {Email}", request.Email);

                // Customer confirmation email gönder
                await client.SendAsync(customerMessage);
                _logger.LogInformation("✅ Customer confirmation email sent: {Email}", request.Email);

                await client.DisconnectAsync(true);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Failed to send kentsel donusum email for: {Email}", request.Email);
                return false;
            }
        }

        private MimeMessage CreateContactMessage(ContactRequest request, bool isCompanyEmail)
        {
            var message = new MimeMessage();
            var fromEmail = _configuration["Smtp:Username"] ?? "kentsel@azaklaryapi.com";
            var companyEmail = _configuration["Company:Email"] ?? "kentsel@azaklaryapi.com";
            var companyName = _configuration["Company:Name"] ?? "Azaklar Yapı Sanayi Tic. Ltd. Şti.";

            if (isCompanyEmail)
            {
                // Company'ye gönderilecek email
                message.From.Add(new MailboxAddress(companyName, fromEmail));
                message.To.Add(new MailboxAddress(companyName, companyEmail));
                message.ReplyTo.Add(new MailboxAddress(request.Name, request.Email));
                message.Subject = $"İletişim Formu: {request.Subject}";

                message.Body = new TextPart("html")
                {
                    Text = GenerateCompanyContactEmailHtml(request)
                };
            }
            else
            {
                // Customer'a gönderilecek confirmation email
                message.From.Add(new MailboxAddress(companyName, fromEmail));
                message.To.Add(new MailboxAddress(request.Name, request.Email));
                message.Subject = "Mesajınız Alındı - Azaklar İnşaat";

                message.Body = new TextPart("html")
                {
                    Text = GenerateCustomerContactEmailHtml(request)
                };
            }

            return message;
        }

        private MimeMessage CreateKentselDonusumMessage(KentselDonusumRequest request, bool isCompanyEmail)
        {
            var message = new MimeMessage();
            var fromEmail = _configuration["Smtp:Username"] ?? "kentsel@azaklaryapi.com";
            var companyEmail = _configuration["Company:Email"] ?? "kentsel@azaklaryapi.com";
            var companyName = _configuration["Company:Name"] ?? "Azaklar Yapı Sanayi Tic. Ltd. Şti.";

            if (isCompanyEmail)
            {
                // Company'ye gönderilecek email
                message.From.Add(new MailboxAddress(companyName, fromEmail));
                message.To.Add(new MailboxAddress(companyName, companyEmail));
                message.ReplyTo.Add(new MailboxAddress(request.Name, request.Email));
                message.Subject = $"Kentsel Dönüşüm Talebi: {request.Name}";

                var builder = new BodyBuilder();
                builder.HtmlBody = GenerateCompanyKentselEmailHtml(request);

                // Dosyaları ekle
                if (request.Files != null && request.Files.Any())
                {
                    foreach (var file in request.Files)
                    {
                        using var stream = file.OpenReadStream();
                        builder.Attachments.Add(file.FileName, stream);
                    }
                }

                message.Body = builder.ToMessageBody();
            }
            else
            {
                // Customer'a gönderilecek confirmation email
                message.From.Add(new MailboxAddress(companyName, fromEmail));
                message.To.Add(new MailboxAddress(request.Name, request.Email));
                message.Subject = "Kentsel Dönüşüm Talebiniz Alındı - Azaklar İnşaat";

                message.Body = new TextPart("html")
                {
                    Text = GenerateCustomerKentselEmailHtml(request)
                };
            }

            return message;
        }

        private string GenerateCompanyContactEmailHtml(ContactRequest request)
        {
            return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Yeni İletişim Mesajı</title>
    <style>
        body {{ font-family: 'Inter', sans-serif; margin: 0; padding: 20px; background-color: #f8fafc; }}
        .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }}
        .header {{ background: linear-gradient(135deg, #1e3a8a 0%, #f97316 100%); color: white; padding: 30px; text-align: center; }}
        .content {{ padding: 30px; }}
        .info-grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }}
        .info-item {{ background-color: #f8fafc; padding: 15px; border-radius: 6px; border-left: 4px solid #f97316; }}
        .label {{ font-weight: 600; color: #1e3a8a; font-size: 14px; }}
        .value {{ margin-top: 5px; color: #374151; }}
        .message-box {{ background-color: #f8fafc; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #1e3a8a; }}
        .footer {{ background-color: #1e293b; color: white; padding: 20px; text-align: center; font-size: 14px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🏗️ Yeni İletişim Mesajı</h1>
            <p>Website iletişim formundan yeni bir mesaj alındı</p>
        </div>
        <div class='content'>
            <div class='info-grid'>
                <div class='info-item'>
                    <div class='label'>👤 Ad Soyad</div>
                    <div class='value'>{request.Name}</div>
                </div>
                <div class='info-item'>
                    <div class='label'>📧 E-posta</div>
                    <div class='value'>{request.Email}</div>
                </div>
                <div class='info-item'>
                    <div class='label'>📞 Telefon</div>
                    <div class='value'>{request.Phone}</div>
                </div>
                <div class='info-item'>
                    <div class='label'>📋 Konu</div>
                    <div class='value'>{request.Subject}</div>
                </div>
            </div>
            <div class='message-box'>
                <div class='label'>💬 Mesaj İçeriği</div>
                <div class='value' style='margin-top: 10px; line-height: 1.6;'>{request.Message.Replace("\n", "<br>")}</div>
            </div>
        </div>
        <div class='footer'>
            <p>Bu mesaj www.azaklaryapi.com adresinden gönderilmiştir.</p>
            <p>Tarih: {DateTime.Now:dd.MM.yyyy HH:mm}</p>
        </div>
    </div>
</body>
</html>";
        }

        private string GenerateCustomerContactEmailHtml(ContactRequest request)
        {
            return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Mesajınız Alındı</title>
    <style>
        body {{ font-family: 'Inter', sans-serif; margin: 0; padding: 20px; background-color: #f8fafc; }}
        .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }}
        .header {{ background: linear-gradient(135deg, #1e3a8a 0%, #f97316 100%); color: white; padding: 30px; text-align: center; }}
        .content {{ padding: 30px; }}
        .success-message {{ background-color: #dcfce7; color: #166534; padding: 20px; border-radius: 6px; border-left: 4px solid #22c55e; margin: 20px 0; }}
        .contact-info {{ background-color: #f8fafc; padding: 20px; border-radius: 6px; margin: 20px 0; }}
        .footer {{ background-color: #1e293b; color: white; padding: 20px; text-align: center; font-size: 14px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🏗️ Azaklar İnşaat</h1>
            <p>40 Yıllık Deneyim, Güvenilir Çözümler</p>
        </div>
        <div class='content'>
            <div class='success-message'>
                <h2>✅ Mesajınız Başarıyla Alındı!</h2>
                <p>Sayın {request.Name}, mesajınız tarafımıza ulaşmıştır. En kısa sürede size dönüş yapacağız.</p>
            </div>
            <div class='contact-info'>
                <h3>📞 İletişim Bilgilerimiz</h3>
                <p><strong>Telefon:</strong> (212) 555 03-96</p>
                <p><strong>E-posta:</strong> kentsel@azaklaryapi.com</p>
                <p><strong>Adres:</strong> Şevketdağ Cd. No:18/A Güngören / Haznedar / İSTANBUL</p>
                <p><strong>Website:</strong> www.azaklaryapi.com</p>
            </div>
        </div>
        <div class='footer'>
            <p>Bu e-posta otomatik olarak gönderilmiştir.</p>
            <p>© 2024 Azaklar Yapı Sanayi Tic. Ltd. Şti. Tüm hakları saklıdır.</p>
        </div>
    </div>
</body>
</html>";
        }

        private string GenerateCompanyKentselEmailHtml(KentselDonusumRequest request)
        {
            return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <title>Kentsel Dönüşüm Talebi</title>
    <style>
        body {{ font-family: 'Inter', sans-serif; margin: 0; padding: 20px; background-color: #f8fafc; }}
        .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }}
        .header {{ background: linear-gradient(135deg, #1e3a8a 0%, #f97316 100%); color: white; padding: 30px; text-align: center; }}
        .content {{ padding: 30px; }}
        .info-grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }}
        .info-item {{ background-color: #f8fafc; padding: 15px; border-radius: 6px; border-left: 4px solid #f97316; }}
        .label {{ font-weight: 600; color: #1e3a8a; font-size: 14px; }}
        .value {{ margin-top: 5px; color: #374151; }}
        .footer {{ background-color: #1e293b; color: white; padding: 20px; text-align: center; font-size: 14px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🏘️ Kentsel Dönüşüm Talebi</h1>
            <p>Yeni bir kentsel dönüşüm talebi alındı</p>
        </div>
        <div class='content'>
            <div class='info-grid'>
                <div class='info-item'>
                    <div class='label'>👤 Ad Soyad</div>
                    <div class='value'>{request.Name}</div>
                </div>
                <div class='info-item'>
                    <div class='label'>📧 E-posta</div>
                    <div class='value'>{request.Email}</div>
                </div>
                <div class='info-item'>
                    <div class='label'>📞 Telefon</div>
                    <div class='value'>{request.Phone}</div>
                </div>
                <div class='info-item'>
                    <div class='label'>📍 Adres</div>
                    <div class='value'>{request.Address}</div>
                </div>
                <div class='info-item'>
                    <div class='label'>🏙️ İlçe</div>
                    <div class='value'>{request.District}</div>
                </div>
                <div class='info-item'>
                    <div class='label'>📅 Bina Yaşı</div>
                    <div class='value'>{request.BuildingAge}</div>
                </div>
                <div class='info-item'>
                    <div class='label'>🏢 Bina Tipi</div>
                    <div class='value'>{request.BuildingType}</div>
                </div>
                <div class='info-item'>
                    <div class='label'>🔢 Kat Sayısı</div>
                    <div class='value'>{request.FloorCount}</div>
                </div>
                <div class='info-item'>
                    <div class='label'>🏠 Daire Sayısı</div>
                    <div class='value'>{request.ApartmentCount}</div>
                </div>
            </div>
            {(!string.IsNullOrEmpty(request.Notes) ? $@"
            <div style='background-color: #f8fafc; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #1e3a8a;'>
                <div class='label'>📝 Notlar</div>
                <div class='value' style='margin-top: 10px;'>{request.Notes.Replace("\n", "<br>")}</div>
            </div>" : "")}
        </div>
        <div class='footer'>
            <p>Bu talep www.azaklaryapi.com adresinden gönderilmiştir.</p>
            <p>Tarih: {DateTime.Now:dd.MM.yyyy HH:mm}</p>
        </div>
    </div>
</body>
</html>";
        }

        private string GenerateCustomerKentselEmailHtml(KentselDonusumRequest request)
        {
            return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <title>Kentsel Dönüşüm Talebiniz Alındı</title>
    <style>
        body {{ font-family: 'Inter', sans-serif; margin: 0; padding: 20px; background-color: #f8fafc; }}
        .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }}
        .header {{ background: linear-gradient(135deg, #1e3a8a 0%, #f97316 100%); color: white; padding: 30px; text-align: center; }}
        .content {{ padding: 30px; }}
        .success-message {{ background-color: #dcfce7; color: #166534; padding: 20px; border-radius: 6px; border-left: 4px solid #22c55e; margin: 20px 0; }}
        .contact-info {{ background-color: #f8fafc; padding: 20px; border-radius: 6px; margin: 20px 0; }}
        .footer {{ background-color: #1e293b; color: white; padding: 20px; text-align: center; font-size: 14px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🏘️ Azaklar İnşaat</h1>
            <p>Kentsel Dönüşüm Uzmanı</p>
        </div>
        <div class='content'>
            <div class='success-message'>
                <h2>✅ Kentsel Dönüşüm Talebiniz Alındı!</h2>
                <p>Sayın {request.Name}, kentsel dönüşüm talebiniz uzman ekibimize ulaştırılmıştır. 24 saat içinde size dönüş yaparak değerlendirme süreci hakkında bilgi vereceğiz.</p>
            </div>
            <div class='contact-info'>
                <h3>📞 Acil Durumda Bize Ulaşın</h3>
                <p><strong>Telefon:</strong> (212) 555 03-96</p>
                <p><strong>E-posta:</strong> kentsel@azaklaryapi.com</p>
                <p><strong>Adres:</strong> Şevketdağ Cd. No:18/A Güngören / Haznedar / İSTANBUL</p>
            </div>
        </div>
        <div class='footer'>
            <p>Bu e-posta otomatik olarak gönderilmiştir.</p>
            <p>© 2024 Azaklar Yapı Sanayi Tic. Ltd. Şti.</p>
        </div>
    </div>
</body>
</html>";
        }
    }
} 