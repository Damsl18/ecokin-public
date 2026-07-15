async function loadStats() {
  const grid = document.getElementById('statsGrid');
  try {
    const data = await apiGet('/stats/public');
    grid.innerHTML = `
      <div class="stat-card"><div class="stat-card__num">${data.citoyens_inscrits}</div><div class="stat-card__label">Citoyens inscrits</div></div>
      <div class="stat-card"><div class="stat-card__num">${data.signalements_traites}</div><div class="stat-card__label">Signalements traités</div></div>
      <div class="stat-card"><div class="stat-card__num">${data.articles_publies}</div><div class="stat-card__label">Articles publiés</div></div>
    `;
  } catch (err) {
    grid.innerHTML = `<div class="empty-state">Statistiques momentanément indisponibles.</div>`;
  }
}

async function loadArticlesPreview() {
  const wrap = document.getElementById('articlesPreview');
  try {
    const { articles } = await apiGet('/articles/public?page=1&limit=3');
    if (!articles.length) {
      wrap.innerHTML = `<div class="empty-state"><i class="fa-solid fa-seedling" style="font-size:1.6rem; color:var(--c-green);"></i><p style="margin-top:0.8rem;">Aucun article publié pour l'instant. Le premier viendra bientôt.</p></div>`;
      return;
    }
    wrap.innerHTML = articles.map((a) => `
      <a class="article-card" href="article.html?id=${a.id}">
        <div class="article-card__cover">${a.cover_image_path ? `<img src="${photoUrl(a.cover_image_path)}" alt="">` : ''}</div>
        <div class="article-card__body">
          <span class="article-card__meta">${formatDate(a.date_publication)} · ${escapeHtml(a.auteur_prenom)} ${escapeHtml(a.auteur_nom)}</span>
          <h3 class="article-card__title">${escapeHtml(a.titre)}</h3>
        </div>
      </a>
    `).join('');
  } catch (err) {
    wrap.innerHTML = `<div class="empty-state">Impossible de charger les articles pour le moment.</div>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadStats();
  loadArticlesPreview();
});
