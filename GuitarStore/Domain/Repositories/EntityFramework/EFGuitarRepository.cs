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

        public async Task<Guitar?> GetGuitarByIdAsync(int id)
        {
            return await _appDbContext.Guitars.Include(x => x.GuitarBrand).FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<Guitar>> GetGuitarsAsync()
        {
            return await _appDbContext.Guitars.Include(x => x.GuitarBrand).ToListAsync();
        }

        public async Task SaveGuitarAsync(Guitar guitar)
        {
            _appDbContext.Entry(guitar).State = guitar.Id == default ? EntityState.Added : EntityState.Modified;
            await _appDbContext.SaveChangesAsync();
        }
    }
}
