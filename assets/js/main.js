// js/main.js

// HAMBURGER MOBILE
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".ne-hamburger");
  const mobileNav = document.querySelector(".ne-mobile-nav");

  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", () => {
      mobileNav.classList.toggle("open");
    });
  }

  // BOUTONS FLOTTANTS ASSISTANT IA (ACCUEIL + DIAGLEASE)
  const floatButtons = document.querySelectorAll(".assistant-float-btn");

  floatButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetPage = btn.getAttribute("data-target-page") || "diaglease.html";
      const targetAnchor = btn.getAttribute("data-target-anchor") || "#assistant-ia";

      // Si on est déjà sur la page DiagLease, scroll direct
      const currentPath = window.location.pathname.toLowerCase();
      if (currentPath.includes("diaglease")) {
        const targetEl = document.querySelector(targetAnchor);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        // Redirection vers DiagLease avec hash
        window.location.href = `${targetPage}${targetAnchor}`;
      }
    });
  });

  // SCROLL AUTOMATIQUE LORS DE L’ARRIVÉE SUR DIAGLEASE AVEC HASH
  if (window.location.pathname.toLowerCase().includes("diaglease")) {
    const hash = window.location.hash;
    if (hash === "#assistant-ia") {
      const targetEl = document.querySelector(hash);
      if (targetEl) {
        setTimeout(() => {
          targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 300);
      }
    }
  }

  // LOGIQUE ASSISTANT IA (CARTE DYNAMIQUE, TON PÉDAGOGIQUE)
  const assistantCard = document.querySelector(".assistant-ia-card");
  if (assistantCard) {
    const step1 = assistantCard.querySelector(".assistant-step-1");
    const step2 = assistantCard.querySelector(".assistant-step-2");
    const step3 = assistantCard.querySelector(".assistant-step-3");

    const symptomsInput = document.getElementById("assistantSymptoms");
    const analyzeBtn = document.getElementById("assistantAnalyzeBtn");
    const examsContent = document.getElementById("assistantExamsContent");
    const nextEquipBtn = document.getElementById("assistantNextEquipBtn");
    const equipContent = document.getElementById("assistantEquipContent");

    // INIT : afficher étape 1
    setActiveStep(assistantCard, step1, "vertical");

    if (analyzeBtn && symptomsInput && examsContent) {
      analyzeBtn.addEventListener("click", () => {
        const text = (symptomsInput.value || "").toLowerCase();

        const exams = buildExamsFromSymptoms(text);
        examsContent.innerHTML = exams;

        setActiveStep(assistantCard, step2, "horizontal");
      });
    }

    if (nextEquipBtn && equipContent) {
      nextEquipBtn.addEventListener("click", () => {
        const text = (symptomsInput.value || "").toLowerCase();

        const equip = buildEquipFromSymptoms(text);
        equipContent.innerHTML = equip;

        setActiveStep(assistantCard, step3, "horizontal");
      });
    }
  }
});

// FONCTION POUR GÉRER LES ÉTAPES + ANIMATIONS
function setActiveStep(card, stepElement, mode) {
  const steps = card.querySelectorAll(".assistant-step");
  steps.forEach((s) => {
    s.classList.remove("active", "assistant-step-enter-vertical", "assistant-step-enter-horizontal");
  });

  stepElement.classList.add("active");
  if (mode === "vertical") {
    stepElement.classList.add("assistant-step-enter-vertical");
  } else {
    stepElement.classList.add("assistant-step-enter-horizontal");
  }
}

