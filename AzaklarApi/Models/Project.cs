using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AzaklarApi.Models
{
    public enum ProjectStatus
    {
        DevamEden = 1,
        Tamamlanan = 2,
        Gelecek = 3
    }

    public class Project
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        [RegularExpression(@"^[a-z0-9-]+$", ErrorMessage = "Slug sadece küçük harfler, rakamlar ve tire içerebilir")]
        public string Slug { get; set; } = string.Empty;

        [MaxLength(300)]
        public string Description { get; set; } = string.Empty;

        public string FullDescription { get; set; } = string.Empty;

        [MaxLength(100)]
        public string Location { get; set; } = string.Empty;

        [MaxLength(10)]
        public string Year { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Category { get; set; } = string.Empty;

        public ProjectStatus Status { get; set; } = ProjectStatus.DevamEden;

        public ICollection<ProjectFeature> Features { get; set; } = new List<ProjectFeature>();
        public ICollection<ProjectStat> Stats { get; set; } = new List<ProjectStat>();
        public ICollection<ProjectImage> Images { get; set; } = new List<ProjectImage>();
    }

    public class ProjectFeature
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Feature { get; set; } = string.Empty;
        [ForeignKey("Project")]
        public int ProjectId { get; set; }
        public Project? Project { get; set; }
    }

    public class ProjectStat
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Value { get; set; } = string.Empty;
        [Required]
        public string Label { get; set; } = string.Empty;
        public string Unit { get; set; } = string.Empty;
        [ForeignKey("Project")]
        public int ProjectId { get; set; }
        public Project? Project { get; set; }
    }

    public class ProjectImage
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string ImageUrl { get; set; } = string.Empty;
        [ForeignKey("Project")]
        public int ProjectId { get; set; }
        public Project? Project { get; set; }
        public bool IsFeatured { get; set; } = false;
    }
} 