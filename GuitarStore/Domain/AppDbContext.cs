using GuitarStore.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;

namespace GuitarStore.Domain
{
    public class AppDbContext : IdentityDbContext<IdentityUser>
    {
        private readonly IConfiguration _configuration;
        public DbSet<GuitarBrand> GuitarBrands { get; set; } = null!;
        public DbSet<Guitar> Guitars { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.ConfigureWarnings(warnings =>
                warnings.Ignore(RelationalEventId.PendingModelChangesWarning));
        }

        public AppDbContext(DbContextOptions<AppDbContext> options, IConfiguration configuration) : base(options) {

            _configuration = configuration;
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            var adminSettings = _configuration.GetSection("AdminSettings");
            base.OnModelCreating(builder);
            string adminName = adminSettings["UserName"]!;
            string adminEmail = adminSettings["Email"]!;
            string adminPassword = adminSettings["Password"]!;
            string roleAdminId = adminSettings["roleAdminId"]!;
            string userAdminId = adminSettings["userAdminId"]!;

            builder.Entity<IdentityRole>().HasData(new IdentityRole()
            {
                Id = roleAdminId,
                Name = adminName,
                NormalizedName = adminName.ToUpper()
            });

            builder.Entity<IdentityUser>().HasData(new IdentityUser()
            {
                Id = userAdminId,
                UserName = adminName,
                NormalizedUserName = adminName.ToUpper(),
                Email = adminEmail,
                NormalizedEmail = adminEmail,
                EmailConfirmed = true,
                PasswordHash = new PasswordHasher<IdentityUser>().HashPassword(new IdentityUser(), adminPassword),
                SecurityStamp = string.Empty,
                PhoneNumberConfirmed = true
            });

            builder.Entity<IdentityUserRole<string>>().HasData(new IdentityUserRole<string>()
            {
                RoleId = roleAdminId,
                UserId = userAdminId
            });
        }
    }
}
