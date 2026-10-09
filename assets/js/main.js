/* =================================================================
   MAIN.JS - Gestion globale du site

   Gestion :
   - Menu hamburger
   - Navigation mobile
   - Fermeture du menu après clic
   - Fermeture avec la touche Échap
   - Fermeture lors d'un clic extérieur
   - Synchronisation aria-expanded
   ================================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ==============================================================
       ÉLÉMENTS DU HEADER
       ============================================================== */

    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const mainNav = document.getElementById("mainNav");


    /* ==============================================================
       OUVERTURE / FERMETURE DU MENU MOBILE
       ============================================================== */

    if (hamburgerBtn && mainNav) {

        const setMenuState = (open) => {

            mainNav.classList.toggle("open", open);

            hamburgerBtn.classList.toggle("open", open);

            hamburgerBtn.setAttribute(
                "aria-expanded",
                String(open)
            );

            document.body.classList.toggle(
                "menu-open",
                open
            );

            hamburgerBtn.setAttribute(
                "aria-label",
                open
                    ? "Fermer le menu"
                    : "Ouvrir le menu"
            );
        };


        /* ----------------------------------------------------------
           Clic sur le hamburger
           ---------------------------------------------------------- */

        hamburgerBtn.addEventListener("click", () => {

            const isOpen =
                mainNav.classList.contains("open");

            setMenuState(!isOpen);
        });


        /* ----------------------------------------------------------
           Clic sur un lien de navigation
           ---------------------------------------------------------- */

        const navLinks =
            mainNav.querySelectorAll("a");

        navLinks.forEach((link) => {

            link.addEventListener("click", () => {

                /*
                 * On ferme le menu mobile après navigation.
                 * Sur desktop, cela ne provoque aucun problème.
                 */

                if (
                    window.matchMedia("(max-width: 800px)").matches
                ) {
                    setMenuState(false);
                }
            });
        });


        /* ----------------------------------------------------------
           Touche Échap
           ---------------------------------------------------------- */

        document.addEventListener("keydown", (event) => {

            if (
                event.key === "Escape" &&
                mainNav.classList.contains("open")
            ) {
                setMenuState(false);

                hamburgerBtn.focus();
            }
        });


        /* ----------------------------------------------------------
           Clic en dehors du menu
           ---------------------------------------------------------- */

        document.addEventListener("click", (event) => {

            if (
                !mainNav.classList.contains("open")
            ) {
                return;
            }

            const clickedInsideNav =
                mainNav.contains(event.target);

            const clickedButton =
                hamburgerBtn.contains(event.target);

            if (
                !clickedInsideNav &&
                !clickedButton
            ) {
                setMenuState(false);
            }
        });


        /* ----------------------------------------------------------
           Retour à la version desktop
           ---------------------------------------------------------- */

        window.addEventListener("resize", () => {

            if (
                window.innerWidth > 800 &&
                mainNav.classList.contains("open")
            ) {
                setMenuState(false);
            }
        });
    }


    /* ==============================================================
       INITIALISATION ARIA
       ============================================================== */

    if (hamburgerBtn && mainNav) {

        hamburgerBtn.setAttribute(
            "aria-expanded",
            "false"
        );

        hamburgerBtn.setAttribute(
            "aria-controls",
            "mainNav"
        );
    }


    /* ==============================================================
       LIENS INTERNES AVEC ANCRES
       ============================================================== */

    const anchorLinks =
        document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId =
                link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }

            const target =
                document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            const header =
                document.querySelector(".site-header");

            const headerHeight =
                header
                    ? header.offsetHeight
                    : 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight -
                15;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });
        });
    });

});