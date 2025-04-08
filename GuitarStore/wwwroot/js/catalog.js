document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("filter-form");
    const catalogContainer = document.getElementById("catalog-container");
    const prevPageBtn = document.getElementById("prev-page-btn");
    const nextPageBtn = document.getElementById("next-page-btn");
    const currentPageSpan = document.getElementById("current-page");
    const pageIndicator = document.querySelector(".pagination");
    const priceMinInput = document.getElementById("priceMin");
    const priceMaxInput = document.getElementById("priceMax");
    const guitarCountDisplay = document.getElementById("guitar-count");
    const resetFiltersBtn = document.getElementById("reset-filters");
    const pageSizeSelect = document.getElementById("page-size-select");
    const sliderMin = document.getElementById("price-slider-min");
    const sliderMax = document.getElementById("price-slider-max");
    const rangeMinLabel = document.getElementById("range-min-label");
    const rangeMaxLabel = document.getElementById("range-max-label");

    function calculateStep(min, max) {
        const range = max - min;

        // Сначала возьмём желаемое значение
        let step = Math.max(1, Math.round(range / 100));

        // Убедимся, что max достижим:
        while ((range % step) !== 0 && step > 1) {
            step--;
        }

        return step;
    }

    function roundToStep(value, step, base) {
        const rounded = Math.round((value - base) / step) * step + base;
        return Math.min(rounded, parseInt(sliderMax.max)); // не превышать max
    }


    function syncSlidersToInputs() {
        let min = parseInt(sliderMin.value);
        let max = parseInt(sliderMax.value);

        if (min > max) {
            min = max;
            sliderMin.value = min;
        }

        const step = parseInt(sliderMin.getAttribute("step") || "1");
        const base = parseInt(sliderMin.min || "0");

        priceMinInput.value = roundToStep(min, step, base);
        priceMaxInput.value = roundToStep(max, step, base);

        rangeMinLabel.textContent = `от ${priceMinInput.value}`;
        rangeMaxLabel.textContent = `до ${priceMaxInput.value}`;

        updateSliderTrack();
    }

    function updateSliderTrack() {
        const min = parseInt(sliderMin.min);
        const max = parseInt(sliderMin.max);
        const valMin = parseInt(sliderMin.value);
        const valMax = parseInt(sliderMax.value);

        const percentMin = ((valMin - min) / (max - min)) * 100;
        const percentMax = ((valMax - min) / (max - min)) * 100;

        const track = document.querySelector(".slider-track");
        track.style.left = `${percentMin}%`;
        track.style.width = `${percentMax - percentMin}%`;
    }



    function syncInputsToSliders() {
        const min = parseInt(priceMinInput.value);
        const max = parseInt(priceMaxInput.value);

        if (!isNaN(min)) sliderMin.value = min;
        if (!isNaN(max)) sliderMax.value = max;

        syncSlidersToInputs();
    }

    sliderMin.addEventListener("input", syncSlidersToInputs);
    sliderMax.addEventListener("input", syncSlidersToInputs);

    priceMinInput.addEventListener("input", syncInputsToSliders);
    priceMaxInput.addEventListener("input", syncInputsToSliders);



    const priceWarning = document.createElement("p");
    priceWarning.style.color = "red";
    priceWarning.style.marginTop = "0px";
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
    let pageSize = parseInt(pageSizeSelect.value);

    pageSizeSelect.addEventListener("change", () => {
        pageSize = parseInt(pageSizeSelect.value);
        currentPage = 1;
        fetchGuitars();
    });

    resetFiltersBtn.addEventListener("click", () => {
        form.reset();
        currentPage = 1;
        fetchGuitars();
        validatePriceInputs();
    });

    async function fetchGuitars() {
        const params = new URLSearchParams(new FormData(form));
        params.append("page", currentPage);
        params.append("pageSize", pageSize);

        const response = await fetch(`/Guitars/GetFilteredGuitars?${params.toString()}`);
        const data = await response.json();

        guitarCountDisplay.textContent = `Найдено гитар: ${data.totalItems}`;
        renderGuitars(data.items);
        updatePagination(data.totalPages);
        updatePricePlaceholders(data.minPrice, data.maxPrice);
    }

    function updatePricePlaceholders(min, max) {
        priceMinInput.placeholder = `от ${min}`;
        priceMaxInput.placeholder = `до ${max}`;

        sliderMin.min = min;
        sliderMin.max = max;
        sliderMax.min = min;
        sliderMax.max = max;

        const step = calculateStep(min, max); // ← СНАЧАЛА step
        sliderMin.step = step;
        sliderMax.step = step;

        // Теперь можно безопасно установить value
        if (!priceMinInput.value) sliderMin.value = min;
        if (!priceMaxInput.value) sliderMax.value = max;

        syncSlidersToInputs();
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
