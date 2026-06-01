document.addEventListener("DOMContentLoaded", () => {
  const burgers = Array.from(document.querySelectorAll(".navbar-burger"));

  burgers.forEach((burger) => {
    burger.addEventListener("click", () => {
      const targetId = burger.dataset.target;
      const target = targetId ? document.getElementById(targetId) : null;

      burger.classList.toggle("is-active");
      if (target) {
        target.classList.toggle("is-active");
      }
    });
  });

  document.querySelectorAll(".navbar-item[href^='#']").forEach((item) => {
    item.addEventListener("click", () => {
      burgers.forEach((burger) => burger.classList.remove("is-active"));
      document.querySelectorAll(".navbar-menu").forEach((menu) => menu.classList.remove("is-active"));
    });
  });

  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const track = carousel.querySelector("[data-carousel-track]");
    const slides = Array.from(carousel.querySelectorAll(".demo-slide"));
    const previousButton = carousel.querySelector("[data-carousel-prev]");
    const nextButton = carousel.querySelector("[data-carousel-next]");
    const status = carousel.querySelector("[data-carousel-status]");
    let currentIndex = 0;

    if (!track || slides.length === 0) {
      return;
    }

    const updateCarousel = () => {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      slides.forEach((slide, index) => {
        const video = slide.querySelector("video");
        slide.classList.toggle("is-active", index === currentIndex);

        if (video && index !== currentIndex) {
          video.pause();
        }
      });

      if (status) {
        status.textContent = `${currentIndex + 1} / ${slides.length}`;
      }
    };

    previousButton?.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    });

    nextButton?.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    });

    updateCarousel();
  });
});
