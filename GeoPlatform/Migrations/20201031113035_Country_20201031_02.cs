using Microsoft.EntityFrameworkCore.Migrations;

namespace GeoPlatform.Migrations
{
    public partial class Country_20201031_02 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "NamePL",
                table: "Country",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NamePL",
                table: "Country");
        }
    }
}
