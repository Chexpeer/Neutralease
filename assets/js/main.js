// ======================================================
// GESTION DU MENU MOBILE HAMBURGER
// ======================================================
function toggleMobileMenu() {
  const navMenu = document.getElementById('navMenu');
  if (navMenu) {
    navMenu.classList.toggle('mobile-open');
  }
}

// ======================================================
// GESTION DES DÉROULANTS SUR MOBILE / TACTILE
// ======================================================
function toggleDropdown(event, element) {
  if (window.innerWidth <= 992) {
    event.preventDefault();
    const parent = element.parentElement;
    parent.classList.toggle('open');
  }
}

// ======================================================
// CLINILEASE — ASSISTANT IA (ANALYSE DU CONTEXTE)
// ======================================================
document.addEventListener("DOMContentLoaded", () => {

  const analyzeBtn = document.getElementById("assistantAnalyzeBtn");
  const symptomsInput = document.getElementById("assistantSymptoms");
  const examsOutput = document.getElementById("assistantExamsContent");

  if (analyzeBtn) {
    analyzeBtn.addEventListener("click", () => {

      const text = symptomsInput.value.trim();

      // Vérification du texte
      if (text.length < 10) {
        examsOutput.innerHTML = `
          <p style="color:#f87171;">Veuillez décrire un contexte clinique plus détaillé.</p>
        `;
        return;
      }

      // Analyse IA simplifiée (offline)
      examsOutput.innerHTML = `
        <p><strong>Examens recommandés :</strong></p>
        <ul>
          <li>Radiographie thoracique</li>
          <li>Scanner (selon suspicion)</li>
          <li>Bilan sanguin standard</li>
        </ul>

        <p style="color:var(--text-muted); margin-top:8px;">
          Analyse IA simplifiée — version locale.
        </p>
      `;
    });
  }

});
