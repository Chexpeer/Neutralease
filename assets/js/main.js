/* =========================================================
   NEUTRALEASE HUB — SCRIPT PRINCIPAL UNIFIÉ (assets/js/main.js)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initActiveNavLinks();
  initUrlParamsFormHandling();

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('debug') || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    runNeutralEaseHealthCheck();
  }
});

/**
 * 1. Gestion du Menu Mobile Hamburger & Dropdowns
 */
function toggleMobileMenu() {
  const navMenu = document.getElementById('navMenu');
  const hamburgerBtn = document.querySelector('.hamburger-btn') || document.querySelector('.hamburger');

  if (navMenu) {
    navMenu.classList.toggle('active');
    navMenu.classList.toggle('mobile-open');
    
    if (hamburgerBtn) {
      const isOpen = navMenu.classList.contains('active') || navMenu.classList.contains('mobile-open');
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
      hamburgerBtn.classList.toggle('active', isOpen);
    }
  }
}

function initMobileMenu() {
  const hamburgerBtn = document.querySelector('.hamburger-btn') || document.querySelector('.hamburger');
  const navMenu = document.getElementById('navMenu');

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  document.addEventListener('click', (e) => {
    if (navMenu && (navMenu.classList.contains('active') || navMenu.classList.contains('mobile-open'))) {
      if (!navMenu.contains(e.target) && (!hamburgerBtn || !hamburgerBtn.contains(e.target))) {
        navMenu.classList.remove('active');
        navMenu.classList.remove('mobile-open');
        if (hamburgerBtn) {
          hamburgerBtn.setAttribute('aria-expanded', 'false');
          hamburgerBtn.classList.remove('active');
        }
      }
    }
  });

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

/**
 * 4. Outil de diagnostic automatique des anomalies web
 */
function runNeutralEaseHealthCheck() {
  const report = [];

  const links = document.querySelectorAll('a[href]');
  links.forEach(a => {
    const href = a.getAttribute('href');
    if (href.includes('diaglease')) {
      report.push(`❌ Lien obsolète : "${href}" (remplacer par clinilease)`);
    }
  });

  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!img.complete || img.naturalWidth === 0) {
      report.push(`🖼️ Image potentiellement cassée : ${img.getAttribute('src')}`);
    }
  });

  if (!document.getElementById('navMenu')) report.push('🚫 Élément manquant : #navMenu');

  if (report.length > 0) {
    console.group('🔍 [NeutralEase Health Check]');
    report.forEach(err => console.warn(err));
    console.groupEnd();
  }
}