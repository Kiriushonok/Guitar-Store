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
            if(!ModelState.IsValid) {
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
    }
}
