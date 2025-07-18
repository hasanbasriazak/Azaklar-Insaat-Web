using Microsoft.AspNetCore.Mvc;
using AzaklarApi.Models;
using Microsoft.EntityFrameworkCore;

namespace AzaklarApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly AzaklarDbContext _context;

        public ProjectsController(AzaklarDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetProjects()
        {
            try
            {
                var projects = await _context.Projects
                    .Include(p => p.Features)
                    .Include(p => p.Stats)
                    .Include(p => p.Images)
                    .ToListAsync();

                var projectDtos = projects.Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.Slug,
                    p.Description,
                    p.FullDescription,
                    p.Location,
                    p.Year,
                    p.Category,
                    p.Status,
                    Features = p.Features?.Select(f => f.Feature).ToList(),
                    Stats = p.Stats?.Select(s => new
                    {
                        s.Value,
                        s.Label,
                        s.Unit
                    }).ToList(),
                    Images = p.Images?.OrderByDescending(i => i.IsFeatured).ThenBy(i => i.Id).Select(i => i.ImageUrl).ToList()
                }).ToList();

                return Ok(new { success = true, data = projectDtos });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = "Projeler yüklenirken hata oluştu", details = ex.Message });
            }
        }

        [HttpGet("{slug}")]
        public async Task<IActionResult> GetProjectBySlug(string slug)
        {
            try
            {
                var project = await _context.Projects
                    .Include(p => p.Features)
                    .Include(p => p.Stats)
                    .Include(p => p.Images)
                    .FirstOrDefaultAsync(p => p.Slug == slug);

                if (project == null)
                {
                    return NotFound(new { success = false, error = "Proje bulunamadı" });
                }

                var projectDto = new
                {
                    project.Id,
                    project.Title,
                    project.Slug,
                    project.Description,
                    project.FullDescription,
                    project.Location,
                    project.Year,
                    project.Category,
                    project.Status,
                    Features = project.Features?.Select(f => f.Feature).ToList(),
                    Stats = project.Stats?.Select(s => new
                    {
                        s.Value,
                        s.Label,
                        s.Unit
                    }).ToList(),
                    Images = project.Images?.OrderByDescending(i => i.IsFeatured).ThenBy(i => i.Id).Select(i => i.ImageUrl).ToList()
                };

                return Ok(new { success = true, data = projectDto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = "Proje detayı yüklenirken hata oluştu", details = ex.Message });
            }
        }

        [HttpDelete("images/{imageId}")]
        public async Task<IActionResult> DeleteProjectImage(int imageId)
        {
            try
            {
                var image = await _context.ProjectImages.FindAsync(imageId);
                
                if (image == null)
                {
                    return NotFound(new { success = false, error = "Resim bulunamadı" });
                }

                _context.ProjectImages.Remove(image);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Resim başarıyla silindi" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = "Resim silinirken hata oluştu", details = ex.Message });
            }
        }

        [HttpPost("images/{imageId}/delete")]
        public async Task<IActionResult> DeleteProjectImagePost(int imageId)
        {
            try
            {
                var image = await _context.ProjectImages.FindAsync(imageId);
                
                if (image == null)
                {
                    return NotFound(new { success = false, error = "Resim bulunamadı" });
                }

                _context.ProjectImages.Remove(image);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Resim başarıyla silindi" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = "Resim silinirken hata oluştu", details = ex.Message });
            }
        }

        [HttpPost("images/{imageId}/set-featured")]
        public async Task<IActionResult> SetFeaturedImage(int imageId)
        {
            try
            {
                var image = await _context.ProjectImages.FindAsync(imageId);
                
                if (image == null)
                {
                    return NotFound(new { success = false, error = "Resim bulunamadı" });
                }

                // Aynı projedeki diğer resimlerin vitrin özelliğini kaldır
                var otherImages = await _context.ProjectImages
                    .Where(i => i.ProjectId == image.ProjectId && i.Id != imageId)
                    .ToListAsync();
                
                foreach (var otherImage in otherImages)
                {
                    otherImage.IsFeatured = false;
                }

                // Seçilen resmi vitrin yap
                image.IsFeatured = true;
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Vitrin fotoğrafı başarıyla ayarlandı" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = "Vitrin fotoğrafı ayarlanırken hata oluştu", details = ex.Message });
            }
        }
    }
} 