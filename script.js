const PROJECT_ID = 'dpcpc70i';
const DATASET = 'production';
const QUERY = encodeURIComponent(`*[_type == "memorabilia"]{
  title,
  description,
  "imageUrl": image.asset->url,
  "sportNames": sports[]->name,
  "athleteNames": sportsmen[]->name,
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
    mainGrid.innerHTML = '';
    if (latestGrid) latestGrid.innerHTML = '';

    // Randomize for the 100+ Vault
    const shuffledItems = [...items].sort(() => 0.5 - Math.random());

    items.forEach(item => {
        if (item.isLatest && latestGrid) {
            latestGrid.appendChild(createCard(item));
        }
    });

    shuffledItems.forEach(item => {
        mainGrid.appendChild(createCard(item));
    });
}

function createCard(item) {
    const athletes = item.athleteNames ? item.athleteNames.join(', ') : '';
    const card = document.createElement('div');
    card.className = 'sport-card';
    
    // Clicking card opens Zoom
    card.onclick = (e) => {
        if (e.target.tagName !== 'SPAN' && e.target.tagName !== 'P') {
            openLightbox(item.imageUrl, item.title, athletes, item.description);
        }
    };

    card.innerHTML = `
        <div class="card-image-container"><img src="${item.imageUrl}" alt="${item.title}"></div>
        <div class="card-info">
            <div class="tags-row">${item.sportNames ? item.sportNames.map(s => `<span class="clickable-tag" onclick="filterBySport('${s}')">${s}</span>`).join('') : ''}</div>
            <h3>${item.title}</h3>
            <div class="athlete-row">${item.athleteNames ? item.athleteNames.map(a => `<p class="clickable-athlete" onclick="filterByAthlete('${a}')">${a}</p>`).join('') : ''}</div>
            <p class="item-desc">${item.description || ''}</p>
        </div>`;
    return card;
}

function filterBySport(sportName) {
    renderGrids(allItems.filter(i => i.sportNames && i.sportNames.includes(sportName)));
    window.location.hash = "collection";
}

function filterByAthlete(athleteName) {
    renderGrids(allItems.filter(i => i.athleteNames && i.athleteNames.includes(athleteName)));
    window.location.hash = "collection";
}

function openLightbox(url, title, athletes, desc) {
    const lightbox = document.getElementById('lightbox');
    document.getElementById('lightbox-img').src = url;
    document.getElementById('lightbox-caption').innerHTML = `
        <h2 style="color:var(--gold); margin-bottom:5px;">${title}</h2>
        <p style="font-weight:bold; color:white;">${athletes}</p>
        <p style="font-size:0.9rem; opacity:0.8; margin-top:10px; color:white;">${desc || ''}</p>
    `;
    lightbox.style.display = "flex";
}

document.querySelector('.close-lightbox').onclick = () => document.getElementById('lightbox').style.display = "none";

function setupFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.filter-btn.active').classList.remove('active');
            btn.classList.add('active');
            const sport = btn.getAttribute('data-sport');
            const filtered = (sport === 'all') ? allItems : allItems.filter(i => i.sportNames && i.sportNames.includes(sport));
            renderGrids(filtered);
        };
    });
}

// Search Logic
document.getElementById('vaultSearch')?.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allItems.filter(item => {
        const names = item.athleteNames ? item.athleteNames.join(' ').toLowerCase() : '';
        const sports = item.sportNames ? item.sportNames.join(' ').toLowerCase() : '';
        return item.title.toLowerCase().includes(term) || names.includes(term) || sports.includes(term);
    });
    renderGrids(filtered);
});

// Back to Top logic
const btt = document.getElementById("backToTop");
window.onscroll = () => {
    btt.style.display = (window.scrollY > 400) ? "flex" : "none";
};
btt.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

document.addEventListener('DOMContentLoaded', loadVault);