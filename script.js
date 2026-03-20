const PROJECT_ID = 'dpcpc70i';
const DATASET = 'production';
const QUERY = encodeURIComponent(`*[_type == "memorabilia"]{
  title,
  year,
  venue,
  isMatchWorn,
  coaProvider,
  serialNumber,
  description,
  "imageUrl": image.asset->url,
  "itemTypeName": itemType->name,
  "sportNames": sports[]->name,
  "athleteNames": sportsmen[]->name,
  "teamNames": teams[]->name,
  isLatest
}`);

const URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY}`;
let allItems = [];

async function loadVault() {
    try {
        const response = await fetch(URL);
        const { result } = await response.json();
        allItems = result || [];
        renderGrids(allItems);
        setupFilters();
    } catch (error) { console.error('Vault Error:', error); }
}

function renderGrids(items) {
    const mainGrid = document.getElementById('sportGrid');
    const latestGrid = document.getElementById('latestGrid');
    if (mainGrid) mainGrid.innerHTML = '';
    if (latestGrid) latestGrid.innerHTML = '';

    const shuffledItems = [...items].sort(() => 0.5 - Math.random());

    items.forEach(item => {
        if (item.isLatest && latestGrid) latestGrid.appendChild(createCard(item));
    });

    shuffledItems.forEach(item => {
        if (mainGrid) mainGrid.appendChild(createCard(item));
    });
}

function createCard(item) {
    const athletes = item.athleteNames ? item.athleteNames.join(', ') : '';
    const card = document.createElement('div');
    card.className = 'sport-card';
    
    card.onclick = (e) => {
        if (!e.target.classList.contains('clickable-tag') && !e.target.classList.contains('clickable-athlete')) {
            openLightbox(item);
        }
    };

    card.innerHTML = `
        <div class="card-image-container">
            <img src="${item.imageUrl}" alt="${item.title}" loading="lazy">
            ${item.isMatchWorn ? `<span class="match-badge">Match Used</span>` : ''}
            ${item.serialNumber ? `<span class="verify-icon">✓</span>` : ''}
        </div>
        <div class="card-info">
            <div class="tags-row">
                <span class="year-label">${item.year || ''}</span>
                ${item.sportNames ? item.sportNames.map(s => `<span class="clickable-tag" onclick="filterBySport('${s}')">${s}</span>`).join('') : ''}
            </div>
            <h3>${item.title}</h3>
            <p class="venue-text">${item.venue || ''}</p>
            <div class="athlete-row">
                ${item.athleteNames ? item.athleteNames.map(a => `<p class="clickable-athlete" onclick="filterByAthlete('${a}')">${a}</p>`).join('') : ''}
            </div>
            <p class="item-desc">${item.description || ''}</p>
        </div>`;
    return card;
}

function openLightbox(item) {
    const lightbox = document.getElementById('lightbox');
    const athletes = item.athleteNames ? item.athleteNames.join(', ') : '';
    document.getElementById('lightbox-img').src = item.imageUrl;
    document.getElementById('lightbox-caption').innerHTML = `
        <div class="lightbox-meta">
            <span class="gold-text">${item.itemTypeName || ''}</span> • <span>${item.year || ''}</span>
        </div>
        <h2 style="color:var(--gold); font-family:'Arvo'; margin: 10px 0;">${item.title}</h2>
        <p style="color:white; font-size: 0.9rem; margin-bottom: 5px;">📍 ${item.venue || 'Global Collection'}</p>
        <p style="font-weight:bold; color:white;">${athletes}</p>
        <div class="coa-box">
            ${item.serialNumber ? `<p><strong>Serial:</strong> ${item.serialNumber}</p>` : ''}
            ${item.coaProvider ? `<p><strong>Auth:</strong> ${item.coaProvider}</p>` : ''}
        </div>
        <p style="font-size:0.9rem; opacity:0.8; margin-top:15px; color:white;">${item.description || ''}</p>
    `;
    lightbox.style.display = "flex";
}

/** --- Filters & Navigation --- **/
function filterBySport(s) { renderGrids(allItems.filter(i => i.sportNames?.includes(s))); window.location.hash = "collection"; }
function filterByAthlete(a) { renderGrids(allItems.filter(i => i.athleteNames?.includes(a))); window.location.hash = "collection"; }

function setupFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.filter-btn.active').classList.remove('active');
            btn.classList.add('active');
            const sport = btn.getAttribute('data-sport');
            renderGrids(sport === 'all' ? allItems : allItems.filter(i => i.sportNames?.includes(sport)));
        };
    });
}

document.getElementById('vaultSearch')?.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allItems.filter(item => {
        const names = item.athleteNames ? item.athleteNames.join(' ').toLowerCase() : '';
        const sports = item.sportNames ? item.sportNames.join(' ').toLowerCase() : '';
        const venue = item.venue ? item.venue.toLowerCase() : '';
        return item.title.toLowerCase().includes(term) || names.includes(term) || sports.includes(term) || venue.includes(term) || (item.year && item.year.includes(term));
    });
    renderGrids(filtered);
});

const btt = document.getElementById("backToTop");
window.onscroll = () => { btt.style.display = (window.scrollY > 400) ? "flex" : "none"; };
btt.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
document.querySelector('.close-lightbox').onclick = () => document.getElementById('lightbox').style.display = "none";
document.addEventListener('DOMContentLoaded', loadVault);