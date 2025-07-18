﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AzaklarApi.Migrations
{
    /// <inheritdoc />
    public partial class AddIsFeaturedToProjectImage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsFeatured",
                table: "ProjectImages",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFeatured",
                table: "ProjectImages");
        }
    }
}
