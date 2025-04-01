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
