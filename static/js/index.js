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

  const loadVideoSources = (video) => {
    video.querySelectorAll("source[data-src]").forEach((source) => {
      source.addEventListener("error", () => {
        video.dispatchEvent(new Event("error"));
      }, { once: true });
      source.src = source.dataset.src;
      source.removeAttribute("data-src");
    });

    video.load();
    const playPromise = video.play?.();
    if (playPromise) {
      playPromise.catch(() => {});
    }
  };

  const lazyVideos = Array.from(document.querySelectorAll("video")).filter((video) => (
    video.querySelector("source[data-src]")
  ));

  if ("IntersectionObserver" in window) {
    const lazyVideoObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        loadVideoSources(entry.target);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "300px 0px" });

    lazyVideos.forEach((video) => lazyVideoObserver.observe(video));
  } else {
    lazyVideos.forEach(loadVideoSources);
  }

  document.querySelectorAll("video").forEach((video) => {
    const container = video.closest(".demo-slide, .comparison-video-frame, .hero-video-shell");

    if (!container) {
      return;
    }

    const overlay = document.createElement("div");
    overlay.className = "video-loading-overlay";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML = '<span class="video-loading-spinner"></span><span>Loading video...</span>';
    container.appendChild(overlay);

    const setLoading = (isLoading) => {
      container.classList.toggle("is-video-loading", isLoading);
    };

    setLoading(video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA);

    video.addEventListener("loadeddata", () => setLoading(false));
    video.addEventListener("canplay", () => setLoading(false));
    video.addEventListener("playing", () => setLoading(false));
    video.addEventListener("waiting", () => setLoading(true));
    video.addEventListener("stalled", () => setLoading(true));
    video.addEventListener("error", () => setLoading(false));
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
