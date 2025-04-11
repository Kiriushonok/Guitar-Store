document.addEventListener("DOMContentLoaded", () => {
    const $ = id => document.getElementById(id);
    const $$ = sel => document.querySelector(sel);

    const el = {
        form: $("filter-form"),
        catalog: $("catalog-container"),
        prevBtn: $("prev-page-btn"),
        nextBtn: $("next-page-btn"),
        pageSpan: $("current-page"),
        pageIndicator: $$(".pagination"),
        priceMin: $("priceMin"),
        priceMax: $("priceMax"),
        countDisplay: $("guitar-count"),
        resetBtn: $("reset-filters"),
        pageSize: $("page-size-select"),
        sliderMin: $("price-slider-min"),
        sliderMax: $("price-slider-max"),
        rangeMinLabel: $("range-min-label"),
        rangeMaxLabel: $("range-max-label"),
        search: $("search-input"),
        liveResults: $("live-search-results"),
        backToTop: $("back-to-top")
    };

    const globalMin = parseInt(el.sliderMin.min);
    const globalMax = parseInt(el.sliderMax.max);
    const step = calculateStep(globalMin, globalMax);

    let currentPage = 1;
    let pageSize = parseInt(el.pageSize.value);
    let liveSearchTimeout;
    let appliedFilters = new URLSearchParams(); // будет содержать только применённые фильтры


    el.sliderMin.step = step;
    el.sliderMax.step = step;

    // Live Search
    el.search.addEventListener("input", () => {
        const query = el.search.value.trim();
        if (liveSearchTimeout) clearTimeout(liveSearchTimeout);
        if (query.length < 2) return el.liveResults.style.display = "none";

        liveSearchTimeout = setTimeout(() => {
            fetch(`/Guitars/LiveSearch?query=${encodeURIComponent(query)}`)
                .then(res => res.json())
                .then(renderLiveSearch)
                .catch(() => {
                    el.liveResults.innerHTML = "<p>Ошибка поиска</p>";
                    el.liveResults.style.display = "block";
                });
        }, 30);
    });

    el.search.addEventListener("focus", () => {
        if (el.search.value.trim().length >= 2)
            el.liveResults.style.display = "block";
    });

    document.addEventListener("click", e => {
        if (!el.liveResults.contains(e.target) && !el.search.contains(e.target))
            el.liveResults.style.display = "none";
    });

    function renderLiveSearch(results) {
        el.liveResults.innerHTML = results?.length
            ? results.map(g => `
                <div class="live-search-item" onclick="location.href='/Guitars/Show/${g.id}'">
                    <img src="/img/${g.image?.trim() || 'noimage_detail.png'}" alt="${g.brand} ${g.model}" />
                    <div class="live-search-item-title">${g.brand} ${g.model}</div>
                    <div><strong>${g.price.toLocaleString()} ₽</strong></div>
                </div>`).join("")
            : "<p>Ничего не найдено</p>";

        el.liveResults.style.display = "block";
    }

    // Слайдеры и валидация
    const priceWarning = document.createElement("p");
    Object.assign(priceWarning.style, {
        color: "red", marginTop: "0px", display: "none"
    });
    priceWarning.textContent = "Минимальная цена не может быть больше максимальной!";
    el.form.insertBefore(priceWarning, el.form.querySelector("button, input[type='submit']"));

    function calculateStep(min, max) {
        let step = Math.max(1, Math.round((max - min) / 100));
        while ((max - min) % step !== 0 && step > 1) step--;
        return step;
    }

    function roundToStep(value, step, base) {
        const rounded = Math.round((value - base) / step) * step + base;
        if (Math.abs(rounded - globalMin) < step / 2) return globalMin;
        if (Math.abs(rounded - globalMax) < step / 2) return globalMax;
        return Math.min(globalMax, Math.max(globalMin, rounded));
    }

    function onSliderInput(isMin) {
        const slider = isMin ? el.sliderMin : el.sliderMax;
        const other = isMin ? el.sliderMax : el.sliderMin;
        const input = isMin ? el.priceMin : el.priceMax;
        const label = isMin ? el.rangeMinLabel : el.rangeMaxLabel;
        const prefix = isMin ? "от" : "до";

        const clamped = isMin
            ? Math.min(parseInt(slider.value), parseInt(other.value))
            : Math.max(parseInt(slider.value), parseInt(other.value));

        const rounded = roundToStep(clamped, step, globalMin);
        if (slider.value != rounded) slider.value = rounded;

        input.value = rounded;
        label.textContent = `${prefix} ${rounded}`;
        updateSliderTrack();
        validatePriceInputs();
    }

    function updateSliderTrack() {
        const min = parseInt(el.sliderMin.min);
        const max = parseInt(el.sliderMin.max);
        const valMin = parseInt(el.sliderMin.value);
        const valMax = parseInt(el.sliderMax.value);

        const percentMin = ((valMin - min) / (max - min)) * 100;
        const percentMax = ((valMax - min) / (max - min)) * 100;

        const track = document.querySelector(".slider-track");
        track.style.left = `${percentMin}%`;
        track.style.width = `${percentMax - percentMin}%`;
    }

    function syncInputsToSliders() {
        let min = parseInt(el.priceMin.value);
        let max = parseInt(el.priceMax.value);
        if (isNaN(min)) min = globalMin;
        if (isNaN(max)) max = globalMax;

        min = Math.max(globalMin, Math.min(globalMax, min));
        max = Math.max(globalMin, Math.min(globalMax, max));

        if (min > max) {
            priceWarning.style.display = "block";
            return;
        } else {
            priceWarning.style.display = "none";
        }

        el.sliderMin.value = min;
        el.sliderMax.value = max;
        updateSliderTrack();
    }

    function validatePriceInputs() {
        let min = parseFloat(el.priceMin.value);
        let max = parseFloat(el.priceMax.value);

        if (isNaN(min)) {
            min = globalMin;
            el.priceMin.value = min;
        }
        if (isNaN(max)) {
            max = globalMax;
            el.priceMax.value = max;
        }

        const valid = min <= max;
        priceWarning.style.display = valid ? "none" : "block";
        return valid;
    }


    el.sliderMin.addEventListener("input", () => onSliderInput(true));
    el.sliderMax.addEventListener("input", () => onSliderInput(false));
    el.priceMin.addEventListener("input", () => { syncInputsToSliders(); validatePriceInputs(); });
    el.priceMax.addEventListener("input", () => { syncInputsToSliders(); validatePriceInputs(); });

    // Пагинация, фильтрация
    el.pageSize.addEventListener("change", () => {
        pageSize = parseInt(el.pageSize.value);
        currentPage = 1;
        fetchGuitars();
    });

    el.resetBtn.addEventListener("click", () => {
        el.form.reset();
        el.sliderMin.value = globalMin;
        el.sliderMax.value = globalMax;
        onSliderInput(true);
        onSliderInput(false);

        appliedFilters = new URLSearchParams(); // сбрасываем фильтры
        currentPage = 1;
        fetchGuitars();
    });


    el.form.addEventListener("submit", e => {
        e.preventDefault();
        if (!validatePriceInputs()) return;

        appliedFilters = new URLSearchParams(new FormData(el.form)); // сохраняем фильтры
        currentPage = 1;
        fetchGuitars();
    });


    async function fetchGuitars() {
        const params = new URLSearchParams(appliedFilters.toString());
        params.set("page", currentPage);
        params.set("pageSize", pageSize);

        const res = await fetch(`/Guitars/GetFilteredGuitars?${params.toString()}`);
        const data = await res.json();

        el.countDisplay.textContent = `Найдено гитар: ${data.totalItems}`;
        renderGuitars(data.items);
        updatePagination(data.totalPages);
    }


    function renderGuitars(guitars) {
        el.catalog.innerHTML = guitars.length
            ? guitars.map(g => `
                <a href="/Guitars/Show/${g.id}" class="product-card-box">
                    <img src="/img/${g.guitarImageFileNames?.[0] || 'noimage_detail.png'}" 
                         alt="${g.guitarBrand} ${g.guitarModel}" class="product-card-image" />
                    <div class="product-card-info">
                        <div>${g.guitarBrand} ${g.guitarModel}</div>
                        <strong>${g.guitarPrice.toLocaleString()} ₽</strong>
                        <p>Тип: ${g.guitarType}</p>
                        <p>Бренд: ${g.guitarBrand}</p>
                    </div>
                </a>`).join("")
            : "<p>Ничего не найдено.</p>";
    }

    function updatePagination(totalPages) {
        if (totalPages <= 1) {
            el.pageIndicator.style.display = "none";
            return;
        }

        el.pageIndicator.style.display = "flex";
        el.pageSpan.textContent = currentPage;
        el.prevBtn.disabled = currentPage === 1;
        el.nextBtn.disabled = currentPage === totalPages;

        el.prevBtn.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                fetchGuitars();
            }
        };

        el.nextBtn.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                fetchGuitars();
            }
        };
    }

    // Hover эффект
    function toggleCardHover(e, hover) {
        const card = e.target.closest(".product-card-box");
        if (!card) return;
        card.style.transform = hover ? "scale(1.05)" : "scale(1)";
        card.style.boxShadow = hover ? "0 6px 20px rgba(0, 0, 0, 0.2)" : "";
        card.style.backgroundColor = hover ? "rgba(0, 0, 0, 0.05)" : "";
    }

    el.catalog.addEventListener("mouseover", e => toggleCardHover(e, true));
    el.catalog.addEventListener("mouseout", e => toggleCardHover(e, false));

    // Кнопка "наверх"
    if (el.backToTop) {
        window.addEventListener("scroll", () => {
            el.backToTop.style.display = window.scrollY > 300 ? "block" : "none";
        });
        el.backToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    fetchGuitars();
});
