// main.js – Moteur JS "Ultra" NeutralEase

document.addEventListener("DOMContentLoaded", () => {

  // ==========================
  // 0. INCLUDES HTML (HEADER / FOOTER)
  // ==========================

  document.querySelectorAll("[data-include]").forEach(async (el) => {
    const file = el.getAttribute("data-include");
    try {
      const response = await fetch(file);
      const html = await response.text();
      el.outerHTML = html;
    } catch (e) {
      console.warn("Include impossible :", file, e);
    }
  });

  // ==========================
  // 1. NAVIGATION & HEADER
  // ==========================

  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      mobileMenu.classList.toggle("open");
      document.body.classList.toggle("nav-open");
    });
  }

  const mobileDropdowns = document.querySelectorAll(".mobile-dropdown");
  mobileDropdowns.forEach(drop => {
    const btn = drop.querySelector("button");
    if (!btn) return;
    btn.addEventListener("click", () => {
      drop.classList.toggle("open");
    });
  });

  // Highlight active link by URL
  const currentPath = window.location.pathname;
  document.querySelectorAll(".nav-links a, .mobile-menu a").forEach(link => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });

  // ==========================
  // 2. MODULES ULTRA (IA, SIMULATEURS, DIAG)
  // ==========================

  const NeutralEaseApp = {
    modules: {},

    registerModule(name, initFn) {
      this.modules[name] = initFn;
    },

    initModules() {
      Object.keys(this.modules).forEach(name => {
        try {
          this.modules[name]();
        } catch (e) {
          console.warn(`Module "${name}" a rencontré une erreur :`, e);
        }
      });
    }
  };

  // ==========================
  // 2.1 – MODULE IA PLACEHOLDER
  // ==========================

  NeutralEaseApp.registerModule("ia-medicale", () => {
    const iaPanels = document.querySelectorAll("[data-module='ia-medicale']");
    if (!iaPanels.length) return;

    iaPanels.forEach(panel => {
      const output = panel.querySelector(".ia-output");
      const input = panel.querySelector(".ia-input");
      const btn = panel.querySelector(".ia-run");

      if (!output || !input || !btn) return;

      btn.addEventListener("click", () => {
        const value = input.value.trim();
        if (!value) {
          output.textContent = "Veuillez saisir un cas clinique ou une question.";
          return;
        }

        // Placeholder IA – à remplacer par un vrai appel API plus tard
        output.textContent =
          "Analyse IA (placeholder) : votre demande a été prise en compte. " +
          "Le moteur IA sera connecté à NeutralEase dans une prochaine étape.";
      });
    });
  });

  // ==========================
  // 2.2 – MODULE SIMULATEUR PLACEHOLDER
  // ==========================

  NeutralEaseApp.registerModule("simulateur-diag", () => {
    const simulators = document.querySelectorAll("[data-module='simulateur-diag']");
    if (!simulators.length) return;

    simulators.forEach(sim => {
      const slider = sim.querySelector(".sim-slider");
      const valueLabel = sim.querySelector(".sim-value");
      const resultLabel = sim.querySelector(".sim-result");

      if (!slider || !valueLabel || !resultLabel) return;

      const update = () => {
        const v = Number(slider.value);
        valueLabel.textContent = v;

        // Placeholder logique – à remplacer par un vrai modèle plus tard
        if (v < 30) {
          resultLabel.textContent = "Profil : faible probabilité d’anomalie.";
        } else if (v < 70) {
          resultLabel.textContent = "Profil : zone grise, à corréler avec le contexte clinique.";
        } else {
          resultLabel.textContent = "Profil : probabilité élevée – examen complémentaire recommandé.";
        }
      };

      slider.addEventListener("input", update);
      update();
    });
  });

  // ==========================
  // 2.3 – MODULE UI DYNAMIQUE (PANELS, TABS, ETC.)
  // ==========================

  NeutralEaseApp.registerModule("ui-panels", () => {
    const toggles = document.querySelectorAll("[data-toggle-panel]");
    toggles.forEach(btn => {
      const targetId = btn.getAttribute("data-toggle-panel");
      const target = document.getElementById(targetId);
      if (!target) return;

      btn.addEventListener("click", () => {
        const isOpen = target.classList.toggle("panel-open");
        btn.classList.toggle("panel-open", isOpen);
      });
    });

    const tabGroups = document.querySelectorAll("[data-tabs]");
    tabGroups.forEach(group => {
      const buttons = group.querySelectorAll("[data-tab-target]");
      const panels = group.querySelectorAll("[data-tab-panel]");

      buttons.forEach(btn => {
        btn.addEventListener("click", () => {
          const target = btn.getAttribute("data-tab-target");

          buttons.forEach(b => b.classList.remove("tab-active"));
          panels.forEach(p => {
            if (p.getAttribute("data-tab-panel") === target) {
              p.classList.add("tab-active");
            } else {
              p.classList.remove("tab-active");
            }
          });

          btn.classList.add("tab-active");
        });
      });
    });
  });

  // ==========================
  // 3. INITIALISATION GLOBALE
  // ==========================

  NeutralEaseApp.initModules();
});
