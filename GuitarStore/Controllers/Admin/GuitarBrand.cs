using GuitarStore.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace GuitarStore.Controllers.Admin
{
    public partial class AdminController
    {
        public async Task<IActionResult> GuitarBrandsEdit(int id)
        {
            GuitarBrand? entity = id == default ? new GuitarBrand() : await _dataManager.GuitarBrands.GetGuitarBrandByIdAsync(id);

            return View(entity);
        }

        [HttpPost]
        public async Task<IActionResult> GuitarBrandsEdit(GuitarBrand entity)
        {
            // Проверка на дубликат по названию (без учёта текущей записи)
            var existing = await _dataManager.GuitarBrands.GetGuitarBrandByNameAsync(entity.BrandName!);
            if (existing != null && existing.Id != entity.Id)
            {
                ModelState.AddModelError("BrandName", "Такой бренд уже существует");
                return View(entity);
            }

            if (!ModelState.IsValid)
            {
                return View(entity);
            }

            await _dataManager.GuitarBrands.SaveGuitarBrandAsync(entity);
            return RedirectToAction("Index");
        }


        [HttpPost]
        public async Task<IActionResult> GuitarBrandsDelete(int id)
        {
            await _dataManager.GuitarBrands.DeleteGuitarBrandAsync(id);

            return RedirectToAction("Index");
        }

        [HttpGet]
        public async Task<JsonResult> CheckBrandName(string brandName, int id = 0)
        {
            var existing = await _dataManager.GuitarBrands.GetGuitarBrandByNameAsync(brandName);
            if (existing != null && existing.Id != id)
            {
                return Json(false); // Бренд уже есть
            }

            return Json(true); // Бренд уникален
        }

    }
}
