// ======================================================
// CLINILEASE — IA CLINIQUE NIVEAU 4 + ARBORESCENCE DYNAMIQUE
// ======================================================
document.addEventListener("DOMContentLoaded", () => {

  const analyzeBtn = document.getElementById("assistantAnalyzeBtn");
  const symptomsInput = document.getElementById("assistantSymptoms");
  const examsOutput = document.getElementById("assistantExamsContent");

  let step = 1;
  let speciality = "";
  let collectedData = {};

  if (!analyzeBtn) return;

  analyzeBtn.addEventListener("click", () => {

    const text = symptomsInput.value.trim().toLowerCase();

    // -----------------------------
    // ÉTAPE 1 — Analyse initiale
    // -----------------------------
    if (step === 1) {

      if (text.length < 10) {
        examsOutput.innerHTML = `<p style="color:#f87171;">Décrivez un contexte clinique plus détaillé.</p>`;
        return;
      }

      // Détection de spécialité
      if (text.includes("toux") || text.includes("dyspnée") || text.includes("respire mal")) speciality = "pneumo";
      else if (text.includes("douleur thoracique") || text.includes("palpitation")) speciality = "cardio";
      else if (text.includes("chute") || text.includes("fracture") || text.includes("trauma")) speciality = "trauma";
      else if (text.includes("douleur abdominale") || text.includes("abdomen")) speciality = "abdo";
      else if (text.includes("céphalée") || text.includes("vertige") || text.includes("perte de connaissance")) speciality = "neuro";
      else speciality = "general";

      collectedData.initial = text;

      // Question ciblée selon spécialité
      let question = "";

      if (speciality === "pneumo") question = "La fièvre est-elle présente ?";
      if (speciality === "cardio") question = "La douleur irradie-t-elle dans le bras ou la mâchoire ?";
      if (speciality === "trauma") question = "Y a-t-il une incapacité à mobiliser le membre ?";
      if (speciality === "abdo") question = "La douleur est-elle localisée à droite ou à gauche ?";
      if (speciality === "neuro") question = "Y a-t-il des troubles de la vision ou de la parole ?";
      if (speciality === "general") question = "Les symptômes sont-ils récents ou évolutifs ?";

      examsOutput.innerHTML = `
        <p><strong>Analyse initiale :</strong></p>
        <p>Spécialité probable : <strong>${speciality.toUpperCase()}</strong></p>
        <p><strong>Question IA :</strong> ${question}</p>
        <p style="color:var(--text-muted);">Répondez dans le champ ci-dessus puis cliquez à nouveau.</p>
      `;

      symptomsInput.value = "";
      step = 2;
      return;
    }

    // -----------------------------
    // ÉTAPE 2 — Analyse de la réponse
    // -----------------------------
    if (step === 2) {

      collectedData.answer = text;

      let examsPrimary = [];
      let examsSecondary = [];
      let modules = "";

      // Pneumo
      if (speciality === "pneumo") {
        if (text.includes("oui")) examsPrimary.push("Radiographie thoracique", "CRP", "NFS");
        else examsPrimary.push("Radiographie thoracique");
        examsSecondary.push("Scanner thoracique");
        modules = `
          <a href="pacs-cloud.html" class="btn-3d-compact btn-diag-bg">PACS Cloud →</a><br><br>
          <a href="ia-detection.html" class="btn-3d-compact btn-diag-bg">IA Détection →</a>
        `;
      }

      // Cardio
      if (speciality === "cardio") {
        examsPrimary.push("ECG", "Troponines");
        if (text.includes("oui")) examsSecondary.push("Scanner coronarien");
        modules = `
          <a href="ia-detection.html" class="btn-3d-compact btn-diag-bg">IA Détection →</a><br><br>
          <a href="stations-3d.html" class="btn-3d-compact btn-diag-bg">Stations 3D →</a>
        `;
      }

      // Trauma
      if (speciality === "trauma") {
        examsPrimary.push("Radiographie du segment concerné");
        if (text.includes("oui")) examsSecondary.push("Scanner", "IRM");
        modules = `
          <a href="ia-detection.html" class="btn-3d-compact btn-diag-bg">IA Détection →</a><br><br>
          <a href="stations-3d.html" class="btn-3d-compact btn-diag-bg">Stations 3D →</a>
        `;
      }

      // Abdomen
      if (speciality === "abdo") {
        examsPrimary.push("Échographie abdominale");
        if (text.includes("droite")) examsSecondary.push("Scanner abdomino‑pelvien");
        modules = `
          <a href="pacs-cloud.html" class="btn-3d-compact btn-diag-bg">PACS Cloud →</a>
        `;
      }

      // Neuro
      if (speciality === "neuro") {
        examsPrimary.push("Scanner cérébral");
        if (text.includes("oui")) examsSecondary.push("IRM cérébrale");
        modules = `
          <a href="pacs-cloud.html" class="btn-3d-compact btn-diag-bg">PACS Cloud →</a><br><br>
          <a href="stations-3d.html" class="btn-3d-compact btn-diag-bg">Stations 3D →</a>
        `;
      }

      // Général
      if (speciality === "general") {
        examsPrimary.push("Bilan sanguin standard");
        examsSecondary.push("Imagerie ciblée selon localisation");
        modules = `
          <a href="index.html" class="btn-3d-compact btn-diag-bg">CliniLease →</a>
        `;
      }

      // Rendu final
      examsOutput.innerHTML = `
        <p><strong>Analyse IA complète :</strong></p>

        <p><strong>Spécialité :</strong> ${speciality.toUpperCase()}</p>

        <p><strong>Examens prioritaires :</strong></p>
        <ul>${examsPrimary.map(e => `<li>${e}</li>`).join("")}</ul>

        <p><strong>Examens secondaires :</strong></p>
        <ul>${examsSecondary.map(e => `<li>${e}</li>`).join("")}</ul>

        <h3 style="margin-top:20px;">Modules recommandés :</h3>
        ${modules}

        <p style="color:var(--text-muted); margin-top:8px;">
          IA clinique dynamique — démo locale.
        </p>
      `;

      step = 3;
      return;
    }

  });

});
