using GuirarStore.Infrastructure;

namespace GuirarStore
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
            AppConfig config = configuration.GetSection("Project").Get<AppConfig>()!;

            // Подключаем функционал контроллеров
            builder.Services.AddControllersWithViews();

            // Собираем конфигурацию
            WebApplication app = builder.Build();

            // Подключаем использование статичных файлов
            app.UseStaticFiles();

            // Подключаем систему маршрутизации
            app.UseRouting();

            // Регистрируем маршруты
            app.MapControllerRoute("default", "{controller=Home}/{action=Index}/{id?}");

            await app.RunAsync();
        }
    }
}
