/* --------------------------------------------------------------------------
   MOBILE - MENU DÉROULANT IA
   -------------------------------------------------------------------------- */
@media (max-width: 900px) {
  .nav-links {
    display: block;        /* IMPORTANT : permet le déroulant */
    max-height: 0;         /* fermé par défaut */
    overflow: hidden;      /* masque le contenu */
    transition: max-height 0.35s ease;
  }

  .nav-links.active {
    max-height: 500px;     /* ouverture fluide */
  }

  .nav-links a {
    display: block;        /* vertical */
    padding: 14px 20px;
    margin-bottom: 6px;
  }
}
