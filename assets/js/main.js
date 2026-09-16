function initMenuMobile() {
  const hamburger = document.querySelector(".ne-hamburger");
  const mobileNav = document.querySelector(".ne-mobile-nav");

  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener("click", () => {
    mobileNav.classList.toggle("open");
  });

  const currentPath = window.location.pathname.toLowerCase();

  mobileNav.querySelectorAll(".ne-mobile-link").forEach((link) => {
    const href = (link.getAttribute("href") || "").toLowerCase();
    const cleanHref = href.replace(/^\//, "");
    if (currentPath.endsWith(cleanHref)) {
      link.classList.add("ne-mobile-link-active");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initMenuMobile();
});
