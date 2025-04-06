document.addEventListener("DOMContentLoaded", () => {
    const filterForm = document.getElementById("filter-form");
    const products = document.querySelectorAll(".product-card-box");

    // Product data (adjusted for guitars)
    const guitarsData = [
        {
            element: products[0],
            name: "Yamaha F310",
            price: 25000,
            type: "acoustic",
            brand: "yamaha"
        },
        {
            element: products[1],
            name: "Fender Stratocaster",
            price: 120000,
            type: "electric",
            brand: "fender"
        },
        {
            element: products[2],
            name: "Ibanez GSR200",
            price: 80000,
            type: "bass",
            brand: "ibanez"
        },
        {
            element: products[3],
            name: "Gibson Les Paul",
            price: 140000,
            type: "electric",
            brand: "gibson"
        },
        {
            element: products[4],
            name: "Fender Precision Bass",
            price: 90000,
            type: "bass",
            brand: "fender"
        },
        {
            element: products[5],
            name: "Gibson Les Paul Standard",
            price: 150000,
            type: "electric",
            brand: "gibson"
        }
    ];

    filterForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent page reload
    
        const guitarTypeFilter = filterForm["guitar-type"].value;
        let priceMinFilter = parseInt(filterForm["price-min"].value);
        let priceMaxFilter = parseInt(filterForm["price-max"].value);
        const brandFilter = filterForm["brand"].value;
    
        // Обработка некорректных значений цены
        if (isNaN(priceMinFilter)) priceMinFilter = 0; // Если поле пустое или содержит не число, устанавливаем минимум в 0
        if (isNaN(priceMaxFilter)) priceMaxFilter = Infinity; // Если поле пустое или содержит не число, устанавливаем максимум в бесконечность
    
        // Проверка на корректность диапазона цен
        if (priceMinFilter > priceMaxFilter) {
            alert("Некорректные фильтры по цене: минимальная цена больше максимальной.");
            return;
        }
    
    
        // Применение фильтров
        guitarsData.forEach((guitar) => {
            const matchesType = guitarTypeFilter === '' || guitar.type === guitarTypeFilter;
            const matchesPrice = guitar.price >= priceMinFilter && guitar.price <= priceMaxFilter;
            const matchesBrand = brandFilter === '' || guitar.brand === brandFilter;
    
            guitar.element.style.display = (matchesType && matchesPrice && matchesBrand) ? "block" : "none";
        });
    });
    
    

    // Add hover effects for product cards
    document.querySelectorAll('.product-card-box').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)'; // Increase card size
            this.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)'; // Add shadow
            this.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'; // Darken background slightly
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)'; // Reset card size
            this.style.boxShadow = ''; // Remove shadow
            this.style.backgroundColor = ''; // Reset background color
        });
    });

    // Back to Top Button Logic
    const backToTopButton = document.getElementById("back-to-top");

    // Show or hide the button depending on scroll position
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            backToTopButton.style.display = "block";
        } else {
            backToTopButton.style.display = "none";
        }
    });

    // Scroll to the top when the button is clicked
    backToTopButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});

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

document.addEventListener("DOMContentLoaded", () => {
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const carouselImages = document.querySelector(".carousel-images");
    const images = document.querySelectorAll(".guitar-image");

    let currentIndex = 0;

    function updateCarousel() {
        const offset = -currentIndex * 100;
        carouselImages.style.transform = `translateX(${offset}%)`;
    }

    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % images.length;
        updateCarousel();
    });

    prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateCarousel();
    });

    updateCarousel();
});
