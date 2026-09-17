// ======================================================
// CLINILEASE — IA CLINIQUE NIVEAU 4 (MOTEUR LOCAL)
// ======================================================
document.addEventListener("DOMContentLoaded", () => {

  const analyzeBtn = document.getElementById("assistantAnalyzeBtn");
  const symptomsInput = document.getElementById("assistantSymptoms");
  const examsOutput = document.getElementById("assistantExamsContent");

  if (!analyzeBtn) return;

  analyzeBtn.addEventListener("click", () => {
    const textRaw = symptomsInput.value.trim();
    const text = textRaw.toLowerCase();

    if (text.length < 10) {
      examsOutput.innerHTML = `
        <p style="color:#f87171;">Veuillez décrire un contexte clinique plus détaillé.</p>
      `;
      return;
    }

    // --------- MOTEUR DE RÈGLES ---------
    const findings = [];
    const examsPrimary = [];
    const examsSecondary = [];
    let speciality = [];
    let severityScore = 0;

    function addFinding(label, score = 1) {
      findings.push(label);
      severityScore += score;
    }
    function addExamPrimary(label) {
      if (!examsPrimary.includes(label)) examsPrimary.push(label);
    }
    function addExamSecondary(label) {
      if (!examsSecondary.includes(label)) examsSecondary.push(label);
    }
    function addSpeciality(label) {
      if (!speciality.includes(label)) speciality.push(label);
    }

    // RESPIRATOIRE
    if (text.includes("toux") || text.includes("dyspnée") || text.includes("respire mal") || text.includes("opacité")) {
      addSpeciality("Pneumologie");
      addFinding("Symptomatologie respiratoire");
      addExamPrimary("Radiographie thoracique");
      addExamSecondary("Scanner thoracique");
    }
    if (text.includes("saturation") || text.includes("hypoxie")) {
      addFinding("Atteinte respiratoire potentielle");
      severityScore += 2;
      addExamPrimary("Oxymétrie / Gaz du sang");
    }

    // CARDIO
    if (text.includes("douleur thoracique") || text.includes("thorax") || text.includes("palpitation")) {
      addSpeciality("Cardiologie");
      addFinding("Douleur thoracique / suspicion cardio");
      addExamPrimary("ECG");
      addExamPrimary("Troponines");
      addExamSecondary("Échographie cardiaque");
    }

    // TRAUMA
    if (text.includes("chute") || text.includes("trauma") || text.includes("fracture") || text.includes("douleur osseuse")) {
      addSpeciality("Traumatologie");
      addFinding("Traumatisme / suspicion lésion osseuse");
      addExamPrimary("Radiographie du segment concerné");
      addExamSecondary("Scanner si fracture complexe");
    }

    // ABDOMEN
    if (text.includes("douleur abdominale") || text.includes("abdomen") || text.includes("nausée") || text.includes("vomissement")) {
      addSpeciality("Digestif / Abdomen");
      addFinding("Symptomatologie abdominale");
      addExamPrimary("Échographie abdominale");
      addExamSecondary("Scanner abdomino‑pelvien");
    }

    // NEURO
    if (text.includes("céphalée") || text.includes("vertige") || text.includes("perte de connaissance") || text.includes("neurologique")) {
      addSpeciality("Neurologie");
      addFinding("Symptômes neurologiques");
      addExamPrimary("Scanner cérébral");
      addExamSecondary("IRM cérébrale");
    }

    // INFECTIEUX
    if (text.includes("fièvre") || text.includes("infection") || text.includes("frisson")) {
      addSpeciality("Infectiologie");
      addFinding("Contexte infectieux probable");
      addExamPrimary("NFS");
      addExamPrimary("CRP");
      addExamSecondary("Hémocultures");
    }

    // SI RIEN DE CLAIR
    if (findings.length === 0) {
      addSpeciality("Général / Indéterminé");
      addFinding("Contexte clinique non spécifique");
      addExamPrimary("Bilan sanguin standard");
      addExamSecondary("Imagerie ciblée selon localisation");
    }

    // --------- SCORE DE GRAVITÉ (DÉMO) ---------
    let severityLabel = "Faible";
    if (severityScore >= 3 && severityScore < 6) severityLabel = "Modérée";
    if (severityScore >= 6) severityLabel = "Potentiellement élevée";

    // --------- RENDU STRUCTURÉ ---------
    examsOutput.innerHTML = `
      <p><strong>Analyse IA (démo locale) :</strong></p>
      <p><strong>Spécialités impliquées :</strong> ${speciality.join(" / ")}</p>
      <p><strong>Contexte clinique détecté :</strong></p>
      <ul>
        ${findings.map(f => `<li>${f}</li>`).join("")}
      </ul>
      <p><strong>Examens prioritaires :</strong></p>
      <ul>
        ${examsPrimary.map(e => `<li>${e}</li>`).join("")}
      </ul>
      <p><strong>Examens secondaires / complémentaires :</strong></p>
      <ul>
        ${examsSecondary.map(e => `<li>${e}</li>`).join("")}
      </ul>
      <p><strong>Niveau de gravité (démo) :</strong> ${severityLabel} (score ${severityScore})</p>
      <p style="color:var(--text-muted); margin-top:8px;">
        Moteur IA clinique local — démo. Ne remplace pas un avis médical.
      </p>
    `;
  });

});
