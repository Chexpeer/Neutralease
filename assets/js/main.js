document.addEventListener("DOMContentLoaded", function() {
  const hamburgerBtn = document.querySelector(".hamburger-btn");
  const navMenu = document.querySelector(".nav-menu");

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener("click", function() {
      navMenu.classList.toggle("mobile-open");
      const expanded = hamburgerBtn.getAttribute("aria-expanded") === "true";
      hamburgerBtn.setAttribute("aria-expanded", !expanded);
    });
  }

  // Gestion des sous-menus au clic sur mobile
  const dropdownItems = document.querySelectorAll(".nav-item");
  dropdownItems.forEach(item => {
    const link = item.querySelector(".nav-link");
    if (link && item.querySelector(".dropdown-menu")) {
      link.addEventListener("click", function(e) {
        if (window.innerWidth <= 992) {
          e.preventDefault();
          item.classList.toggle("open");
        }
      });
    }
  });
});