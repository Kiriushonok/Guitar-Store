using GuitarStore.Domain.Entities;

namespace GuitarStore.Domain.Repositories.Abstract
{
    public interface IGuitarRepository
    {
        Task<IEnumerable<Guitar>> GetGuitarsAsync();
        Task<Guitar?> GetGuitarByIdAsync(int id);
        Task SaveGuitarAsync(Guitar guitar);
        Task DeleteGuitarAsync(int id);

        IQueryable<Guitar> GetQueryable();
    }
}
