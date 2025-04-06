using GuitarStore.Domain;
using GuitarStore.Domain.Entities;
using GuitarStore.Infrastructure;
using GuitarStore.Models;
using Microsoft.AspNetCore.Mvc;

namespace GuitarStore.Controllers
{
    public class GuitarsController : Controller
    {
        private readonly DataManager _dataManager;
        public GuitarsController(DataManager dataManager)
        {
            _dataManager = dataManager;
        }

        public async Task<IActionResult> Index()
        {
            IEnumerable<Guitar> guitars = await _dataManager.Guitars.GetGuitarsAsync();
            IEnumerable<GuitarDTO> guitarsDTO = HelperDTO.TransformGuitars(guitars);
            return View(guitarsDTO);
        }

        public async Task<IActionResult> Show(int id)
        {
            Guitar? entity = await _dataManager.Guitars.GetGuitarByIdAsync(id);
            if (entity == null) {
                return NotFound();
            }

            GuitarDTO guitarDTO = HelperDTO.TransformGuitar(entity);

            return View(guitarDTO);
        }
    }
}
