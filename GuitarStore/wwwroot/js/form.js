document.getElementById("service-form").addEventListener("submit", function (e) {
    e.preventDefault();
    let isValid = true;

    // Получение значений
    const guitarBrand = document.getElementById("guitar-brand").value.trim();
    const guitarType = document.getElementById("guitar-type").value.trim();
    const guitarModel = document.getElementById("guitar-model").value.trim();
    const year = document.getElementById("year").value.trim();
    const price = document.getElementById("price").value.trim();
    const guitarPhoto = document.getElementById("guitar-photo").files[0];

    // Очистка старых ошибок
    document.querySelectorAll(".error").forEach((error) => (error.textContent = ""));
    document.getElementById("success-message").textContent = "";

    // Валидация бренда гитары
    if (!guitarBrand) {
        document.getElementById("guitar-brand-error").textContent = "Введите бренд гитары.";
        isValid = false;
    }

    // Валидация типа гитары
    if (!guitarType) {
        document.getElementById("guitar-type-error").textContent = "Введите тип гитары.";
        isValid = false;
    }

    // Валидация модели гитары
    if (!guitarModel) {
        document.getElementById("guitar-model-error").textContent = "Введите модель гитары.";
        isValid = false;
    }

    // Валидация года выпуска
    const currentYear = new Date().getFullYear();
    if (!/^\d{4}$/.test(year) || year < 2000 || year > currentYear) {
        document.getElementById("year-error").textContent = "Год выпуска должен быть в диапазоне от 2000 до текущего года.";
        isValid = false;
    }

    // Валидация цены
    if (!/^\d+$/.test(price) || price <= 0) {
        document.getElementById("price-error").textContent = "Введите корректную цену в рублях.";
        isValid = false;
    }

    // Валидация фото
    if (!guitarPhoto) {
        document.getElementById("guitar-photo-error").textContent = "Прикрепите фото гитары.";
        isValid = false;
    } else if (!["image/jpeg", "image/png"].includes(guitarPhoto.type)) {
        document.getElementById("guitar-photo-error").textContent = "Фото должно быть в формате .jpg или .png.";
        isValid = false;
    }

    // Если все данные корректны
    if (isValid) {
        document.getElementById("success-message").textContent = "Гитара успешно добавлена!";
        this.reset();
    }
});
