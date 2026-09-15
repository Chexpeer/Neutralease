/* ==========================================================================
   NEUTRALEASE - SCRIPT PRINCIPAL & GESTION MOBILE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
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
    const trigger = dropdown.querySelector('a');
    
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        if (window.innerWidth <= 900) {
          // Empêche le saut de page immédiat si le lien est juste un conteneur de sous-menu
          if (dropdown.querySelector('.dropdown-content')) {
            e.preventDefault();
            dropdown.classList.toggle('open');
          }
        }
      });
    }
  });

  // 3. Fermeture automatique du menu au clic à l'extérieur
  document.addEventListener('click', (e) => {
    if (navMenu && navMenu.classList.contains('active')) {
      if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        navMenu.classList.remove('active');
      }
    }
  });
});