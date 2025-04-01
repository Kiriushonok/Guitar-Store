using GuitarStore.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace GuitarStore.Domain.Entities
{
    public class Guitar : EntityBase
    {
        [Display(Name = "Тип гитары")]
        [Required(ErrorMessage = "Тип гитары не выбран")]
        public GuitarTypeEnum GuitarType { get; set; }

        [Display(Name = "Титульная картинка")]
        [MaxLength(300)]
        public string? Photo { get; set; }

        [Display(Name = "Бренд гитары")]
        [Required(ErrorMessage = "Бренд гитары не задан")]
        public required int GuitarBrandId { get; set; }
        public required GuitarBrand GuitarBrand { get; set; }

        [Display(Name = "Модель гитары")]
        [Required(ErrorMessage = "Модель гитары не задана")]
        [MaxLength(50)]
        public required string GuitarModel { get; set; }

        [Display(Name = "Год выпуска")]
        public int? GuitarYear { get; set; }

        [Display(Name = "Цена гитары")]
        [Required(ErrorMessage = "Цена гитары не задана")]
        public required double GuitarPrice { get; set; }
    }
}
