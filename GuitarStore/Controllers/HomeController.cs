using Microsoft.AspNetCore.Mvc;

namespace GuitarStore.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Contacts()
        {
            return View();
        }

        public IActionResult Advices()
        {
            return View();
        }
    }
}
