using GuitarStore.Domain;
using GuitarStore.Domain.Entities;
using GuitarStore.Domain.Enums;
using GuitarStore.Infrastructure;
using GuitarStore.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
            var guitars = await _dataManager.Guitars.GetGuitarsAsync();
            var guitarsDTO = HelperDTO.TransformGuitars(guitars);

            var allGuitarsQuery = _dataManager.Guitars.GetQueryable();
            var minPrice = await allGuitarsQuery.MinAsync(g => (decimal?)g.GuitarPrice) ?? 0;
            var maxPrice = await allGuitarsQuery.MaxAsync(g => (decimal?)g.GuitarPrice) ?? 0;

            ViewBag.Brands = await _dataManager.GuitarBrands.GetGuitarBrandsAsync();
            ViewBag.MinPrice = (int)minPrice;
            ViewBag.MaxPrice = (int)maxPrice;

            return View(guitarsDTO);
        }


        public async Task<IActionResult> Show(int id)
        {
            Guitar? entity = await _dataManager.Guitars.GetGuitarByIdAsync(id);
            if (entity == null)
            {
                return NotFound();
            }

            GuitarDTO guitarDTO = HelperDTO.TransformGuitar(entity);

            return View(guitarDTO);
        }

        [HttpGet]
        public async Task<IActionResult> GetFilteredGuitars(string? search, string? type, string? brand, int? priceMin, int? priceMax, int page = 1, int pageSize = 6)
        {
            var query = _dataManager.Guitars.GetQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.ToLower();
                query = query.Where(g =>
                    g.GuitarModel!.ToLower().Contains(search) ||
                    g.GuitarBrand!.BrandName!.ToLower().Contains(search));
            }

            if (!string.IsNullOrEmpty(type) && Enum.TryParse<GuitarTypeEnum>(type, out var parsedType))
            {
                query = query.Where(g => g.GuitarType == parsedType);
            }

            if (!string.IsNullOrEmpty(brand))
            {
                brand = brand.ToLower();
                query = query.Where(g => g.GuitarBrand!.BrandName!.ToLower() == brand);
            }

            if (priceMin.HasValue)
            {
                query = query.Where(g => g.GuitarPrice >= priceMin.Value);
            }

            if (priceMax.HasValue)
            {
                query = query.Where(g => g.GuitarPrice <= priceMax.Value);
            }

            int totalItems = await query.CountAsync();
            int totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var guitars = await query
                .OrderBy(g => g.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Include(g => g.GuitarBrand)
                .ToListAsync();

            var result = new
            {
                items = HelperDTO.TransformGuitars(guitars),
                totalPages,
                totalItems
            };

            return Json(result);
        }



        [HttpGet]
        public async Task<IActionResult> GetGuitarImage(int guitarId, int index)
        {
            var guitar = await _dataManager.Guitars.GetGuitarByIdAsync(guitarId);

            if (guitar == null || guitar.Images == null || index < 0 || index >= guitar.Images.Count)
            {
                return NotFound();
            }

            var imagePath = Url.Content($"~/img/{guitar.Images.ElementAt(index).FileName}");
            return Json(new { imageUrl = imagePath });
        }

        [HttpGet]
        public async Task<IActionResult> LiveSearch(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return Json(new List<object>());

            query = query.ToLower();

            var guitarsQuery = _dataManager.Guitars
                .GetQueryable()
                .Include(g => g.GuitarBrand)
                .Include(g => g.Images);

            var matchedGuitars = await guitarsQuery
                .Where(g =>
                    (g.GuitarModel != null && g.GuitarModel.ToLower().Contains(query)) ||
                    (g.GuitarBrand != null && g.GuitarBrand.BrandName != null && g.GuitarBrand.BrandName.ToLower().Contains(query)))
                .Take(10)
                .ToListAsync();

            var results = matchedGuitars.Select(g => new
            {
                id = g.Id,
                brand = g.GuitarBrand?.BrandName ?? "",
                model = g.GuitarModel ?? "",
                price = g.GuitarPrice,
                image = g.Images?.FirstOrDefault()?.FileName
            });

            return Json(results);
        }
    }
}
