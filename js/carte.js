const KINSHASA_CENTER = [-4.325, 15.322];
let map;
let markersLayer;

function statutColor(statut) {
  if (statut === 'traite') return '#4CAF50';
  return '#2D6CDF'; // valide / en_cours
}

function popupSignalement(s) {
  return `
    <strong>${escapeHtml(s.titre || 'Signalement')}</strong><br>
    <span class="badge-statut badge-${s.statut || ''}">${(s.statut || 'validé').replace('_', ' ')}</span><br>
    <small>${escapeHtml(s.adresse)}</small>
    ${s.photo_path ? `<br><img src="${photoUrl(s.photo_path)}" alt="" style="width:100%; border-radius:8px; margin-top:6px;">` : ''}
  `;
}

function popupPoint(p) {
  return `
    <strong>${escapeHtml(p.nom)}</strong><br>
    <small>${escapeHtml(p.adresse)}</small><br>
    ${p.type_dechet ? `Type : ${escapeHtml(p.type_dechet)}<br>` : ''}
    ${p.horaires ? `Horaires : ${escapeHtml(p.horaires)}<br>` : ''}
    ${p.contact ? `Contact : ${escapeHtml(p.contact)}` : ''}
  `;
}

async function loadMapData() {
  const commune = document.getElementById('communeFilter').value;
  const type_dechet = document.getElementById('typeDechetFilter').value;
  const params = new URLSearchParams();
  if (commune) params.set('commune', commune);
  if (type_dechet) params.set('type_dechet', type_dechet);

  markersLayer.clearLayers();

  try {
    const data = await apiGet(`/map/data?${params}`);

    data.signalements.forEach((s) => {
      L.circleMarker([s.latitude, s.longitude], {
        radius: 8, color: statutColor(s.statut), fillColor: statutColor(s.statut), fillOpacity: 0.85, weight: 2,
      }).bindPopup(popupSignalement(s)).addTo(markersLayer);
    });

    data.points_collection.forEach((p) => {
      L.marker([p.latitude, p.longitude], {
        icon: L.divIcon({ className: '', html: '<i class="fa-solid fa-recycle" style="color:#2E7D32; font-size:20px;"></i>', iconSize: [20, 20] }),
      }).bindPopup(popupPoint(p)).addTo(markersLayer);
    });

    data.zones_risque.forEach((z) => {
      L.circle([z.latitude, z.longitude], {
        radius: z.rayon_m, color: '#C0392B', fillColor: '#C0392B', fillOpacity: 0.15, weight: 1.5,
      }).bindPopup(`<strong>${escapeHtml(z.nom)}</strong><br>Niveau : ${escapeHtml(z.niveau_risque)}${z.description ? `<br>${escapeHtml(z.description)}` : ''}`).addTo(markersLayer);
    });

    // Peuple les filtres dynamiquement (une seule fois)
    populateFilterOnce('communeFilter', [...new Set(data.signalements.map((s) => s.commune).filter(Boolean))]);
    populateFilterOnce('typeDechetFilter', [...new Set(data.points_collection.map((p) => p.type_dechet).filter(Boolean))]);
  } catch (err) {
    console.error(err);
  }
}

const filledFilters = new Set();
function populateFilterOnce(selectId, values) {
  if (filledFilters.has(selectId) || !values.length) return;
  const select = document.getElementById(selectId);
  values.sort().forEach((v) => {
    const opt = document.createElement('option');
    opt.value = v; opt.textContent = v;
    select.appendChild(opt);
  });
  filledFilters.add(selectId);
}

document.addEventListener('DOMContentLoaded', () => {
  map = L.map('map').setView(KINSHASA_CENTER, 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);
  markersLayer = L.layerGroup().addTo(map);

  loadMapData();
  document.getElementById('communeFilter').addEventListener('change', loadMapData);
  document.getElementById('typeDechetFilter').addEventListener('change', loadMapData);
});
