using System.ComponentModel.DataAnnotations;

namespace GuitarStore.Domain.Entities
{
    public class GuitarBrand : EntityBase
    {
        [Display(Name = "Бренд гитары")]
        [Required(ErrorMessage = "Бренд гитары не задан")]
        [MaxLength(50)]
        public required string BrandName { get; set; }
        public ICollection<Guitar>? Guitars { get; set; }
    }
}
