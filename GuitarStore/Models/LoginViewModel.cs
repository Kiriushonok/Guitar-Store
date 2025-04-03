using System.ComponentModel.DataAnnotations;

namespace GuitarStore.Models
{
    public class LoginViewModel
    {
        [Display(Name = "Логин")]
        [Required(ErrorMessage = "Логин не введён")]
        public string? UserName { get; set; }

        [Display(Name = "Пароль")]
        [UIHint("password")]
        [Required(ErrorMessage = "Пароль не введён")]
        public string? Password { get; set; }

        [Display(Name = "Запомнить меня?")]
        public bool RememberMe { get; set; }
    }
}
