document.addEventListener("DOMContentLoaded", () => {

  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      mobileMenu.classList.toggle("open");
    });
  }

  // DROPDOWNS MOBILE PREMIUM
  const mobileDropdowns = document.querySelectorAll(".mobile-dropdown");

  mobileDropdowns.forEach(drop => {
    const btn = drop.querySelector("button");
    if (!btn) return;
    btn.addEventListener("click", () => {
      drop.classList.toggle("open");
    });
  });

});
