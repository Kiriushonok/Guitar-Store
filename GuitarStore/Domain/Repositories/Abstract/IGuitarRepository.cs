using GuitarStore.Domain.Entities;

namespace GuitarStore.Domain.Repositories.Abstract
{
    public interface IGuitarRepository
    {
        Task<IEnumerable<Guitar>> GetGuitarsAsync();
        Task<Guitar?> GetGuitarByIdAsync(int id);
        Task SaveGuitarAsync(Guitar guitar);
        Task DeleteGuitarAsync(int id);
        Task<Guitar?> GetGuitarByBrandAndModelAsync(int brandId, string model);
        IQueryable<Guitar> GetQueryable();
    }
}
