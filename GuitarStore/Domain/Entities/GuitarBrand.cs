using System.ComponentModel.DataAnnotations;

namespace GuitarStore.Domain.Entities
{
    public class GuitarBrand : EntityBase
    {
        [Display(Name = "Бренд гитары")]
        [MaxLength(50)]
        public string? BrandName { get; set; }
        public ICollection<Guitar>? Guitars { get; set; }
    }
}
