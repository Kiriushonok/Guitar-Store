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
    const carouselImage = document.getElementById("carousel-image");
    const carouselWrapper = document.querySelector(".carousel-images");

    const dots = document.querySelectorAll(".carousel-dot");

    function updateDots(index) {
        dots.forEach(dot => dot.classList.remove("active"));
        if (dots[index]) {
            dots[index].classList.add("active");
        }
    }

    dots.forEach(dot => {
        dot.addEventListener("click", (e) => {
            const index = parseInt(e.target.dataset.index);
            if (index !== currentIndex) {
                loadImage(index);
            }
        });
    });


    const totalImages = parseInt(carouselWrapper.dataset.total);
    const guitarId = carouselWrapper.dataset.guitarId;

    let currentIndex = 0;

    // ���������� ������ ������ ���� ������ ����� ��������
    if (totalImages > 1) {
        prevBtn.style.display = "block";
        nextBtn.style.display = "block";
    }

    function fadeOut(element) {
        element.classList.remove("active");
    }

    function fadeIn(element) {
        element.classList.add("active");
    }

    function loadImage(index) {
        fetch(`/Guitars/GetGuitarImage?guitarId=${guitarId}&index=${index}`)
            .then(res => {
                if (!res.ok) throw new Error("Image not found");
                return res.json();
            })
            .then(data => {
                fadeOut(carouselImage);

                // ������ ����� �����������
                setTimeout(() => {
                    carouselImage.src = data.imageUrl;
                    currentIndex = index;
                    fadeIn(carouselImage);
                    updateDots(index); // ��������� �������� �����
                }, 250);
            })
            .catch(err => console.error("������ ��� �������� �����������:", err));
    }

    nextBtn.addEventListener("click", () => {
        const nextIndex = (currentIndex + 1) % totalImages;
        loadImage(nextIndex);
    });

    prevBtn.addEventListener("click", () => {
        const prevIndex = (currentIndex - 1 + totalImages) % totalImages;
        loadImage(prevIndex);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("filter-form");
    const catalogContainer = document.getElementById("catalog-container");
    const prevPageBtn = document.getElementById("prev-page-btn");
    const nextPageBtn = document.getElementById("next-page-btn");
    const currentPageSpan = document.getElementById("current-page");
    const pageIndicator = document.querySelector(".pagination");
    const priceMinInput = document.getElementById("priceMin");
    const priceMaxInput = document.getElementById("priceMax");

    // Можно вставить это куда-то в HTML или динамически создать
    const priceWarning = document.createElement("p");
    priceWarning.style.color = "red";
    priceWarning.style.display = "none";
    priceWarning.textContent = "Минимальная цена не может быть больше максимальной!";
    form.insertBefore(priceWarning, form.querySelector("button, input[type='submit']")); // вставим перед кнопкой

    function validatePriceInputs() {
        const min = parseFloat(priceMinInput.value);
        const max = parseFloat(priceMaxInput.value);

        if (!isNaN(min) && !isNaN(max) && min > max) {
            priceWarning.style.display = "block";
            return false;
        } else {
            priceWarning.style.display = "none";
            return true;
        }
    }

    priceMinInput.addEventListener("input", validatePriceInputs);
    priceMaxInput.addEventListener("input", validatePriceInputs);



    let currentPage = 1;
    const pageSize = 1;

    async function fetchGuitars() {
        const params = new URLSearchParams(new FormData(form));
        params.append("page", currentPage);
        params.append("pageSize", pageSize);

        const response = await fetch(`/Guitars/GetFilteredGuitars?${params.toString()}`);
        const data = await response.json();

        renderGuitars(data.items);
        updatePagination(data.totalPages);
        updatePricePlaceholders(data.minPrice, data.maxPrice); // 👈 добавили
    }

    function updatePricePlaceholders(min, max) {
        const priceMinInput = document.getElementById("priceMin");
        const priceMaxInput = document.getElementById("priceMax");

        priceMinInput.placeholder = `от ${min}`;
        priceMaxInput.placeholder = `до ${max}`;
    }


    catalogContainer.addEventListener("mouseover", function (event) {
        const card = event.target.closest(".product-card-box");
        if (card) {
            card.style.transform = "scale(1.05)";
            card.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.2)";
            card.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
        }
    });

    catalogContainer.addEventListener("mouseout", function (event) {
        const card = event.target.closest(".product-card-box");
        if (card) {
            card.style.transform = "scale(1)";
            card.style.boxShadow = "";
            card.style.backgroundColor = "";
        }
    });

    function renderGuitars(guitars) {
        catalogContainer.innerHTML = "";

        if (guitars.length === 0) {
            catalogContainer.innerHTML = "<p>Ничего не найдено.</p>";
            return;
        }

        guitars.forEach(guitar => {
            const card = document.createElement("a");
            card.href = `/Guitars/Show/${guitar.id}`;
            card.className = "product-card-box";

            card.innerHTML = `
            <img src="/img/${guitar.guitarImageFileNames?.[0]}"
                 alt="${guitar.guitarBrand} ${guitar.guitarModel}" class="product-card-image" />
            <div class="product-card-info">
                <div>${guitar.guitarBrand} ${guitar.guitarModel}</div>
                <strong>${guitar.guitarPrice.toLocaleString()} ₽</strong>
                <p>Тип: ${guitar.guitarType}</p>
                <p>Бренд: ${guitar.guitarBrand}</p>
            </div>
        `;

            catalogContainer.appendChild(card);
        });
    }


    function updatePagination(totalPages) {
        if (totalPages <= 1) {
            pageIndicator.style.display = "none";
        } else {
            pageIndicator.style.display = "flex";
            currentPageSpan.textContent = currentPage;
            prevPageBtn.disabled = currentPage === 1;
            nextPageBtn.disabled = currentPage === totalPages;

            prevPageBtn.onclick = () => {
                if (currentPage > 1) {
                    currentPage--;
                    fetchGuitars();
                }
            };

            nextPageBtn.onclick = () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    fetchGuitars();
                }
            };
        }
    }

    form.addEventListener("submit", e => {
        e.preventDefault();
        if (!validatePriceInputs()) return;

        currentPage = 1;
        fetchGuitars();
    });



    const backToTopButton = document.getElementById("back-to-top");
    if (backToTopButton) {
        window.addEventListener("scroll", () => {
            backToTopButton.style.display = window.scrollY > 300 ? "block" : "none";
        });

        backToTopButton.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // Начальная загрузка
    fetchGuitars();
});
