/* =========================================================
   NEUTRALEASE - SCRIPT PRINCIPAL & AUDITEUR DE BUGS
========================================================= */

// 1. Navigation Mobile & Menu Hamburger
function toggleMobileMenu() {
  const navMenu = document.getElementById('navMenu');
  if (navMenu) {
    navMenu.classList.toggle('mobile-open');
  } else {
    console.error('[NeutralEase Debug] Erreur : L\'élément #navMenu est introuvable.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Gestion des sous-menus déroulants sur Mobile
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

  // 2. Diagnostic automatique (s'active avec ?debug=1 ou en local)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('debug') || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    runNeutralEaseHealthCheck();
  }
});

/* =========================================================
   MODULE DE DIAGNOSTIC AUTOMATIQUE (HEALTH CHECK)
========================================================= */
function runNeutralEaseHealthCheck() {
  const report = [];

  // Détection des liens obsolètes ou vides
  const links = document.querySelectorAll('a[href]');
  links.forEach(a => {
    const href = a.getAttribute('href');
    if (href.includes('diaglease')) {
      report.push(`❌ Lien obsolète détecté : "${href}" (remplacer par clinilease)`);
    }
    if (href === '#' && !a.onclick) {
      report.push(`⚠️ Lien vide non attribué sur : "${a.textContent.trim()}"`);
    }
  });

  // Détection des images manquantes
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!img.complete || img.naturalWidth === 0) {
      report.push(`🖼️ Image potentiellement cassée : ${img.getAttribute('src')}`);
    }
  });

  // Détection des structures requises
  if (!document.getElementById('navMenu')) report.push('🚫 Élément manquant : #navMenu');
  if (!document.querySelector('.header')) report.push('🚫 Élément manquant : .header');

  // Rapport dans la console et badge écran
  if (report.length > 0) {
    console.group('🔍 [NeutralEase Health Check Report]');
    report.forEach(err => console.warn(err));
    console.groupEnd();

    const badge = document.createElement('div');
    badge.style.cssText = 'position:fixed; bottom:10px; right:10px; background:#7f1d1d; color:#fff; padding:8px 12px; border-radius:6px; font-size:12px; font-weight:bold; z-index:99999; box-shadow:0 4px 12px rgba(0,0,0,0.5); cursor:pointer;';
    badge.innerHTML = `⚠️ Debug : ${report.length} anomalie(s) (Cliquer)`;
    badge.onclick = () => alert(report.join('\n\n'));
    document.body.appendChild(badge);
  } else {
    console.log('✅ [NeutralEase Health Check] Aucun problème détecté sur cette page.');
  }
}