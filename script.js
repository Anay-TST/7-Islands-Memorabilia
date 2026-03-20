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

    const itemUrl = `item.html?name=${encodeURIComponent(item.title)}`;

    // Pure HTML linking. Image goes to item.html. Tags go to filter.html. No javascript conflicts.
    card.innerHTML = `
        <a href="${itemUrl}" style="display: block; height: 300px; background: #000; position: relative; border-bottom: 2px solid var(--gold); text-decoration: none; overflow: hidden;">
            <img src="${item.imageUrl}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: contain; padding: 15px; transition: 0.3s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            ${item.itemType ? `<span style="position: absolute; top: 15px; right: 15px; background: var(--gold); color: black; padding: 4px 10px; font-size: 0.6rem; font-weight: 900; border-radius: 4px; z-index: 10;">${item.itemType}</span>` : ''}
        </a>
        <div class="card-info" style="padding: 1.5rem;">
            <div class="tags-row" style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
                ${item.year ? `<a href="filter.html?year=${encodeURIComponent(item.year)}" style="color: rgba(255,255,255,0.4); font-size: 0.75rem; font-weight: 900; text-decoration: none;" onmouseover="this.style.color='var(--gold)'" onmouseout="this.style.color='rgba(255,255,255,0.4)'">${item.year}</a>` : ''}
                ${item.sportNames ? item.sportNames.map(s => `<a href="filter.html?sport=${encodeURIComponent(s)}" style="background: rgba(212,175,55,0.1); color: var(--gold); padding: 4px 10px; border-radius: 4px; font-size: 0.65rem; font-weight: 900; text-decoration: none;" onmouseover="this.style.background='var(--gold)'; this.style.color='black'" onmouseout="this.style.background='rgba(212,175,55,0.1)'; this.style.color='var(--gold)'">${s}</a>`).join('') : ''}
            </div>
            <h3 style="margin-bottom: 10px; font-size: 1.2rem; line-height: 1.3;">
                <a href="${itemUrl}" style="color: white; text-decoration: none;" onmouseover="this.style.color='var(--gold)'" onmouseout="this.style.color='white'">${item.title}</a>
            </h3>
            ${item.venueName ? `<p style="font-size: 0.75rem; color: var(--gold); text-transform: uppercase; margin-bottom: 10px;">
                <a href="filter.html?venue=${encodeURIComponent(item.venueName)}" style="color: inherit; text-decoration: none;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">📍 ${item.venueName}</a>
            </p>` : ''}
            <div class="athlete-row" style="display: flex; flex-wrap: wrap; gap: 10px;">
                ${item.athleteNames ? item.athleteNames.map(a => `<a href="filter.html?athlete=${encodeURIComponent(a)}" style="color: var(--gold); font-weight: 700; font-size: 0.9rem; text-decoration: none;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${a}</a>`).join('') : ''}
            </div>
        </div>`;
    return card;
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
            const year = (item.year || "").toLowerCase();
            return title.includes(term) || athletes.includes(term) || sports.includes(term) || year.includes(term);
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