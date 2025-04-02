using GuitarStore.Domain.Repositories.Abstract;

namespace GuitarStore.Domain
{
    public class DataManager
    {
        public IGuitarBrandRepository GuitarBrands { get; set; }
        public IGuitarRepository Guitars {  get; set; }

        public DataManager(IGuitarBrandRepository guitarBrandRepository, IGuitarRepository guitarRepository) {
            
            GuitarBrands = guitarBrandRepository;
            Guitars = guitarRepository;
        }

    }
}
