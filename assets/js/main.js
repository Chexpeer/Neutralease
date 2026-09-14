/**
 * NeutralEase — Scripts globaux et fonctions interactives
 * Version: 2026.1
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initURLParamsPreFill();
  initDynamicCalculators();
});

/**
 * 1. Gestion du menu mobile (Toggle Responsive)
 */
function initMobileMenu() {
  const navContainer = document.querySelector('.nav-container');
  const navLinks = document.querySelector('.nav-links');

  if (!navContainer || !navLinks) return;

  // Création du bouton burger s'il n'existe pas
  if (!document.querySelector('.mobile-menu-btn')) {
    const btn = document.createElement('button');
    btn.className = 'mobile-menu-btn';
    btn.setAttribute('aria-label', 'Afficher le menu');
    btn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    `;
    
    btn.addEventListener('click', () => {
      navLinks.classList.toggle('nav-open');
    });

    navContainer.appendChild(btn);
  }
}

/**
 * 2. Pré-remplissage automatique des formulaires de contact via les paramètres d'URL
 * Exemple : contact.html?service=echolease&materiel=Echographe+Portable
 */
function initURLParamsPreFill() {
  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get('service');
  const materielParam = urlParams.get('materiel');
  const familleParam = urlParams.get('famille');

  // Remplissage du champ Service / Pilier
  if (serviceParam) {
    const serviceSelect = document.getElementById('select-service') || document.querySelector('select[name="service"]');
    if (serviceSelect) {
      serviceSelect.value = serviceParam;
    }
  }

  // Remplissage du champ Équipement / Matériel
  if (materielParam) {
    const materielInput = document.getElementById('input-materiel') || document.querySelector('input[name="materiel"]');
    if (materielInput) {
      materielInput.value = decodeURIComponent(materielParam);
    }
  }

  // Remplissage de la catégorie / famille
  if (familleParam) {
    const familleSelect = document.getElementById('select-famille') || document.querySelector('select[name="famille"]');
    if (familleSelect) {
      familleSelect.value = familleParam;
    }
  }
}

/**
 * 3. Simulateur de financement rapide (Utilitaires & Calculs ScoryLease)
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

    // Taux indicatif de souscription de bail médical (ajusté selon la durée)
    let tauxAnnuel = 0.045; // 4.5% par défaut
    if (dureeMois >= 60) tauxAnnuel = 0.052;
    if (dureeMois <= 24) tauxAnnuel = 0.038;

    const tauxMensuel = tauxAnnuel / 12;
    const mensualite = (montant * tauxMensuel) / (1 - Math.pow(1 + tauxMensuel, -dureeMois));

    displayMensualite.textContent = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(mensualite);
  }

  inputMontant?.addEventListener('input', calculerMensualite);
  selectDuree?.addEventListener('change', calculerMensualite);

  // Premier calcul au chargement
  calculerMensualite();
}