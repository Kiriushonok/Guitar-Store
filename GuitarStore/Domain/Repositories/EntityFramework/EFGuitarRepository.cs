using GuitarStore.Domain.Entities;
using GuitarStore.Domain.Repositories.Abstract;
using Microsoft.EntityFrameworkCore;

namespace GuitarStore.Domain.Repositories.EntityFramework
{
    public class EFGuitarRepository : IGuitarRepository
    {
        private readonly AppDbContext _appDbContext;

        public EFGuitarRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task DeleteGuitarAsync(int id)
        {
            _appDbContext.Entry(new Guitar() { Id = id }).State = EntityState.Deleted;
            await _appDbContext.SaveChangesAsync();
        }

        public IQueryable<Guitar> GetQueryable()
        {
            return _appDbContext.Guitars
                .Include(g => g.GuitarBrand)
                .Include(g => g.Images);
        }

        public async Task<Guitar?> GetGuitarByIdAsync(int id)
        {
            return await _appDbContext.Guitars.Include(x => x.GuitarBrand).Include(g => g.Images).FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<Guitar>> GetGuitarsAsync()
        {
            return await _appDbContext.Guitars.Include(x => x.GuitarBrand).Include(g => g.Images).ToListAsync();
        }

        public async Task SaveGuitarAsync(Guitar guitar)
        {
            if (guitar.Id == 0)
            {
                _appDbContext.Guitars.Add(guitar);
            }
            else
            {
                _appDbContext.Guitars.Update(guitar);

                // Обрабатываем изображения (если есть новые)
                if (guitar.Images != null && guitar.Images.Any())
                {
                    foreach (var image in guitar.Images)
                    {
                        if (image.Id == 0)
                        {
                            _appDbContext.GuitarImages.Add(image);
                        }
                    }
                }
            }

            await _appDbContext.SaveChangesAsync();
        }

        public async Task<Guitar?> GetGuitarByBrandAndModelAsync(int brandId, string model)
        {
            return await _appDbContext.Guitars
                .FirstOrDefaultAsync(g => g.GuitarBrandId == brandId && g.GuitarModel == model);
        }

    }
}