// IA PÉDAGOGIQUE SIMPLIFIÉE — EXAMENS
function buildExamsFromSymptoms(text) {
  let html = "";

  if (!text.trim()) {
    html += `
      <p>
        Pour proposer des examens pertinents, l’assistant IA a besoin d’un minimum de contexte clinique.
        Vous pouvez par exemple préciser la durée des symptômes, leur intensité, la localisation, et la spécialité concernée.
      </p>
      <p>
        Exemple : <em>Douleur thoracique depuis 2 jours, irradiant dans le bras gauche, fatigue, essoufflement, patient de 58 ans, suivi en cardiologie.</em>
      </p>
    `;
    return html;
  }

  // Quelques mots-clés simples pour adapter le discours
  const isCardio =
    text.includes("thorac") ||
    text.includes("coeur") ||
    text.includes("cardio") ||
    text.includes("essoufflement") ||
    text.includes("dyspnée");

  const isNeuro =
    text.includes("céphal") ||
    text.includes("migraine") ||
    text.includes("vertige") ||
    text.includes("paralys") ||
    text.includes("neurolog");

  const isResp =
    text.includes("toux") ||
    text.includes("dyspnée") ||
    text.includes("respir") ||
    text.includes("poumon") ||
    text.includes("thoracique");

  html += `<p>À partir des éléments que vous avez décrits, certains examens peuvent aider à mieux comprendre la situation clinique.</p>`;

  html += `<ul>`;

  if (isCardio) {
    html += `
      <li>
        <strong>ECG :</strong> examen rapide et non invasif qui permet de vérifier l’activité électrique du cœur
        et de détecter d’éventuelles anomalies du rythme ou de la conduction.
      </li>
      <li>
        <strong>Échographie cardiaque :</strong> visualise les structures du cœur en temps réel et aide à comprendre
        l’origine possible de la douleur ou de l’essoufflement.
      </li>
    `;
  }

  if (isResp) {
    html += `
      <li>
        <strong>Imagerie thoracique (radiographie ou scanner) :</strong> permet d’explorer le poumon et la cage thoracique
        en cas de douleur, toux ou gêne respiratoire.
      </li>
      <li>
        <strong>Oxymétrie de pouls :</strong> mesure simple de la saturation en oxygène, utile pour suivre l’état respiratoire.
      </li>
    `;
  }

  if (isNeuro) {
    html += `
      <li>
        <strong>Imagerie cérébrale (IRM ou scanner) :</strong> peut être indiquée en cas de céphalées atypiques,
        de troubles neurologiques ou de signes d’alerte.
      </li>
      <li>
        <strong>Évaluation neurologique clinique :</strong> reste essentielle pour orienter les examens complémentaires.
      </li>
    `;
  }

  // Cas générique si aucun mot-clé spécifique
  if (!isCardio && !isResp && !isNeuro) {
    html += `
      <li>
        <strong>Bilan clinique de base :</strong> examen physique complet, prise de constantes, et recueil détaillé de l’histoire des symptômes.
      </li>
      <li>
        <strong>Examens complémentaires ciblés :</strong> selon la spécialité (cardiologie, pneumologie, neurologie, etc.),
        des examens d’imagerie ou de biologie peuvent être proposés.
      </li>
    `;
  }

  html += `</ul>`;

  html += `
    <p>
      Ces suggestions restent générales et ne remplacent pas une décision médicale individuelle.
      Elles visent à aider à structurer la réflexion et à identifier les examens les plus fréquents dans ce type de contexte.
    </p>
  `;

  return html;
}

// IA PÉDAGOGIQUE SIMPLIFIÉE — ÉQUIPEMENTS / LEASING
function buildEquipFromSymptoms(text) {
  let html = "";

  const isCardio =
    text.includes("thorac") ||
    text.includes("coeur") ||
    text.includes("cardio") ||
    text.includes("essoufflement") ||
    text.includes("dyspnée");

  const isNeuro =
    text.includes("céphal") ||
    text.includes("migraine") ||
    text.includes("vertige") ||
    text.includes("paralys") ||
    text.includes("neurolog");

  const isResp =
    text.includes("toux") ||
    text.includes("dyspnée") ||
    text.includes("respir") ||
    text.includes("poumon") ||
    text.includes("thoracique");

  html += `
    <p>
      Pour réaliser les examens évoqués, certains équipements de diagnostic peuvent être particulièrement adaptés.
      L’objectif de DiagLease est de vous permettre d’y accéder via des solutions de leasing flexibles,
      en cohérence avec votre pratique et votre volume d’activité.
    </p>
  `;

  html += `<ul>`;

  if (isCardio) {
    html += `
      <li>
        <strong>Échographes cardiaques (EchoLease) :</strong> pour l’exploration fonctionnelle du cœur, en consultation ou en structure spécialisée.
      </li>
      <li>
        <strong>ECG de diagnostic (DiagLease) :</strong> systèmes d’ECG 12 dérivations, avec options d’analyse assistée.
      </li>
      <li>
        <strong>Holter ECG :</strong> utile pour le suivi du rythme cardiaque sur 24h ou plus.
      </li>
    `;
  }

  if (isResp) {
    html += `
      <li>
        <strong>Imagerie thoracique (DiagLease / RecupLease) :</strong> radiographie ou scanner, selon le niveau d’équipement de la structure.
      </li>
      <li>
        <strong>Oxymètres de pouls :</strong> dispositifs simples pour suivre la saturation en oxygène au quotidien.
      </li>
    `;
  }

  if (isNeuro) {
    html += `
      <li>
        <strong>Imagerie cérébrale (DiagLease) :</strong> IRM ou scanner, selon les indications et le plateau technique disponible.
      </li>
      <li>
        <strong>Solutions d’archivage et de visualisation (PACS) :</strong> pour centraliser les examens d’imagerie et faciliter leur lecture.
      </li>
    `;
  }

  if (!isCardio && !isResp && !isNeuro) {
    html += `
      <li>
        <strong>Plateaux de diagnostic polyvalents (DiagLease) :</strong> combinant imagerie, monitoring et outils de mesure,
        adaptés aux structures pluridisciplinaires.
      </li>
      <li>
        <strong>Équipements reconditionnés (RecupLease) :</strong> pour optimiser le budget tout en conservant une qualité d’examen élevée.
      </li>
    `;
  }

  html += `</ul>`;

  html += `
    <p>
      Pour explorer plus en détail les équipements disponibles, vous pouvez consulter les sections
      <strong>DiagLease</strong>, <strong>EchoLease</strong>, <strong>DentalLease</strong> et <strong>RecupLease</strong>.
      L’assistant IA reste une aide à la réflexion : la décision finale dépend de votre contexte clinique,
      de votre organisation et des recommandations en vigueur.
    </p>
  `;

  return html;
}
