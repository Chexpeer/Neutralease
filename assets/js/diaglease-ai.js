// --- DIAGLEASE IA ENGINE (LOCAL, GRATUIT, NON MÉDICAL) ---

async function loadDiagLeaseModel() {
    const response = await fetch('/assets/js/ai-model/diaglease-model.json');
    return await response.json();
}

function analyzeClinicalContext(text, model) {
    text = text.toLowerCase();

    const exams = [];
    const equipments = [];
    const pedagogy = [];

    // --- MATCH SYMPTOMS → EXAMS ---
    model.symptoms.forEach(item => {
        item.keywords.forEach(kw => {
            if (text.includes(kw)) {
                exams.push(...item.exams);
                equipments.push(...item.equipments);
                pedagogy.push(item.pedagogy);
            }
        });
    });

    // --- FALLBACK IF NOTHING MATCHES ---
    if (exams.length === 0) {
        pedagogy.push(model.fallback.pedagogy);
        exams.push(...model.fallback.exams);
        equipments.push(...model.fallback.equipments);
    }

    return {
        exams: [...new Set(exams)],
        equipments: [...new Set(equipments)],
        pedagogy: [...new Set(pedagogy)]
    };
}

// --- UI BINDING ---
document.addEventListener('DOMContentLoaded', async () => {
    const model = await loadDiagLeaseModel();

    const btnAnalyze = document.getElementById('assistantAnalyzeBtn');
    const btnNextEquip = document.getElementById('assistantNextEquipBtn');

    const textarea = document.getElementById('assistantSymptoms');
    const examsContainer = document.getElementById('assistantExamsContent');
    const equipContainer = document.getElementById('assistantEquipContent');

    let analysisResult = null;

    btnAnalyze.addEventListener('click', () => {
        const text = textarea.value.trim();
        if (!text) return;

        analysisResult = analyzeClinicalContext(text, model);

        examsContainer.innerHTML = `
            <h4>Examens suggérés</h4>
            <ul>${analysisResult.exams.map(e => `<li>${e}</li>`).join('')}</ul>
            <p class="pedago">${analysisResult.pedagogy.join('<br>')}</p>
        `;

        document.querySelector('[data-step="1"]').style.display = 'none';
        document.querySelector('[data-step="2"]').style.display = 'block';
    });

    btnNextEquip.addEventListener('click', () => {
        equipContainer.innerHTML = `
            <h4>Équipements associés</h4>
            <ul>${analysisResult.equipments.map(eq => `<li>${eq}</li>`).join('')}</ul>
        `;

        document.querySelector('[data-step="2"]').style.display = 'none';
        document.querySelector('[data-step="3"]').style.display = 'block';
    });
});
