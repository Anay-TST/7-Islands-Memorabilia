const PROJECT_ID = 'dpcpc70i';
const DATASET = 'production';
const BASE_URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=`;

// --- DYNAMIC NAVBAR LOADER ---
async function loadNavbar() {
    const placeholder = document.getElementById('navbar-placeholder');
    if (!placeholder) return;

    try {
        const response = await fetch('navbar.html');
        const navHtml = await response.text();
        placeholder.innerHTML = navHtml;

        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-links .nav-item');
        
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
                link.classList.add('active');
            }
        });
    } catch (e) {
        console.error("Error loading navbar:", e);
    }
}

// --- HOME PAGE RANDOM HIGHLIGHTS ---
async function loadHomeHighlights() {
    const tDisplay = document.getElementById('testimonial-display');
    const eDisplay = document.getElementById('encounter-display');
    if (!tDisplay || !eDisplay) return;

    // Fetch up to 20 of each to randomize locally
    const query = encodeURIComponent(`{
        "testimonials": *[_type == "testimonial"]{ name, role, quote },
        "encounters": *[_type == "encounter"] | order(date desc)[0...15]{ 
            title, date, "imageUrl": image.asset->url, "videoFileUrl": videoFile.asset->url, "athleteName": sportsman->name 
        }
    }`);

    try {
        const resp = await fetch(BASE_URL + query);
        const { result } = await resp.json();

        // Randomize Testimonial
        if (result.testimonials && result.testimonials.length > 0) {
            const t = result.testimonials[Math.floor(Math.random() * result.testimonials.length)];
            tDisplay.innerHTML = `
                <p style="font-style: italic; font-size: 1.1rem; line-height: 1.6; margin-bottom: 15px; color: #eee;">"${t.quote.substring(0, 160)}${t.quote.length > 160 ? '...' : ''}"</p>
                <h4 class="gold-text" style="margin-bottom: 2px; font-size: 1rem;">${t.name}</h4>
                <p style="font-size: 0.7rem; opacity: 0.5; text-transform: uppercase; letter-spacing: 1px;">${t.role || 'Collector'}</p>
            `;
        }

        // Randomize Encounter
        if (result.encounters && result.encounters.length > 0) {
            const enc = result.encounters[Math.floor(Math.random() * result.encounters.length)];
            const mediaHTML = enc.videoFileUrl 
                ? `<video muted playsinline autoplay loop style="width:100%; height:200px; object-fit:cover; border-radius:8px; pointer-events:none;"><source src="${enc.videoFileUrl}"></video>`
                : `<img src="${enc.imageUrl || 'https://via.placeholder.com/400x200'}" style="width:100%; height:200px; object-fit:cover; border-radius:8px; border: 1px solid rgba(212,175,55,0.3);">`;
            
            eDisplay.innerHTML = `
                <div class="sport-card" style="margin:0; cursor:default; background: rgba(255,255,255,0.03);">
                    <div class="card-image-container" style="height:200px; padding:0;">${mediaHTML}</div>
                    <div class="card-info" style="padding: 1rem; text-align:center;">
                        <h3 style="font-size:0.9rem; margin-bottom:5px; color: var(--gold);">${enc.title}</h3>
                        <p style="font-size:0.7rem; opacity:0.6; font-weight: 700;">${enc.athleteName || ''} • ${enc.date || ''}</p>
                    </div>
                </div>
            `;
        }
    } catch (e) { console.error("Highlights Load Error:", e); }
}

// --- VAULT LOADING LOGIC ---
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

// --- MASTER INIT ---
document.addEventListener('DOMContentLoaded', () => {
    loadNavbar();
    loadVault();
    loadHomeHighlights();
});