const PROJECT_ID = 'dpcpc70i';
const DATASET = 'production';
const QUERY = encodeURIComponent(`*[_type == "memorabilia"]{
  title, year, "venueName": venue->name, "imageUrl": image.asset->url,
  "itemTypeName": itemType->name, "sportNames": sports[]->name,
  "athleteNames": sportsmen[]->name, "teamNames": teams[]->name, isLatest
}`);

const URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY}`;
let allItems = [];

async function loadVault() {
    try {
        const response = await fetch(URL);
        const { result } = await response.json();
        allItems = result || [];
        if(document.getElementById('sportGrid')) renderGrids(allItems);
        setupFilters();
    } catch (e) { console.error(e); }
}

function renderGrids(items) {
    const mainGrid = document.getElementById('sportGrid');
    const latestGrid = document.getElementById('latestGrid');
    if(mainGrid) mainGrid.innerHTML = '';
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    items.forEach(item => { if(item.isLatest && latestGrid) latestGrid.appendChild(createCard(item)); });
    shuffled.forEach(item => { if(mainGrid) mainGrid.appendChild(createCard(item)); });
}

function createCard(item) {
    const card = document.createElement('div');
    card.className = 'sport-card';
    card.onclick = (e) => {
        if (!e.target.classList.contains('clickable')) {
            window.location.href = `item.html?name=${encodeURIComponent(item.title)}`;
        }
    };
    card.innerHTML = `
        <div class="card-image-container">
            <img src="${item.imageUrl}" alt="${item.title}">
            <span class="type-badge">${item.itemTypeName || ''}</span>
        </div>
        <div class="card-info">
            <div class="tags-row">
                <span class="year-label">${item.year || ''}</span>
                ${item.sportNames ? item.sportNames.map(s => `<span class="clickable-tag clickable" onclick="goToFilter('sport','${s}')">${s}</span>`).join('') : ''}
            </div>
            <h3>${item.title}</h3>
            ${item.venueName ? `<p class="venue-text clickable" onclick="goToFilter('venue','${item.venueName}')">📍 ${item.venueName}</p>` : ''}
            <div class="athlete-row">
                ${item.athleteNames ? item.athleteNames.map(a => `<p class="clickable-athlete clickable" onclick="goToFilter('athlete','${a}')">${a}</p>`).join('') : ''}
            </div>
        </div>`;
    return card;
}

function goToFilter(type, val) { window.location.href = `filter.html?${type}=${encodeURIComponent(val)}`; }

function setupFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.onclick = () => {
            const sport = btn.getAttribute('data-sport');
            renderGrids(sport === 'all' ? allItems : allItems.filter(i => i.sportNames?.includes(sport)));
        };
    });
}

const btt = document.getElementById("backToTop");
if(btt) {
    window.onscroll = () => { btt.style.display = (window.scrollY > 400) ? "flex" : "none"; };
    btt.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', loadVault);