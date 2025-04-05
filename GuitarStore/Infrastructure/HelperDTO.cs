using GuitarStore.Domain.Entities;
using GuitarStore.Models;

namespace GuitarStore.Infrastructure
{
    public static class HelperDTO
    {
        // Guitar => GuitarDTO
        public static GuitarDTO TransformService(Guitar entity)
        {
            GuitarDTO entityDTO = new GuitarDTO();
            entityDTO.Id = entity.Id;
            entityDTO.GuitarBrand = entity.GuitarBrand?.BrandName;
            entityDTO.GuitarModel = entity.GuitarModel;
            entityDTO.GuitarType = entity.GuitarType.ToString();
            entityDTO.GuitarYear = entity.GuitarYear;
            entityDTO.GuitarPrice = entity.GuitarPrice;
            entityDTO.GuitarPhotoFileName = entity.Photo;

            return entityDTO;
        }
    }
}
