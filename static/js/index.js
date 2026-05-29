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
});
