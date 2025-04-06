using GuitarStore.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace GuitarStore.Controllers.Admin
{
    public partial class AdminController
    {
        public async Task<IActionResult> GuitarsEdit(int id)
        {
            Guitar? entity = id == default ? new Guitar() : await _dataManager.Guitars.GetGuitarByIdAsync(id);
            ViewBag.GuitarBrands = await _dataManager.GuitarBrands.GetGuitarBrandsAsync();

            return View(entity);
        }

        [HttpPost]
        public async Task<IActionResult> GuitarsEdit(Guitar entity, List<IFormFile> images)
        {
            if (!ModelState.IsValid) 
            { 
                ViewBag.GuitarBrands = await _dataManager.GuitarBrands.GetGuitarBrandsAsync();
                return View(entity);
            }

            if (images.Any()) 
            {
                foreach(var image in images) {

                    var fileName = Path.GetFileName(image.FileName);
                    await SaveImg(image);
                    
                    var guitarImage = new GuitarImage
                    {
                        FileName = fileName,
                        Guitar = entity
                    };

                    entity.Images?.Add(guitarImage); // добавляем в навигационное свойство

                }

            }

            await _dataManager.Guitars.SaveGuitarAsync(entity);

            return RedirectToAction("Index");
        }

        [HttpPost]
        public async Task<IActionResult> GuitarsDelete(int id)
        {
            await _dataManager.Guitars.DeleteGuitarAsync(id);

            return RedirectToAction("Index");
        }
    }
}
