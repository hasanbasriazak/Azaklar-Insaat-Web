using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AzaklarApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    FullDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Location = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Year = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Category = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Password = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ProjectFeatures",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Feature = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProjectId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectFeatures", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectFeatures_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectImages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProjectId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectImages_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectStats",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Label = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Unit = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProjectId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectStats", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectStats_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Projects",
                columns: new[] { "Id", "Category", "Description", "FullDescription", "Location", "Slug", "Status", "Title", "Year" },
                values: new object[,]
                {
                    { 1, "Konut", "Güngören'in en merkezi konumunda park ve İSPARK kapalı otoparka cepheli modern konut projesi.", "Haznedar Park projesi, Güngören'in en merkezi konumlanmış modern bir yaşam alanıdır. Park manzaralı ve İSPARK kapalı otoparka cepheli bu özel projemiz, 2 blok halinde tasarlanmış olup toplamda 16 daire barındırmaktadır.", "Güngören, İstanbul", "haznedar-park", 2, "Haznedar Park", "2023" },
                    { 2, "Konut", "İstanbul Bağcılar Meydan'da konumlanmış modern yaşam projemiz.", "Bağcılar Meydan Life projesi, İstanbul Bağcılar Meydan'da konumlanmış modern yaşam projemizdir. 12 katlı yapımızda 28 adet 3+1 daire, 2 ticari dükkan ve 3 katlı kapalı otopark bulunmaktadır.", "Bağcılar, İstanbul", "bagcilar-meydan-life", 2, "Bağcılar Meydan Life", "2023" },
                    { 3, "Restorasyon", "Tarihi Fatih semtinde restorasyon projesi.", "Fatih Gülbahçe Konağı, tarihi Fatih semtinde bulunan tarihi bir konak restorasyon projesidir. Geleneksel mimari öğeleri korunarak modern yaşam standartlarına uygun hale getirilmiştir.", "Fatih, İstanbul", "fatih-gulbahce-konagi", 2, "Fatih Gülbahçe Konağı", "2022" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Password", "Username" },
                values: new object[] { 1, "571632", "hasanazak" });

            migrationBuilder.InsertData(
                table: "ProjectFeatures",
                columns: new[] { "Id", "Feature", "ProjectId" },
                values: new object[,]
                {
                    { 1, "Park manzaralı konumlanma", 1 },
                    { 2, "İSPARK kapalı otopark erişimi", 1 },
                    { 3, "2 blok modern tasarım", 1 },
                    { 4, "Merkezi konum avantajı", 1 },
                    { 5, "Modern altyapı sistemleri", 1 },
                    { 6, "Meydan manzaralı konum", 2 },
                    { 7, "3 katlı kapalı otopark", 2 },
                    { 8, "Ticari dükkanlar", 2 },
                    { 9, "Modern yaşam alanları", 2 },
                    { 10, "Tarihi mimari korunması", 3 },
                    { 11, "Modern yaşam standartları", 3 },
                    { 12, "Geleneksel öğeler", 3 }
                });

            migrationBuilder.InsertData(
                table: "ProjectStats",
                columns: new[] { "Id", "Label", "ProjectId", "Unit", "Value" },
                values: new object[,]
                {
                    { 1, "İnşaat Alanı", 1, "m²", "6500" },
                    { 2, "Daire", 1, "", "16" },
                    { 3, "Kat", 1, "", "6" },
                    { 4, "İnşaat Alanı", 2, "m²", "12500" },
                    { 5, "Daire", 2, "", "28" },
                    { 6, "Kat", 2, "", "12" },
                    { 7, "İnşaat Alanı", 3, "m²", "850" },
                    { 8, "Konak", 3, "", "1" },
                    { 9, "Kat", 3, "", "3" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectFeatures_ProjectId",
                table: "ProjectFeatures",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectImages_ProjectId",
                table: "ProjectImages",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStats_ProjectId",
                table: "ProjectStats",
                column: "ProjectId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProjectFeatures");

            migrationBuilder.DropTable(
                name: "ProjectImages");

            migrationBuilder.DropTable(
                name: "ProjectStats");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Projects");
        }
    }
}
