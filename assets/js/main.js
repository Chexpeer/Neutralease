/**
 * NeutralEase — Scripts globaux et fonctions interactives
 * Version: 2026.2 — VERSION STABLE
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initDropdownMobile();
  initURLParamsPreFill();
  initDynamicCalculators();
});

/**
 * 1. Gestion du menu mobile (Toggle Responsive)
 */
function initMobileMenu() {
  const navLinks = document.querySelector('.nav-links');
  const hamburger = document.querySelector('.hamburger');

  if (!navLinks || !hamburger) return;

  // Le hamburger existe déjà dans le HTML → on lui ajoute l’action
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

/**
 * Fonction appelée par le HTML (sécurité + compatibilité)
 */
function toggleMenu() {
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) {
    navLinks.classList.toggle('active');
  }
}

/**
 * 2. Dropdown mobile (ouvrir les sous‑menus sur mobile)
 */
function initDropdownMobile() {
  document.querySelectorAll('.dropdown > a').forEach(link => {
    link.addEventListener('click', function (e) {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        this.parentElement.classList.toggle('open');
      }
    });
  });
}

/**
 * 3. Pré-remplissage automatique des formulaires via les paramètres d'URL
 */
function initURLParamsPreFill() {
  const urlParams = new URLSearchParams(window.location.search);

  const serviceParam = urlParams.get('service');
  const materielParam = urlParams.get('materiel');
  const familleParam = urlParams.get('famille');

  if (serviceParam) {
    const serviceSelect =
      document.getElementById('select-service') ||
      document.querySelector('select[name="service"]');
    if (serviceSelect) serviceSelect.value = serviceParam;
  }

  if (materielParam) {
    const materielInput =
      document.getElementById('input-materiel') ||
      document.querySelector('input[name="materiel"]');
    if (materielInput) materielInput.value = decodeURIComponent(materielParam);
  }

  if (familleParam) {
    const familleSelect =
      document.getElementById('select-famille') ||
      document.querySelector('select[name="famille"]');
    if (familleSelect) familleSelect.value = familleParam;
  }
}

/**
 * 4. Simulateur ScoryLease — Calculateur dynamique
 */
function initDynamicCalculators() {
  const simuForm = document.getElementById('scorylease-form');
  if (!simuForm) return;

  const inputMontant = document.getElementById('simu-montant');
  const selectDuree = document.getElementById('simu-duree');
  const displayMensualite = document.getElementById('simu-resultat-mensualite');

  function calculerMensualite() {
    if (!inputMontant || !selectDuree || !displayMensualite) return;

    const montant = parseFloat(inputMontant.value) || 0;
    const dureeMois = parseInt(selectDuree.value, 10) || 36;

    if (montant <= 0) {
      displayMensualite.textContent = '0,00 €';
      return;
    }

    let tauxAnnuel = 0.045;
    if (dureeMois >= 60) tauxAnnuel = 0.052;
    if (dureeMois <= 24) tauxAnnuel = 0.038;

    const tauxMensuel = tauxAnnuel / 12;

    const mensualite =
      (montant * tauxMensuel) /
      (1 - Math.pow(1 + tauxMensuel, -dureeMois));

    displayMensualite.textContent = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(mensualite);
  }

  inputMontant?.addEventListener('input', calculerMensualite);
  selectDuree?.addEventListener('change', calculerMensualite);

  calculerMensualite();
}
