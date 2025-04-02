using GuitarStore.Domain.Entities;

namespace GuitarStore.Domain.Repositories.Abstract
{
    public interface IGuitarBrandRepository
    {
        Task<IEnumerable<GuitarBrand>> GetGuitarBrandsAsync();
        Task<GuitarBrand?> GetGuitarBrandByIdAsync(int id);
        Task SaveGuitarBrandAsync(GuitarBrand brand);
        Task DeleteGuitarBrandAsync(int id);
    }
}
