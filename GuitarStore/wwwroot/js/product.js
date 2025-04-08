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

    // Показываем кнопки только если больше одной картинки
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

                // Мягкая смена изображения
                setTimeout(() => {
                    carouselImage.src = data.imageUrl;
                    currentIndex = index;
                    fadeIn(carouselImage);
                    updateDots(index); // обновляем активную точку
                }, 250);
            })
            .catch(err => console.error("Ошибка при загрузке изображения:", err));
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
