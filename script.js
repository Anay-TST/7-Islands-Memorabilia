const PROJECT_ID = 'dpcpc70i';
const DATASET = 'production';
const BASE_URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=`;

const MAIN_QUERY = encodeURIComponent(`*[_type == "memorabilia"]{
  title, year, "venueName": venue->name, "imageUrl": image.asset->url,
  "itemType": itemType->name, "sportNames": sports[]->name,
  "athleteNames": sportsmen[]->name, "teamNames": teams[]->name, isLatest
}`);

let allItems = [];

async function loadVault() {
    try {
        const response = await fetch(BASE_URL + MAIN_QUERY);
        const { result } = await response.json();
        allItems = result || [];
        
        if(document.getElementById('latestGrid')) renderGrid('latestGrid', allItems.filter(i => i.isLatest));
        if(document.getElementById('sportGrid')) renderGrid('sportGrid', allItems, true);
        
        setupFilters();
        setupSearch();
    } catch (e) { console.error("Data Load Error:", e); }
}

function renderGrid(gridId, items, shuffle = false) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = '';
    const displayItems = shuffle ? [...items].sort(() => 0.5 - Math.random()) : items;
    displayItems.forEach(item => grid.appendChild(createCard(item)));
}

function createCard(item) {
    const card = document.createElement('div');
    card.className = 'sport-card';

    // The main card now only redirects if you click background area
    card.onclick = (e) => {
        window.location.href = `item.html?name=${encodeURIComponent(item.title)}`;
    };

    card.innerHTML = `
        <div class="card-image-container">
            <img src="${item.imageUrl}" alt="${item.title}">
            ${item.itemType ? `<span class="type-badge">${item.itemType}</span>` : ''}
        </div>
        <div class="card-info">
            <div class="tags-row">
                ${item.year ? `<span class="year-label">${item.year}</span>` : ''}
                ${item.sportNames ? item.sportNames.map(s => `
                    <span class="clickable-tag" onclick="handleTagClick(event, 'sport','${s}')">${s}</span>
                `).join('') : ''}
            </div>
            <h3>${item.title}</h3>
            ${item.venueName ? `
                <p class="venue-text" onclick="handleTagClick(event, 'venue','${item.venueName}')">📍 ${item.venueName}</p>
            ` : ''}
            <div class="athlete-row">
                ${item.athleteNames ? item.athleteNames.map(a => `
                    <span class="athlete-link" onclick="handleTagClick(event, 'athlete','${a}')">${a}</span>
                `).join('') : ''}
            </div>
        </div>`;
    return card;
}

// CRITICAL FIX: Stops the click from reaching the parent card
function handleTagClick(e, type, val) {
    e.stopPropagation(); 
    window.location.href = `filter.html?${type}=${encodeURIComponent(val)}`;
}

function setupFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.filter-btn.active')?.classList.remove('active');
            btn.classList.add('active');
            const sport = btn.getAttribute('data-sport');
            const filtered = (sport === 'all' ? allItems : allItems.filter(i => i.sportNames?.includes(sport)));
            renderGrid('sportGrid', filtered, true);
        };
    });
}

function setupSearch() {
    const searchInput = document.getElementById('vaultSearch');
    const clearBtn = document.getElementById('clearSearch');
    if(!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        if(clearBtn) clearBtn.style.display = term.length > 0 ? "flex" : "none";
        const filtered = allItems.filter(item => {
            const title = (item.title || "").toLowerCase();
            const athletes = (item.athleteNames || []).join(" ").toLowerCase();
            const sports = (item.sportNames || []).join(" ").toLowerCase();
            return title.includes(term) || athletes.includes(term) || sports.includes(term);
        });
        renderGrid('sportGrid', filtered, true);
    });

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = "";
            clearBtn.style.display = "none";
            renderGrid('sportGrid', allItems, true);
        });
    }
}

document.addEventListener('DOMContentLoaded', loadVault);