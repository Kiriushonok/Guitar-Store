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
