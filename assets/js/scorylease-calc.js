/**
 * NeutralEase — Engine de Calcul & Scoring ScoryLease
 * Fichier: /assets/js/scorylease-calc.js
 * Version: 2026.1 — VERSION CORRIGÉE
 */

document.addEventListener('DOMContentLoaded', () => {
  initScoryLeaseCalculator();
});

/**
 * Initialisation du simulateur ScoryLease
 */
function initScoryLeaseCalculator() {
  const form = document.getElementById('scorylease-advanced-form');
  if (!form) return;

  // Champs du formulaire
  const inputMontant = document.getElementById('sl-montant');
  const rangeMontant = document.getElementById('sl-montant-range');
  const selectDuree = document.getElementById('sl-duree');
  const selectStructure = document.getElementById('sl-structure');
  const inputAnciennete = document.getElementById('sl-anciennete');
  const checkReprise = document.getElementById('sl-reprise-check');
  const inputValeurReprise = document.getElementById('sl-valeur-reprise');
  const containerReprise = document.getElementById('sl-reprise-container');

  // Résultats
  const outputMensualite = document.getElementById('sl-result-mensualite');
  const outputMontantNett = document.getElementById('sl-result-net');
  const outputTauxAffiche = document.getElementById('sl-result-taux');
  const outputScoreBadge = document.getElementById('sl-result-score-badge');
  const outputScoreText = document.getElementById('sl-result-score-text');

  /**
   * Synchronisation Slider ↔ Input Montant
   */
  if (inputMontant && rangeMontant) {
    inputMontant.addEventListener('input', (e) => {
      rangeMontant.value = e.target.value;
      recalculer();
    });

    rangeMontant.addEventListener('input', (e) => {
      inputMontant.value = e.target.value;
      recalculer();
    });
  }

  /**
   * Affichage dynamique du champ "Valeur de reprise"
   */
  if (checkReprise && containerReprise) {
    checkReprise.addEventListener('change', (e) => {
      containerReprise.style.display = e.target.checked ? 'block' : 'none';

      if (!e.target.checked && inputValeurReprise) {
        inputValeurReprise.value = 0;
      }

      recalculer();
    });
  }

  /**
   * Écoute des changements sur tous les champs
   */
  [selectDuree, selectStructure, inputAnciennete, inputValeurReprise].forEach(el => {
    el?.addEventListener('change', recalculer);
    el?.addEventListener('input', recalculer);
  });

  /**
   * Fonction principale de calcul
   */
  function recalculer() {
    const montantBrut = parseFloat(inputMontant?.value) || 0;
    const valeurReprise = checkReprise?.checked ? (parseFloat(inputValeurReprise?.value) || 0) : 0;
    const montantNet = Math.max(0, montantBrut - valeurReprise);

    const dureeMois = parseInt(selectDuree?.value, 10) || 36;
    const ancienneteAns = parseFloat(inputAnciennete?.value) || 0;
    const structure = selectStructure?.value || 'liberal';

    // Cas montant invalide
    if (montantNet <= 0) {
      updateUI({
        mensualite: 0,
        montantNet: 0,
        taux: 0,
        score: 'N/A',
        scoreClass: 'badge-recuplease',
        scoreMsg: 'Veuillez saisir un montant d’équipement valide.'
      });
      return;
    }

    /**
     * 1. Détermination du taux annuel
     */
    let tauxAnnuelBase = 0.045; // 4.5% standard

    if (dureeMois <= 24) tauxAnnuelBase = 0.039;
    else if (dureeMois <= 48) tauxAnnuelBase = 0.044;
    else if (dureeMois >= 60) tauxAnnuelBase = 0.051;

    // Ajustement selon structure
    if (structure === 'creation') tauxAnnuelBase += 0.008;
    if (structure === 'chu_clinique') tauxAnnuelBase -= 0.004;

    /**
     * 2. Calcul de la mensualité (amortissement constant)
     */
    const tauxMensuel = tauxAnnuelBase / 12;

    const mensualite =
      (montantNet * tauxMensuel) /
      (1 - Math.pow(1 + tauxMensuel, -dureeMois));

    /**
     * 3. Calcul du score ScoryLease (0 à 100)
     */
    let score = 70;

    // Ancienneté
    if (ancienneteAns >= 5) score += 15;
    else if (ancienneteAns >= 2) score += 10;
    else if (ancienneteAns < 1) score -= 15;

    // Montant
    if (montantNet < 30000) score += 10;
    else if (montantNet > 150000) score -= 10;

    // Structure
    if (structure === 'chu_clinique' || structure === 'selarl') score += 10;
    if (structure === 'creation') score -= 10;

    // Bornage
    score = Math.min(99, Math.max(15, score));

    /**
     * 4. Classification du score
     */
    let scoreClass = 'badge-dentalease';
    let scoreMsg = 'Excellente éligibilité — Validation rapide sous 24h.';

    if (score < 50) {
      scoreClass = 'badge-recuplease';
      scoreMsg = 'Dossier nécessitant une étude manuelle ou un apport complémentaire.';
    } else if (score < 75) {
      scoreClass = 'badge-echolease';
      scoreMsg = 'Bonne éligibilité — Pièces justificatives standards requises.';
    }

    /**
     * 5. Mise à jour de l’UI
     */
    updateUI({
      mensualite,
      montantNet,
      taux: (tauxAnnuelBase * 100).toFixed(2),
      score: `${score}/100`,
      scoreClass,
      scoreMsg
    });
  }

  /**
   * Mise à jour du DOM
   */
  function updateUI(data) {
    if (outputMensualite) {
      outputMensualite.textContent = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(data.mensualite);
    }

    if (outputMontantNett) {
      outputMontantNett.textContent = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(data.montantNet);
    }

    if (outputTauxAffiche) {
      outputTauxAffiche.textContent = `${data.taux} %`;
    }

    if (outputScoreBadge) {
      outputScoreBadge.textContent = data.score;
      outputScoreBadge.className = `badge ${data.scoreClass}`;
    }

    if (outputScoreText) {
      outputScoreText.textContent = data.scoreMsg;
    }
  }

  // Premier calcul au chargement
  recalculer();
}
