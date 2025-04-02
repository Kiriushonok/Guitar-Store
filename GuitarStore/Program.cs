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

            // Подключаем в конфигурацию файл appsettings.json
            IConfigurationBuilder configurationBuilder = new ConfigurationBuilder()
                .SetBasePath(builder.Environment.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddEnvironmentVariables();

            // Оборачиваем секцию Project в объектную форму для удобства
            IConfiguration configuration = configurationBuilder.Build();
            builder.Services.AddSingleton(configuration);
            AppConfig config = configuration.GetSection("Project").Get<AppConfig>()!;

            // Подключаем контекст БД
            builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer(config.Database.ConnectionString)
                .ConfigureWarnings(warnings => warnings.Ignore(RelationalEventId.PendingModelChangesWarning)));

            builder.Services.AddTransient<IGuitarRepository, EFGuitarRepository>();
            builder.Services.AddTransient<IGuitarBrandRepository, EFGuitarBrandRepository>();
            builder.Services.AddTransient<DataManager>();

            // Настраиваем Identity систему
            builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
            {
                options.User.RequireUniqueEmail = true;
                options.Password.RequiredLength = 6;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireDigit = false;
            }).AddEntityFrameworkStores<AppDbContext>().AddDefaultTokenProviders();

            // Настраиваем Auth cookie
            builder.Services.ConfigureApplicationCookie(options =>
            {
                options.Cookie.Name = "GuitarStoteAuth";
                options.Cookie.HttpOnly = true;
                options.LoginPath = "/admin/login";
                options.AccessDeniedPath = "/admin/accessdenied";
                options.SlidingExpiration = true;
            });

            // Подключаем функционал контроллеров
            builder.Services.AddControllersWithViews();

            // Собираем конфигурацию
            WebApplication app = builder.Build();

            // Подключаем использование статичных файлов
            app.UseStaticFiles();

            // Подключаем систему маршрутизации
            app.UseRouting();

            // Подключаем аутентификацию и авторизацию
            app.UseCookiePolicy();
            app.UseAuthentication();
            app.UseAuthorization();

            // Регистрируем маршруты
            app.MapControllerRoute("default", "{controller=Home}/{action=Index}/{id?}");

            await app.RunAsync();
        }
    }
}
