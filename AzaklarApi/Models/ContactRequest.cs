using System.ComponentModel.DataAnnotations;

namespace AzaklarApi.Models
{
    public class ContactRequest
    {
        [Required(ErrorMessage = "Ad Soyad zorunludur")]
        [MinLength(2, ErrorMessage = "Ad Soyad en az 2 karakter olmalıdır")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "E-posta zorunludur")]
        [EmailAddress(ErrorMessage = "Geçerli bir e-posta adresi giriniz")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Telefon zorunludur")]
        [Phone(ErrorMessage = "Geçerli bir telefon numarası giriniz")]
        public string Phone { get; set; } = string.Empty;

        [Required(ErrorMessage = "Konu zorunludur")]
        [MinLength(3, ErrorMessage = "Konu en az 3 karakter olmalıdır")]
        public string Subject { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mesaj zorunludur")]
        [MinLength(10, ErrorMessage = "Mesaj en az 10 karakter olmalıdır")]
        public string Message { get; set; } = string.Empty;
    }

    public class KentselDonusumRequest
    {
        [Required(ErrorMessage = "Ad Soyad zorunludur")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "E-posta zorunludur")]
        [EmailAddress(ErrorMessage = "Geçerli bir e-posta adresi giriniz")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Telefon zorunludur")]
        public string Phone { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;
        public string District { get; set; } = string.Empty;
        public string BuildingAge { get; set; } = string.Empty;
        public string BuildingType { get; set; } = string.Empty;
        public string FloorCount { get; set; } = string.Empty;
        public string ApartmentCount { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public List<IFormFile>? Files { get; set; }
    }

    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
        public string? Error { get; set; }
    }
} 