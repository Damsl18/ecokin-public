/**
 * Charge les partiels header/footer et branche les liens vers l'espace utilisateur.
 * Nécessite de servir le site via un serveur HTTP local (pas d'ouverture en file://).
 */
async function loadPartial(selector, url) {
  const host = document.querySelector(selector);
  if (!host) return;
  const res = await fetch(url);
  host.innerHTML = await res.text();
}

document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([
    loadPartial('#site-header', 'partials/header.html'),
    loadPartial('#site-footer', 'partials/footer.html'),
  ]);

  // Liens vers l'espace utilisateur (login / inscription pour publier)
  document.querySelectorAll('[data-user-app]').forEach((el) => {
    el.href = `${CONFIG.USER_APP_URL}/login.html`;
  });
  document.querySelectorAll('[data-user-app-register]').forEach((el) => {
    el.href = `${CONFIG.USER_APP_URL}/login.html?intent=article`;
  });

  // Menu mobile
  const burger = document.getElementById('burgerBtn');
  const menu = document.getElementById('mobileMenu');
  if (burger && menu) {
    burger.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(isOpen));
      burger.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });
  }

  document.dispatchEvent(new CustomEvent('partials:loaded'));
});
