// GESTION DU MENU MOBILE HAMBURGER
function toggleMobileMenu() {
  const navMenu = document.getElementById('navMenu');
  if (navMenu) {
    navMenu.classList.toggle('mobile-open');
  }
}

// GESTION DES DÉROULANTS SUR MOBILE / TACTILE
function toggleDropdown(event, element) {
  if (window.innerWidth <= 992) {
    event.preventDefault();
    const parent = element.parentElement;
    parent.classList.toggle('open');
  }
}