/* ==========================================================================
   NEUTRALEASE - SCRIPT GLOBAL (VERSION IA FUTURISTE 2026)
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. ANIMATION : TREMBLEMENT DE TERRE IA (AU CLIC)
   -------------------------------------------------------------------------- */
function applyQuakeEffect(element) {
    element.classList.add("quake-active");

    setTimeout(() => {
        element.classList.remove("quake-active");
    }, 180); // durée cohérente avec le CSS
}

/* --------------------------------------------------------------------------
   2. ANIMATION : HOVER IA (HALO + LUMIÈRE + PROFONDEUR)
   -------------------------------------------------------------------------- */
function applyHoverEffects() {
    const links = document.querySelectorAll(".nav-links a");

    links.forEach(link => {
        link.addEventListener("mouseenter", () => {
            link.style.transform = "translateY(-2px)";
            link.style.boxShadow =
                "inset 0 -2px 4px rgba(0,0,0,0.55)," +
                "inset 0 2px 3px rgba(255,255,255,0.12)," +
                "0 0 8px rgba(168, 85, 247, 0.35)";
        });

        link.addEventListener("mouseleave", () => {
            link.style.transform = "translateY(0)";
            link.style.boxShadow =
                "inset 0 -1px 3px rgba(0,0,0,0.45)," +
                "inset 0 1px 2px rgba(255,255,255,0.08)";
        });
    });
}

/* --------------------------------------------------------------------------
   3. ANIMATION : CLIC SUR LES MENUS (HEXAGONES IA)
   -------------------------------------------------------------------------- */
function activateMenuClickEffects() {
    const links = document.querySelectorAll(".nav-links a");

    links.forEach(link => {
        link.addEventListener("mousedown", () => {
            applyQuakeEffect(link);
        });
    });
}

/* --------------------------------------------------------------------------
   4. ANIMATION : ICÔNES HEXAGONALES IA (PULSATION FUTURISTE)
   -------------------------------------------------------------------------- */
function activateHexagonPulse() {
    const hexIcons = document.querySelectorAll(".hex-icon");

    hexIcons.forEach(icon => {
        icon.addEventListener("mouseenter", () => {
            icon.style.transform = "scale(1.15)";
            icon.style.boxShadow =
                "inset 0 -2px 4px rgba(0,0,0,0.55)," +
                "inset 0 2px 3px rgba(255,255,255,0.12)," +
                "0 0 10px rgba(168, 85, 247, 0.45)";
        });

        icon.addEventListener("mouseleave", () => {
            icon.style.transform = "scale(1)";
            icon.style.boxShadow =
                "inset 0 -1px 3px rgba(0,0,0,0.45)," +
                "inset 0 1px 2px rgba(255,255,255,0.08)," +
                "0 0 6px rgba(168, 85, 247, 0.25)";
        });
    });
}

/* --------------------------------------------------------------------------
   5. ANIMATION : APPARITION DU BANDEAU (FADE IA + SLIDE)
   -------------------------------------------------------------------------- */
function animateHeaderOnLoad() {
    const header = document.querySelector(".header");

    if (!header) return;

    header.style.opacity = "0";
    header.style.transform = "translateY(-20px)";

    setTimeout(() => {
        header.style.transition = "all 0.6s cubic-bezier(.36,.07,.19,.97)";
        header.style.opacity = "1";
        header.style.transform = "translateY(0)";
    }, 150);
}

/* --------------------------------------------------------------------------
   6. DROPDOWN MOBILE (SI NÉCESSAIRE)
   -------------------------------------------------------------------------- */
function activateMobileMenu() {
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (!hamburger || !navLinks) return;

    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        applyQuakeEffect(hamburger);
    });

    document.addEventListener("click", (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove("active");
        }
    });
}

/* --------------------------------------------------------------------------
   7. INITIALISATION GLOBALE
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    animateHeaderOnLoad();
    applyHoverEffects();
    activateMenuClickEffects();
    activateHexagonPulse();
    activateMobileMenu();
});
