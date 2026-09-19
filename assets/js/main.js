/* =========================================================
   NEUTRALEASE HUB — SCRIPT PRINCIPAL UNIFIÉ (assets/js/main.js)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initActiveNavLinks();
  initUrlParamsFormHandling();
});

/**
 * 1. Gestion du Menu Mobile Hamburger & Dropdowns
 */
function toggleMobileMenu() {
  const navMenu = document.getElementById('navMenu');
  const hamburgerBtn = document.querySelector('.hamburger-btn');

  if (navMenu) {
    // Bascule des classes d'affichage
    const willOpen = !navMenu.classList.contains('active');
    
    if (willOpen) {
      navMenu.classList.add('active', 'mobile-open');
    } else {
      navMenu.classList.remove('active', 'mobile-open');
    }
    
    if (hamburgerBtn) {
      hamburgerBtn.setAttribute('aria-expanded', willOpen);
      hamburgerBtn.classList.toggle('active', willOpen);
    }
  }
}

function initMobileMenu() {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const navMenu = document.getElementById('navMenu');

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  // Fermeture au clic en dehors du menu
  document.addEventListener('click', (e) => {
    if (navMenu && (navMenu.classList.contains('active') || navMenu.classList.contains('mobile-open'))) {
      if (!navMenu.contains(e.target) && (!hamburgerBtn || !hamburgerBtn.contains(e.target))) {
        navMenu.classList.remove('active', 'mobile-open');
        if (hamburgerBtn) {
          hamburgerBtn.setAttribute('aria-expanded', 'false');
          hamburgerBtn.classList.remove('active');
        }
      }
    }
  });

  // Gestion des sous-menus au clic sur mobile
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    const dropdown = item.querySelector('.dropdown-menu');

    if (dropdown && link) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 992) {
          if (link.getAttribute('href') === '#' || link.getAttribute('href') === '') {
            e.preventDefault();
          }
          item.classList.toggle('open');
        }
      });
    }
  });
}

/**
 * 2. Surlignage automatique du lien actif
 */
function initActiveNavLinks() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-menu a');

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    const cleanHref = href.replace('../', '').replace('./', '');
    if (currentPath.includes(cleanHref) && cleanHref !== '') {
      link.classList.add('active');
      const parentDropdown = link.closest('.dropdown-menu');
      if (parentDropdown) {
        const parentNavItem = parentDropdown.closest('.nav-item');
        if (parentNavItem) {
          const parentLink = parentNavItem.querySelector('.nav-link');
          if (parentLink) parentLink.classList.add('active');
        }
      }
    }
  });
}

/**
 * 3. Pré-remplissage du formulaire via l'URL
 */
function initUrlParamsFormHandling() {
  const briqueSelect = document.getElementById('brique');
  const profilSelect = document.getElementById('profil');

  if (!briqueSelect && !profilSelect) return;

  const urlParams = new URLSearchParams(window.location.search);
  const briqueParam = urlParams.get('brique');
  const profilParam = urlParams.get('profil');

  if (briqueParam && briqueSelect) {
    const opt = briqueSelect.querySelector(`option[value="${briqueParam}"]`);
    if (opt) briqueSelect.value = briqueParam;
  }

  if (profilParam && profilSelect) {
    const opt = profilSelect.querySelector(`option[value="${profilParam}"]`);
    if (opt) profilSelect.value = profilParam;
  }
}