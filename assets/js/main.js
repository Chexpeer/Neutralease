
/* ==========================================================================
   NEUTRALEASE - SCRIPT PRINCIPAL & GESTION MOBILE (VERSION CORRIGÉE)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-links');
  const dropdowns = document.querySelectorAll('.dropdown');

  // 1. Bascule du menu mobile principal (Hamburger)
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('active');
    });
  }

  // 2. Gestion du clic sur les menus déroulants en version mobile
  dropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector(':scope > a');
    
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        if (window.innerWidth <= 900) {
          const subMenu = dropdown.querySelector('.dropdown-content');
          if (subMenu) {
            e.preventDefault();
            dropdown.classList.toggle('open');
          }
        }
      });
    }
  });

  // 3. Fermeture du menu lors du clic sur un lien final de sous-menu
  const subMenuLinks = document.querySelectorAll('.dropdown-content a');
  subMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu && window.innerWidth <= 900) {
        navMenu.classList.remove('active');
      }
    });
  });

  // 4. Fermeture automatique du menu au clic à l'extérieur
  document.addEventListener('click', (e) => {
    if (navMenu && navMenu.classList.contains('active')) {
      if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        navMenu.classList.remove('active');
      }
    }
  });
});
