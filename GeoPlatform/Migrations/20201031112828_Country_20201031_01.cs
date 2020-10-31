using Microsoft.EntityFrameworkCore.Migrations;

namespace GeoPlatform.Migrations
{
    public partial class Country_20201031_01 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "Country");

            migrationBuilder.AddColumn<string>(
                name: "NameEN",
                table: "Country",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NameEN",
                table: "Country");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Country",
                type: "text",
                nullable: true);
        }
    }
}
