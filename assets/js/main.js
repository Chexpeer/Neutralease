/* ============================================================
   1 — INCLUDE AUTOMATIQUE DU HEADER (UNIVERSEL)
   ============================================================ */

async function includeHTML() {
  const includeTargets = document.querySelectorAll("[data-include]");
  for (const el of includeTargets) {
    const file = el.getAttribute("data-include");
    if (!file) continue;

    try {
      const html = await fetch(file).then(res => res.text());
      el.outerHTML = html;
    } catch (e) {
      console.error("Erreur include:", file, e);
    }
  }
}

includeHTML().then(() => {
  initMenuMobile();
  initAssistantFloatButton();
});


/* ============================================================
   2 — MENU MOBILE (HAMBURGER)
   ============================================================ */

function initMenuMobile() {
  const hamburger = document.querySelector(".ne-hamburger");
  const mobileNav = document.querySelector(".ne-mobile-nav");

  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener("click", () => {
    mobileNav.classList.toggle("open");
  });
}


/* ============================================================
   3 — BOUTON FLOTTANT ASSISTANT IA
   ============================================================ */

function initAssistantFloatButton() {
  const floatButtons = document.querySelectorAll(".assistant-float-btn");

  floatButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetPage = btn.getAttribute("data-target-page") || "/diaglease/index.html";
      const targetAnchor = btn.getAttribute("data-target-anchor") || "#assistant-ia";

      const currentPath = window.location.pathname.toLowerCase();

      if (currentPath.includes("diaglease")) {
        const targetEl = document.querySelector(targetAnchor);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        window.location.href = `${targetPage}${targetAnchor}`;
      }
    });
  });

  // Scroll auto si hash présent
  const hash = window.location.hash;
  if (hash && document.querySelector(hash)) {
    setTimeout(() => {
      document.querySelector(hash).scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  }
}


/* ============================================================
   4 — MODULE ASSISTANT IA (SI PRÉSENT)
   ============================================================ */

function initAssistantIA() {
  const card = document.querySelector(".assistant-ia-card");
  if (!card) return;

  const step1 = card.querySelector(".assistant-step-1");
  const step2 = card.querySelector(".assistant-step-2");
  const step3 = card.querySelector(".assistant-step-3");

  const symptomsInput = document.getElementById("assistantSymptoms");
  const analyzeBtn = document.getElementById("assistantAnalyzeBtn");
  const examsContent = document.getElementById("assistantExamsContent");
  const nextEquipBtn = document.getElementById("assistantNextEquipBtn");
  const equipContent = document.getElementById("assistantEquipContent");

  setActiveStep(card, step1, "vertical");

  if (analyzeBtn) {
    analyzeBtn.addEventListener("click", () => {
      const text = (symptomsInput.value || "").toLowerCase();
      examsContent.innerHTML = buildExamsFromSymptoms(text);
      setActiveStep(card, step2, "horizontal");
    });
  }

  if (nextEquipBtn) {
    nextEquipBtn.addEventListener("click", () => {
      const text = (symptomsInput.value || "").toLowerCase();
      equipContent.innerHTML = buildEquipFromSymptoms(text);
      setActiveStep(card, step3, "horizontal");
    });
  }
}

function setActiveStep(card, stepElement, mode) {
  const steps = card.querySelectorAll(".assistant-step");
  steps.forEach((s) => {
    s.classList.remove("active", "assistant-step-enter-vertical", "assistant-step-enter-horizontal");
  });

  stepElement.classList.add("active");
  stepElement.classList.add(
    mode === "vertical"
      ? "assistant-step-enter-vertical"
      : "assistant-step-enter-horizontal"
  );
}


/* ============================================================
   5 — IA PÉDAGOGIQUE (EXAMENS)
   ============================================================ */

function buildExamsFromSymptoms(text) {
  let html = "";

  if (!text.trim()) {
    return `
      <p>
        Pour proposer des examens pertinents, l’assistant IA a besoin d’un minimum de contexte clinique.
      </p>
      <p>
        Exemple : <em>Douleur thoracique depuis 2 jours, irradiant dans le bras gauche, fatigue, essoufflement.</em>
      </p>
    `;
  }

  const isCardio = text.includes("thorac") || text.includes("coeur") || text.includes("cardio");
  const isNeuro = text.includes("céphal") || text.includes("migraine") || text.includes("neurolog");
  const isResp = text.includes("toux") || text.includes("respir") || text.includes("poumon");

  html += `<p>Voici les examens les plus utiles dans ce type de contexte :</p><ul>`;

  if (isCardio) {
    html += `
      <li><strong>ECG :</strong> rapide, non invasif, utile pour analyser le rythme cardiaque.</li>
      <li><strong>Échographie cardiaque :</strong> visualisation en temps réel des structures du cœur.</li>
    `;
  }

  if (isResp) {
    html += `
      <li><strong>Imagerie thoracique :</strong> radiographie ou scanner pour explorer les poumons.</li>
      <li><strong>Oxymétrie :</strong> mesure de la saturation en oxygène.</li>
    `;
  }

  if (isNeuro) {
    html += `
      <li><strong>IRM ou scanner cérébral :</strong> utile en cas de céphalées atypiques ou signes neurologiques.</li>
    `;
  }

  if (!isCardio && !isResp && !isNeuro) {
    html += `
      <li><strong>Bilan clinique :</strong> examen physique complet et prise de constantes.</li>
      <li><strong>Examens ciblés :</strong> selon la spécialité concernée.</li>
    `;
  }

  html += `</ul>`;
  return html;
}


/* ============================================================
   6 — IA PÉDAGOGIQUE (ÉQUIPEMENTS)
   ============================================================ */

function buildEquipFromSymptoms(text) {
  let html = "<p>Équipements adaptés :</p><ul>";

  const isCardio = text.includes("thorac") || text.includes("coeur") || text.includes("cardio");
  const isNeuro = text.includes("céphal") || text.includes("migraine") || text.includes("neurolog");
  const isResp = text.includes("toux") || text.includes("respir") || text.includes("poumon");

  if (isCardio) {
    html += `
      <li><strong>Échographes cardiaques (EchoLease)</strong></li>
      <li><strong>ECG de diagnostic (DiagLease)</strong></li>
      <li><strong>Holter ECG</strong></li>
    `;
  }

  if (isResp) {
    html += `
      <li><strong>Imagerie thoracique (DiagLease / RecupLease)</strong></li>
      <li><strong>Oxymètres de pouls</strong></li>
    `;
  }

  if (isNeuro) {
    html += `
      <li><strong>IRM / Scanner (DiagLease)</strong></li>
      <li><strong>PACS cloud</strong></li>
    `;
  }

  if (!isCardio && !isResp && !isNeuro) {
    html += `
      <li><strong>Plateaux polyvalents (DiagLease)</strong></li>
      <li><strong>Équipements reconditionnés (RecupLease)</strong></li>
    `;
  }

  html += "</ul>";
  return html;
}
