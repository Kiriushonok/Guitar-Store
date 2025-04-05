    using GuitarStore.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace GuitarStore.Controllers.Admin
{
    [Authorize(Roles = "admin")]
    public partial class AdminController : Controller
    {
        private readonly DataManager _dataManager;
        private readonly IWebHostEnvironment _hostingEnvironment;
        public AdminController(DataManager dataManager, IWebHostEnvironment hostingEnvironment)
        {
            _dataManager = dataManager;
            _hostingEnvironment = hostingEnvironment;
        }

        public async Task<IActionResult> Index() {

            ViewBag.GuitarBrands = await _dataManager.GuitarBrands.GetGuitarBrandsAsync();
            ViewBag.Guitars = await _dataManager.Guitars.GetGuitarsAsync();
            return View();
        }

        public async Task<string> SaveImg(IFormFile img)
        {
            string path = Path.Combine(_hostingEnvironment.WebRootPath, "img/", img.FileName);
            await using FileStream fileStream = new FileStream(path, FileMode.Create);
            await img.CopyToAsync(fileStream);

            return path;
        }
    }
}
