using System.ComponentModel.DataAnnotations;

namespace GuitarStore.Models
{
    public class LoginViewModel
    {
        [Display(Name = "Логин")]
        [Required]
        public string? UserName { get; set; }

        [Display(Name = "Пароль")]
        [UIHint("password")]
        [Required]
        public string? Password { get; set; }

        [Display(Name = "Запомнить меня?")]
        public bool RememberMe { get; set; }
    }
}
