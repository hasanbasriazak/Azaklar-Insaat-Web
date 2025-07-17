using Microsoft.EntityFrameworkCore;

namespace AzaklarApi.Models
{
    public class AzaklarDbContext : DbContext
    {
        public AzaklarDbContext(DbContextOptions<AzaklarDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<ProjectFeature> ProjectFeatures { get; set; }
        public DbSet<ProjectStat> ProjectStats { get; set; }
        public DbSet<ProjectImage> ProjectImages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Admin user seed data
            modelBuilder.Entity<User>().HasData(new User
            {
                Id = 1,
                Username = "hasanazak",
                Password = "571632"
            });

            // Sample projects seed data
            modelBuilder.Entity<Project>().HasData(
                new Project
                {
                    Id = 1,
                    Title = "Haznedar Park",
                    Slug = "haznedar-park",
                    Description = "Güngören'in en merkezi konumunda park ve İSPARK kapalı otoparka cepheli modern konut projesi.",
                    FullDescription = "Haznedar Park projesi, Güngören'in en merkezi konumlanmış modern bir yaşam alanıdır. Park manzaralı ve İSPARK kapalı otoparka cepheli bu özel projemiz, 2 blok halinde tasarlanmış olup toplamda 16 daire barındırmaktadır.",
                    Location = "Güngören, İstanbul",
                    Year = "2023",
                    Category = "Konut",
                    Status = ProjectStatus.Tamamlanan
                },
                new Project
                {
                    Id = 2,
                    Title = "Bağcılar Meydan Life",
                    Slug = "bagcilar-meydan-life",
                    Description = "İstanbul Bağcılar Meydan'da konumlanmış modern yaşam projemiz.",
                    FullDescription = "Bağcılar Meydan Life projesi, İstanbul Bağcılar Meydan'da konumlanmış modern yaşam projemizdir. 12 katlı yapımızda 28 adet 3+1 daire, 2 ticari dükkan ve 3 katlı kapalı otopark bulunmaktadır.",
                    Location = "Bağcılar, İstanbul",
                    Year = "2023",
                    Category = "Konut",
                    Status = ProjectStatus.Tamamlanan
                },
                new Project
                {
                    Id = 3,
                    Title = "Fatih Gülbahçe Konağı",
                    Slug = "fatih-gulbahce-konagi",
                    Description = "Tarihi Fatih semtinde restorasyon projesi.",
                    FullDescription = "Fatih Gülbahçe Konağı, tarihi Fatih semtinde bulunan tarihi bir konak restorasyon projesidir. Geleneksel mimari öğeleri korunarak modern yaşam standartlarına uygun hale getirilmiştir.",
                    Location = "Fatih, İstanbul",
                    Year = "2022",
                    Category = "Restorasyon",
                    Status = ProjectStatus.Tamamlanan
                }
            );

            // Project features seed data
            modelBuilder.Entity<ProjectFeature>().HasData(
                new ProjectFeature { Id = 1, Feature = "Park manzaralı konumlanma", ProjectId = 1 },
                new ProjectFeature { Id = 2, Feature = "İSPARK kapalı otopark erişimi", ProjectId = 1 },
                new ProjectFeature { Id = 3, Feature = "2 blok modern tasarım", ProjectId = 1 },
                new ProjectFeature { Id = 4, Feature = "Merkezi konum avantajı", ProjectId = 1 },
                new ProjectFeature { Id = 5, Feature = "Modern altyapı sistemleri", ProjectId = 1 },
                new ProjectFeature { Id = 6, Feature = "Meydan manzaralı konum", ProjectId = 2 },
                new ProjectFeature { Id = 7, Feature = "3 katlı kapalı otopark", ProjectId = 2 },
                new ProjectFeature { Id = 8, Feature = "Ticari dükkanlar", ProjectId = 2 },
                new ProjectFeature { Id = 9, Feature = "Modern yaşam alanları", ProjectId = 2 },
                new ProjectFeature { Id = 10, Feature = "Tarihi mimari korunması", ProjectId = 3 },
                new ProjectFeature { Id = 11, Feature = "Modern yaşam standartları", ProjectId = 3 },
                new ProjectFeature { Id = 12, Feature = "Geleneksel öğeler", ProjectId = 3 }
            );

            // Project stats seed data
            modelBuilder.Entity<ProjectStat>().HasData(
                new ProjectStat { Id = 1, Value = "6500", Label = "İnşaat Alanı", Unit = "m²", ProjectId = 1 },
                new ProjectStat { Id = 2, Value = "16", Label = "Daire", Unit = "", ProjectId = 1 },
                new ProjectStat { Id = 3, Value = "6", Label = "Kat", Unit = "", ProjectId = 1 },
                new ProjectStat { Id = 4, Value = "12500", Label = "İnşaat Alanı", Unit = "m²", ProjectId = 2 },
                new ProjectStat { Id = 5, Value = "28", Label = "Daire", Unit = "", ProjectId = 2 },
                new ProjectStat { Id = 6, Value = "12", Label = "Kat", Unit = "", ProjectId = 2 },
                new ProjectStat { Id = 7, Value = "850", Label = "İnşaat Alanı", Unit = "m²", ProjectId = 3 },
                new ProjectStat { Id = 8, Value = "1", Label = "Konak", Unit = "", ProjectId = 3 },
                new ProjectStat { Id = 9, Value = "3", Label = "Kat", Unit = "", ProjectId = 3 }
            );
        }
    }
} 