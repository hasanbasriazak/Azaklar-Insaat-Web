using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AzaklarApi.Models;

namespace AzaklarApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectController : ControllerBase
    {
        private readonly AzaklarDbContext _context;
        public ProjectController(AzaklarDbContext context)
        {
            _context = context;
        }

        // Tüm projeleri getir
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var projects = await _context.Projects
                .Include(p => p.Features)
                .Include(p => p.Stats)
                .Include(p => p.Images)
                .ToListAsync();
            return Ok(projects);
        }

        // Slug ile proje getir
        [HttpGet("{slug}")]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            var project = await _context.Projects
                .Include(p => p.Features)
                .Include(p => p.Stats)
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Slug == slug);
            if (project == null)
                return NotFound();
            return Ok(project);
        }

        // Proje ekle
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Project project)
        {
            if (await _context.Projects.AnyAsync(p => p.Slug == project.Slug))
                return BadRequest(new { message = "Aynı slug ile proje mevcut." });

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();
            return Ok(project);
        }

        // Proje güncelle
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] Project project)
        {
            var existing = await _context.Projects
                .Include(p => p.Features)
                .Include(p => p.Stats)
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == project.Id);
            if (existing == null)
                return NotFound();

            // Slug kontrolü (kendi slug'ı hariç)
            if (await _context.Projects.AnyAsync(p => p.Slug == project.Slug && p.Id != project.Id))
                return BadRequest(new { message = "Aynı slug ile başka bir proje mevcut." });

            // Ana alanlar
            existing.Title = project.Title;
            existing.Slug = project.Slug;
            existing.Description = project.Description;
            existing.FullDescription = project.FullDescription;
            existing.Location = project.Location;
            existing.Year = project.Year;
            existing.Category = project.Category;
            existing.Status = project.Status;

            // Özellikler
            _context.ProjectFeatures.RemoveRange(existing.Features);
            existing.Features = project.Features;
            // İstatistikler
            _context.ProjectStats.RemoveRange(existing.Stats);
            existing.Stats = project.Stats;
            // Resimler - mevcut resimleri koru, sadece yeni eklenenleri ekle
            // existing.Images = project.Images; // Bu satırı kaldırıyoruz

            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        // Proje sil
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var project = await _context.Projects
                .Include(p => p.Features)
                .Include(p => p.Stats)
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == id);
            if (project == null)
                return NotFound();

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();
            return Ok();
        }

        // Çoklu resim yükleme
        [HttpPost("upload-images")] 
        public async Task<IActionResult> UploadImages([FromForm] int projectId, [FromForm] List<IFormFile> files)
        {
            var project = await _context.Projects.Include(p => p.Images).FirstOrDefaultAsync(p => p.Id == projectId);
            if (project == null)
                return NotFound(new { message = "Proje bulunamadı." });

            var uploadDir = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "projects");
            if (!Directory.Exists(uploadDir))
                Directory.CreateDirectory(uploadDir);

            var imageEntities = new List<ProjectImage>();
            foreach (var file in files)
            {
                if (file.Length > 0)
                {
                    var fileName = $"{Guid.NewGuid()}_{file.FileName}";
                    var filePath = Path.Combine(uploadDir, fileName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                    var relativePath = $"/uploads/projects/{fileName}";
                    var image = new ProjectImage { ImageUrl = relativePath, ProjectId = projectId };
                    imageEntities.Add(image);
                }
            }
            _context.ProjectImages.AddRange(imageEntities);
            await _context.SaveChangesAsync();
            return Ok(imageEntities);
        }

        // Resim silme
        [HttpDelete("images/{imageId}")]
        public async Task<IActionResult> DeleteImage(int imageId)
        {
            var image = await _context.ProjectImages.FirstOrDefaultAsync(i => i.Id == imageId);
            if (image == null)
                return NotFound(new { message = "Resim bulunamadı." });

            // Dosyayı fiziksel olarak sil
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), image.ImageUrl.TrimStart('/'));
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }

            _context.ProjectImages.Remove(image);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Resim başarıyla silindi." });
        }
    }
} 