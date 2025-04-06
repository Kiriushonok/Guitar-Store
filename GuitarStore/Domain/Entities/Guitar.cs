using GuitarStore.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace GuitarStore.Domain.Entities
{
    public class Guitar : EntityBase
    {
        [Display(Name = "Тип гитары")]
        [Required(ErrorMessage = "Тип гитары не выбран")]
        public GuitarTypeEnum GuitarType { get; set; }

        [Display(Name = "Список картинок гитары")]
        public ICollection<GuitarImage>? Images { get; set; }

        [Display(Name = "Бренд гитары")]
        [Required(ErrorMessage = "Бренд гитары не выбран")]
        public int GuitarBrandId { get; set; }
        public GuitarBrand? GuitarBrand { get; set; }

        [Required(ErrorMessage = "Модель гитары не указана")]
        [Display(Name = "Модель гитары")]
        [MaxLength(50)]
        public string? GuitarModel { get; set; }

        [Display(Name = "Год выпуска")]
        public int GuitarYear { get; set; }

        [Required(ErrorMessage = "Цена гитары не указана")]
        [Display(Name = "Цена гитары")]
        public double GuitarPrice { get; set; }
    }
}
