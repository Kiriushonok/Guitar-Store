﻿using GuitarStore.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace GuitarStore.Controllers
{
    public class AccountController : Controller
    {
        private readonly SignInManager<IdentityUser> _signInManager;

        public AccountController(SignInManager<IdentityUser> signInManager) { 
            
            _signInManager = signInManager; 
        }

        [HttpGet]
        public async Task<IActionResult> Login(string? returnUrl)
        {
            // Завершаем текущий сеанс работы перед новым логином
            await _signInManager.SignOutAsync();

            // Раздел сайта (URL), куда перенаправить пользователя после успешного логина
            ViewBag.ReturnUrl = returnUrl;
            return View(new LoginViewModel());
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginViewModel model, string? returnUrl)
        {
            // Раздел сайта (URL), куда перенаправить пользователя после успешного логина
            ViewBag.ReturnUrl = returnUrl;
            if(!ModelState.IsValid) {
                return View(model);
            }
            Microsoft.AspNetCore.Identity.SignInResult result = await _signInManager.PasswordSignInAsync(model.UserName!, model.Password!, model.RememberMe, false);
                if (result.Succeeded) {
                    return Redirect(returnUrl ?? "/");
                }
                ModelState.AddModelError(string.Empty, "Неверный логин или пароль");
                return View(model);
            
        }

        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return RedirectToAction("Index", "Home");
        }
    }
}
