using GuitarStore.Domain.Entities;
using GuitarStore.Models;

namespace GuitarStore.Infrastructure
{
    public static class HelperDTO
    {
        // Guitar => GuitarDTO
        public static GuitarDTO TransformGuitar(Guitar entity)
        {
            GuitarDTO entityDTO = new GuitarDTO();
            entityDTO.Id = entity.Id;
            entityDTO.GuitarBrand = entity.GuitarBrand?.BrandName;
            entityDTO.GuitarModel = entity.GuitarModel;
            entityDTO.GuitarType = entity.GuitarType.ToString();
            entityDTO.GuitarYear = entity.GuitarYear;
            entityDTO.GuitarPrice = entity.GuitarPrice;
            entityDTO.GuitarImageFileNames = entity.Images?.Select(img => img.FileName).ToList();

            return entityDTO;
        }

        public static IEnumerable<GuitarDTO> TransformGuitars(IEnumerable<Guitar> entities) {
            List<GuitarDTO> entityesDTO = new List<GuitarDTO>();

            foreach(Guitar entity in entities) {
                entityesDTO.Add(TransformGuitar(entity));
            }

            return entityesDTO;
        }
    }
}
