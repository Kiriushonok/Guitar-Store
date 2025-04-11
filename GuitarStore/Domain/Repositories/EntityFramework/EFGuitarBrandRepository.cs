using GuitarStore.Domain.Entities;
using GuitarStore.Domain.Repositories.Abstract;
using Microsoft.EntityFrameworkCore;

namespace GuitarStore.Domain.Repositories.EntityFramework
{
    public class EFGuitarBrandRepository : IGuitarBrandRepository
    {

        private readonly AppDbContext _appDbContext;

        public EFGuitarBrandRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task DeleteGuitarBrandAsync(int id)
        {
            _appDbContext.Entry(new GuitarBrand() { Id = id}).State = EntityState.Deleted;
            await _appDbContext.SaveChangesAsync();
        }

        public async Task<GuitarBrand?> GetGuitarBrandByIdAsync(int id)
        {
            return await _appDbContext.GuitarBrands.Include(x => x.Guitars).FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<GuitarBrand?> GetGuitarBrandByNameAsync(string name)
        {
            return await _appDbContext.GuitarBrands.Include(x => x.Guitars).FirstOrDefaultAsync(x => x.BrandName != null && x.BrandName == name);
        }

        public async Task<IEnumerable<GuitarBrand>> GetGuitarBrandsAsync()
        {
            return await _appDbContext.GuitarBrands.Include(x => x.Guitars).ToListAsync();
        }

        public async Task SaveGuitarBrandAsync(GuitarBrand brand)
        {
            _appDbContext.Entry(brand).State = brand.Id == default ? EntityState.Added : EntityState.Modified;
            await _appDbContext.SaveChangesAsync();
        }
    }
}
