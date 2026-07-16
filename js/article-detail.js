function getIdFromQuery() {
  return new URLSearchParams(window.location.search).get('id');
}

async function loadArticle() {
  const id = getIdFromQuery();
  const wrap = document.getElementById('articleContent');
  if (!id) {
    wrap.innerHTML = `<div class="empty-state">Article introuvable.</div>`;
    return;
  }
  try {
    const { article } = await apiGet(`/articles/${id}`);
    document.title = `${article.titre} — EcoKin`;
    wrap.innerHTML = `
      ${article.cover_image_path ? `<img src="${photoUrl(article.cover_image_path)}" alt="" style="border-radius:14px; margin-bottom:1.5rem; width:100%; aspect-ratio:16/9; object-fit:cover;">` : ''}
      <span class="article-card__meta">${formatDate(article.date_publication)} · ${escapeHtml(article.auteur_prenom)} ${escapeHtml(article.auteur_nom)}</span>
      <h1>${escapeHtml(article.titre)}</h1>
      <div class="article-body">${article.contenu}</div>
    `;
  } catch (err) {
    wrap.innerHTML = `<div class="empty-state">Cet article n'est pas (ou plus) disponible.</div>`;
  }
}

document.addEventListener('DOMContentLoaded', loadArticle);
