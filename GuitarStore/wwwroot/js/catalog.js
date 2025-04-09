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

    const globalMin = parseInt(sliderMin.min);
    const globalMax = parseInt(sliderMax.max);

    function calculateStep(min, max) {
        let step = Math.max(1, Math.round((max - min) / 100));
        while ((max - min) % step !== 0 && step > 1) step--;
        return step;
    }

    function roundToStep(value, step, base) {
        const relative = (value - base) / step;
        const rounded = Math.round(relative) * step + base;

        // Если слишком близко к границе — форсируем границу
        if (Math.abs(rounded - globalMin) < step / 2) return globalMin;
        if (Math.abs(rounded - globalMax) < step / 2) return globalMax;

        return Math.min(globalMax, Math.max(globalMin, rounded));
    }

    const step = calculateStep(globalMin, globalMax);
    sliderMin.step = step;
    sliderMax.step = step;


    function onSliderMinInput() {
        const rawMin = parseInt(sliderMin.value);
        const step = calculateStep(globalMin, globalMax);
        const base = globalMin;

        const clampedMin = Math.min(rawMin, parseInt(sliderMax.value));
        const roundedMin = roundToStep(clampedMin, step, base);

        if (sliderMin.value != roundedMin) {
            sliderMin.value = roundedMin;
        }

        priceMinInput.value = roundedMin;
        rangeMinLabel.textContent = `от ${roundedMin}`;
        updateSliderTrack();
        validatePriceInputs();
    }

    function onSliderMaxInput() {
        const rawMax = parseInt(sliderMax.value);
        const step = calculateStep(globalMin, globalMax);
        const base = globalMin;

        const clampedMax = Math.max(rawMax, parseInt(sliderMin.value));
        const roundedMax = roundToStep(clampedMax, step, base);

        if (sliderMax.value != roundedMax) {
            sliderMax.value = roundedMax;
        }

        priceMaxInput.value = roundedMax;
        rangeMaxLabel.textContent = `до ${roundedMax}`;
        updateSliderTrack();
        validatePriceInputs();
    }


    function syncInputsToSliders() {
        let min = parseInt(priceMinInput.value);
        let max = parseInt(priceMaxInput.value);

        // Проверяем, что значения — это числа
        if (isNaN(min)) min = globalMin;
        if (isNaN(max)) max = globalMax;

        // Ограничиваем диапазон
        min = Math.max(globalMin, Math.min(globalMax, min));
        max = Math.max(globalMin, Math.min(globalMax, max));

        // Не обновляем слайдеры, если min > max
        if (min > max) {
            priceWarning.style.display = "block";
            return;
        } else {
            priceWarning.style.display = "none";
        }

        sliderMin.value = min;
        sliderMax.value = max;

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

    const priceWarning = document.createElement("p");
    priceWarning.style.color = "red";
    priceWarning.style.marginTop = "0px";
    priceWarning.style.display = "none";
    priceWarning.textContent = "Минимальная цена не может быть больше максимальной!";
    form.insertBefore(priceWarning, form.querySelector("button, input[type='submit']"));

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

    sliderMin.addEventListener("input", onSliderMinInput);
    sliderMax.addEventListener("input", onSliderMaxInput);
    priceMinInput.addEventListener("input", () => {
        syncInputsToSliders();
        validatePriceInputs();
    });
    priceMaxInput.addEventListener("input", () => {
        syncInputsToSliders();
        validatePriceInputs();
    });

    let currentPage = 1;
    let pageSize = parseInt(pageSizeSelect.value);

    pageSizeSelect.addEventListener("change", () => {
        pageSize = parseInt(pageSizeSelect.value);
        currentPage = 1;
        fetchGuitars();
    });

    resetFiltersBtn.addEventListener("click", () => {
        form.reset();
        sliderMin.value = globalMin;
        sliderMax.value = globalMax;
        onSliderMinInput();
        onSliderMaxInput();
        currentPage = 1;
        fetchGuitars();
        validatePriceInputs();
    });

    form.addEventListener("submit", e => {
        e.preventDefault();
        if (!validatePriceInputs()) return;
        currentPage = 1;
        fetchGuitars();
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
    }

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

            const hasImage = guitar.guitarImageFileNames && guitar.guitarImageFileNames.length > 0;
            const imageHtml = hasImage
                ? `<img src="/img/${guitar.guitarImageFileNames[0]}" 
                       alt="${guitar.guitarBrand} ${guitar.guitarModel}" 
                       class="product-card-image" />`
                : `<div class="no-image-placeholder">Пока нет фотографий гитары ${guitar.guitarBrand} ${guitar.guitarModel}</div>`;

            card.innerHTML = `
                ${imageHtml}
                <div class="product-card-info">
                    <div>${guitar.guitarBrand} ${guitar.guitarModel}</div>
                    <strong>${guitar.guitarPrice.toLocaleString()} ₽</strong>
                    <p>Тип: ${guitar.guitarType}</p>
                    <p>Бренд: ${guitar.guitarBrand}</p>
                </div>`;

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

    catalogContainer.addEventListener("mouseover", event => {
        const card = event.target.closest(".product-card-box");
        if (card) {
            card.style.transform = "scale(1.05)";
            card.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.2)";
            card.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
        }
    });

    catalogContainer.addEventListener("mouseout", event => {
        const card = event.target.closest(".product-card-box");
        if (card) {
            card.style.transform = "scale(1)";
            card.style.boxShadow = "";
            card.style.backgroundColor = "";
        }
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

    fetchGuitars();
});
