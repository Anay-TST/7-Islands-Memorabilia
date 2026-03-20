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

    items.forEach(item => {
        const athletes = item.athleteNames ? item.athleteNames.join(', ') : '';
        const sports = item.sportNames ? item.sportNames.join(' & ') : 'General';
        
        const card = document.createElement('div');
        card.className = 'sport-card';
        card.onclick = () => openLightbox(item.imageUrl, item.title, athletes, item.description);

        card.innerHTML = `
            <div class="card-image-container">
                <img src="${item.imageUrl}" alt="${item.title}">
            </div>
            <div class="card-info">
                <span class="sport-tag">${sports}</span>
                <h3>${item.title}</h3>
                <p class="athlete-name">${athletes}</p>
                <p class="item-desc">${item.description || ''}</p>
            </div>
        `;

        if (item.isLatest && latestGrid) {
            latestGrid.appendChild(card.cloneNode(true));
        }
        mainGrid.appendChild(card);
    });
}

function openLightbox(url, title, athletes, desc) {
    const lightbox = document.getElementById('lightbox');
    document.getElementById('lightbox-img').src = url;
    document.getElementById('lightbox-caption').innerHTML = `
        <h2 style="color:var(--gold); margin-bottom:5px;">${title}</h2>
        <p style="font-weight:bold;">${athletes}</p>
        <p style="font-size:0.9rem; opacity:0.8; margin-top:10px;">${desc || ''}</p>
    `;
    lightbox.style.display = "flex";
}

document.querySelector('.close-lightbox').onclick = () => document.getElementById('lightbox').style.display = "none";

window.onclick = (e) => {
    if (e.target == document.getElementById('lightbox')) document.getElementById('lightbox').style.display = "none";
}

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

document.getElementById('vaultSearch')?.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allItems.filter(item => {
        const names = item.athleteNames ? item.athleteNames.join(' ').toLowerCase() : '';
        const sports = item.sportNames ? item.sportNames.join(' ').toLowerCase() : '';
        return item.title.toLowerCase().includes(term) || names.includes(term) || sports.includes(term);
    });
    renderGrids(filtered);
});

document.addEventListener('DOMContentLoaded', loadVault);