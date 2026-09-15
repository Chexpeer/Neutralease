<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ScoryLease - Calculateurs de Leasing Médical & Scoring</title>
  <link rel="stylesheet" href="assets/css/global.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>

  <!-- HEADER / NAVIGATION -->
  <header class="header">
    <div class="container nav-container">
      <a href="index.html" class="logo">
        <img src="assets/images/logo.svg" alt="Neutralease Logo">
      </a>

      <div class="hamburger" id="hamburger-btn" aria-label="Menu principal">☰</div>

      <nav class="nav-links" id="nav-menu">
        <a href="index.html">Accueil</a>
        
        <div class="dropdown">
          <a href="catalogue/index.html">Catalogue ▾</a>
          <div class="dropdown-content">
            <a href="echolease/index.html">EchoLease</a>
            <a href="dentalease/index.html">DentalLease</a>
            <a href="diaglease/index.html">DiagLease</a>
            <a href="autres-equipements/index.html">Autres Équipements</a>
          </div>
        </div>

        <div class="dropdown">
          <a href="financement/index.html">Financement ▾</a>
          <div class="dropdown-content">
            <a href="financement/leasing-medical.html">Leasing Médical</a>
            <a href="financement/credit-bail-professionnel.html">Crédit-Bail Professionnel</a>
            <a href="financement/location-financiere.html">Location Financière</a>
          </div>
        </div>

        <a href="recuplease/index.html">RecupLease</a>
        <a href="scorylease.html" class="active">ScoryLease</a>
        <a href="contact.html" class="btn-primary" style="color: #0b0f17;">Contact</a>
      </nav>
    </div>
  </header>

  <main class="container" style="padding: 40px 20px;">
    <h1 style="color: var(--text-white); margin-bottom: 10px;">ScoryLease</h1>
    <p style="color: var(--text-muted); margin-bottom: 30px;">Outil d'évaluation financière et de simulation de loyers en temps réel pour vos projets d'équipement.</p>

    <div class="card" style="max-width: 600px; margin: 0 auto;">
      <h2 style="color: var(--brand-primary); margin-bottom: 20px; font-size: 1.4rem;">Simulateur de Loyer</h2>
      
      <form id="scorylease-form" style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <label style="display: block; color: var(--text-muted); margin-bottom: 8px;">Montant de l'équipement (€ HT)</label>
          <input type="number" id="equipment-amount" placeholder="Ex: 50000" style="width: 100%; padding: 12px; background: var(--bg-input); border: 1px solid var(--border); color: var(--text-main); border-radius: var(--radius-sm);" required>
        </div>

        <div>
          <label style="display: block; color: var(--text-muted); margin-bottom: 8px;">Durée du contrat (Mois)</label>
          <select id="lease-duration" style="width: 100%; padding: 12px; background: var(--bg-input); border: 1px solid var(--border); color: var(--text-main); border-radius: var(--radius-sm);">
            <option value="36">36 Mois (3 ans)</option>
            <option value="48">48 Mois (4 ans)</option>
            <option value="60" selected>60 Mois (5 ans)</option>
            <option value="72">72 Mois (6 ans)</option>
          </select>
        </div>

        <button type="button" id="calc-btn" class="btn-primary" style="margin-top: 10px; width: 100%;">Calculer l'estimation</button>
      </form>

      <div id="result-box" style="margin-top: 24px; padding: 16px; background: var(--bg-dark); border-radius: var(--radius-sm); display: none;">
        <span style="color: var(--text-muted); display: block; font-size: 0.9rem;">Estimation du loyer mensuel :</span>
        <strong id="monthly-payment" style="color: var(--brand-primary); font-size: 1.8rem;">0 € HT / mois</strong>
      </div>
    </div>
  </main>

  <footer class="footer">
    <div class="container footer-bottom">
      <span>&copy; 2026 Neutralease. Tous droits réservés.</span>
    </div>
  </footer>

  <script src="assets/js/main.js"></script>
  <script src="assets/js/scorylease-calc.js"></script>
</body>
</html>