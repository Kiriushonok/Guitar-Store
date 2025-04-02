using GuitarStore.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace GuitarStore.Domain.Entities
{
    public class Guitar : EntityBase
    {
        [Display(Name = "Тип гитары")]
        public GuitarTypeEnum GuitarType { get; set; }

        [Display(Name = "Титульная картинка")]
        [MaxLength(300)]
        public string? Photo { get; set; }

        [Display(Name = "Бренд гитары")]
        public int GuitarBrandId { get; set; }
        public GuitarBrand? GuitarBrand { get; set; }

        [Display(Name = "Модель гитары")]
        [MaxLength(50)]
        public string? GuitarModel { get; set; }

        [Display(Name = "Год выпуска")]
        public int? GuitarYear { get; set; }

        [Display(Name = "Цена гитары")]
        public double GuitarPrice { get; set; }
    }
}
