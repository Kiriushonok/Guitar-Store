using GuitarStore.Domain.Attributes;
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
        public int? GuitarBrandId { get; set; }
        public GuitarBrand? GuitarBrand { get; set; }

        [Required(ErrorMessage = "Модель гитары не указана")]
        [Display(Name = "Модель гитары")]
        [MaxLength(50, ErrorMessage = "Название модели не должно превышать 50 символов")]
        public string? GuitarModel { get; set; }

        [Display(Name = "Год выпуска")]
        [YearRange(1900)]
        public int GuitarYear { get; set; }

        [Required(ErrorMessage = "Цена гитары не указана")]
        [Display(Name = "Цена гитары")]
        [Range(0, double.MaxValue, ErrorMessage = "Цена не может быть отрицательной")]
        public double GuitarPrice { get; set; }
    }
}
