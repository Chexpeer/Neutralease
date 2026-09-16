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
    }, 180);
}

/* --------------------------------------------------------------------------
   2. ANIMATION : HOVER IA (HALO + LUMIÈRE + PROFONDEUR)
   -------------------------------------------------------------------------- */
function applyHoverEffects() {
    const links = document.querySelectorAll(".nav-links a");

    links.forEach(link => {
        link.addEventListener("mouseenter", () => {
            link.classList.add("ia-hover");
        });

        link.addEventListener("mouseleave", () => {
            link.classList.remove("ia-hover");
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
            icon.classList.add("hex-pulse");
        });

        icon.addEventListener("mouseleave", () => {
            icon.classList.remove("hex-pulse");
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
   6. MENU MOBILE — VERSION IA DÉROULANTE (FIXE + FLUIDE)
   -------------------------------------------------------------------------- */
function activateMobileMenu() {
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (!hamburger || !navLinks) return;

    // Préparation du menu déroulant
    navLinks.style.overflow = "hidden";
    navLinks.style.maxHeight = "0px";
    navLinks.style.transition = "max-height 0.35s ease";

    hamburger.addEventListener("click", () => {
        applyQuakeEffect(hamburger);

        if (navLinks.classList.contains("active")) {
            navLinks.classList.remove("active");
            navLinks.style.maxHeight = "0px";
        } else {
            navLinks.classList.add("active");
            navLinks.style.maxHeight = navLinks.scrollHeight + "px";
        }
    });

    document.addEventListener("click", (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove("active");
            navLinks.style.maxHeight = "0px";
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
