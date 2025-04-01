document.addEventListener("DOMContentLoaded", () => {
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const carouselImages = document.querySelector(".carousel-images");
    const images = document.querySelectorAll(".guitar-image");
    
    let currentIndex = 0;

    // Function to update the carousel position
    function updateCarousel() {
        const offset = -currentIndex * 100; // Offset to shift images
        carouselImages.style.transform = `translateX(${offset}%)`; // Move the carousel images
    }

    // Next button functionality
    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % images.length; // Move to next image
        updateCarousel();
    });

    // Previous button functionality
    prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length; // Move to previous image
        updateCarousel();
    });

    // Initialize the carousel
    updateCarousel();
});
