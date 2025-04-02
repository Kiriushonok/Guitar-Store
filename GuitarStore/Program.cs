using GuitarStore.Domain;
using GuitarStore.Domain.Repositories.Abstract;
using GuitarStore.Domain.Repositories.EntityFramework;
using GuitarStore.Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.DependencyInjection;

namespace GuitarStore
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

            // ���������� � ������������ ���� appsettings.json
            IConfigurationBuilder configurationBuilder = new ConfigurationBuilder()
                .SetBasePath(builder.Environment.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddEnvironmentVariables();

            // ����������� ������ Project � ��������� ����� ��� ��������
            IConfiguration configuration = configurationBuilder.Build();
            builder.Services.AddSingleton(configuration);
            AppConfig config = configuration.GetSection("Project").Get<AppConfig>()!;

            // ���������� �������� ��
            builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer(config.Database.ConnectionString)
                .ConfigureWarnings(warnings => warnings.Ignore(RelationalEventId.PendingModelChangesWarning)));

            builder.Services.AddTransient<IGuitarRepository, EFGuitarRepository>();
            builder.Services.AddTransient<IGuitarBrandRepository, EFGuitarBrandRepository>();
            builder.Services.AddTransient<DataManager>();

            // ����������� Identity �������
            builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
            {
                options.User.RequireUniqueEmail = true;
                options.Password.RequiredLength = 6;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireDigit = false;
            }).AddEntityFrameworkStores<AppDbContext>().AddDefaultTokenProviders();

            // ����������� Auth cookie
            builder.Services.ConfigureApplicationCookie(options =>
            {
                options.Cookie.Name = "GuitarStoteAuth";
                options.Cookie.HttpOnly = true;
                options.LoginPath = "/admin/login";
                options.AccessDeniedPath = "/admin/accessdenied";
                options.SlidingExpiration = true;
            });

            // ���������� ���������� ������������
            builder.Services.AddControllersWithViews();

            // �������� ������������
            WebApplication app = builder.Build();

            // ���������� ������������� ��������� ������
            app.UseStaticFiles();

            // ���������� ������� �������������
            app.UseRouting();

            // ���������� �������������� � �����������
            app.UseCookiePolicy();
            app.UseAuthentication();
            app.UseAuthorization();

            // ������������ ��������
            app.MapControllerRoute("default", "{controller=Home}/{action=Index}/{id?}");

            await app.RunAsync();
        }
    }
}
