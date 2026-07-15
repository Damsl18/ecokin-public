/**
 * Petit wrapper fetch pour l'interface publique (aucune route ne nécessite d'auth ici).
 */
async function apiGet(path) {
  const res = await fetch(`${CONFIG.API_BASE_URL}${path}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Erreur ${res.status}`);
  }
  return data;
}

function photoUrl(path) {
  if (!path) return null;
  return `${CONFIG.UPLOADS_BASE_URL}${path}`;
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}
