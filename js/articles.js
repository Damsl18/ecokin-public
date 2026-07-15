let currentPage = 1;
let currentSearch = '';

function renderArticles(articles) {
  const wrap = document.getElementById('articlesList');
  if (!articles.length) {
    wrap.innerHTML = `<div class="empty-state"><i class="fa-solid fa-magnifying-glass" style="font-size:1.6rem; color:var(--c-green);"></i><p style="margin-top:0.8rem;">Aucun article ne correspond à ta recherche.</p></div>`;
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
}

function renderPagination(pagination) {
  const nav = document.getElementById('pagination');
  if (pagination.totalPages <= 1) { nav.innerHTML = ''; return; }
  let html = '';
  for (let p = 1; p <= pagination.totalPages; p++) {
    html += `<button class="btn ${p === pagination.page ? 'btn-primary' : 'btn-outline'} btn-sm" data-page="${p}">${p}</button>`;
  }
  nav.innerHTML = html;
  nav.querySelectorAll('[data-page]').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentPage = parseInt(btn.dataset.page, 10);
      loadArticles();
    });
  });
}

async function loadArticles() {
  const wrap = document.getElementById('articlesList');
  wrap.innerHTML = `<div class="empty-state"><div class="spinner" style="margin:0 auto;"></div></div>`;
  try {
    const params = new URLSearchParams({ page: currentPage, limit: 9 });
    if (currentSearch) params.set('search', currentSearch);
    const { articles, pagination } = await apiGet(`/articles/public?${params}`);
    renderArticles(articles);
    renderPagination(pagination);
  } catch (err) {
    wrap.innerHTML = `<div class="empty-state">Impossible de charger les articles pour le moment.</div>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadArticles();
  document.getElementById('searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    currentSearch = document.getElementById('searchInput').value.trim();
    currentPage = 1;
    loadArticles();
  });
});
