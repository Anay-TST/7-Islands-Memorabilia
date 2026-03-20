const PROJECT_ID = 'dpcpc70i';
const DATASET = 'production';
const BASE_URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=`;

const MAIN_QUERY = encodeURIComponent(`*[_type == "memorabilia"]{
  title, year, "venueName": venue->name, "imageUrl": image.asset->url,
  "itemTypeName": itemType->name, "sportNames": sports[]->name,
  "athleteNames": sportsmen[]->name, "teamNames": teams[]->name, isLatest
}`);

let allItems = [];

async function loadVault() {
    try {
        const response = await fetch(BASE_URL + MAIN_QUERY);
        const { result } = await response.json();
        allItems = result || [];
        
        // Render Latest Arrivals once and leave them alone
        const latestItems = allItems.filter(i => i.isLatest);
        renderSpecificGrid('latestGrid', latestItems);
        
        // Render Main Vault
        renderSpecificGrid('sportGrid', allItems, true);
        
        setupFilters();
        setupSearch();
    } catch (e) { console.error("Load Error:", e); }
}

function renderSpecificGrid(gridId, items, shuffle = false) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = '';
    
    const displayItems = shuffle ? [...items].sort(() => 0.5 - Math.random()) : items;
    displayItems.forEach(item => grid.appendChild(createCard(item)));
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
            ${item.itemTypeName ? `<span class="type-badge clickable" onclick="goToFilter('type','${item.itemTypeName}')">${item.itemTypeName}</span>` : ''}
        </div>
        <div class="card-info">
            <div class="tags-row">
                ${item.year ? `<span class="year-label clickable" onclick="goToFilter('year','${item.year}')">${item.year}</span>` : ''}
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

function goToFilter(type, val) {
    window.location.href = `filter.html?${type}=${encodeURIComponent(val)}`;
}

function setupFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.filter-btn.active')?.classList.remove('active');
            btn.classList.add('active');
            const sport = btn.getAttribute('data-sport');
            // ONLY updates the main vault grid
            const filtered = (sport === 'all' ? allItems : allItems.filter(i => i.sportNames?.includes(sport)));
            renderSpecificGrid('sportGrid', filtered, true);
            window.location.hash = "collection";
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
            const year = (item.year || "").toLowerCase();
            return title.includes(term) || athletes.includes(term) || sports.includes(term) || year.includes(term);
        });
        // ONLY updates the main vault grid
        renderSpecificGrid('sportGrid', filtered, true);
    });

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = "";
            clearBtn.style.display = "none";
            renderSpecificGrid('sportGrid', allItems, true);
        });
    }
}

document.addEventListener('DOMContentLoaded', loadVault);