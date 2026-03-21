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
    } catch (e) { console.error("Error loading navbar:", e); }
}

// --- HOME PAGE RANDOM HIGHLIGHTS & SPORTS ICONS ---
async function loadHomeContent() {
    const tDisplay = document.getElementById('testimonial-display');
    const eDisplay = document.getElementById('encounter-display');
    const sIcons = document.getElementById('sports-icons-row');
    
    const query = encodeURIComponent(`{
        "testimonials": *[_type == "testimonial"]{ name, role, quote },
        "encounters": *[_type == "encounter"] | order(date desc)[0...10]{ 
            title, "imageUrl": image.asset->url, "videoFileUrl": videoFile.asset->url
        },
        "sports": *[_type == "sport"] | order(name asc) {
            name,
            "itemCount": count(*[_type == "memorabilia" && references(^._id)])
        }
    }`);

    try {
        const resp = await fetch(BASE_URL + query);
        const { result } = await resp.json();

        // Load Sports Icons
        if (sIcons && result.sports) {
            sIcons.innerHTML = result.sports.map(s => `
                <a href="filter.html?sport=${encodeURIComponent(s.name)}" style="text-decoration:none; text-align:center; min-width:60px;">
                    <div style="background: rgba(212,175,55,0.1); width:50px; height:50px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:1px solid var(--gold); margin: 0 auto 8px; transition:0.3s;" onmouseover="this.style.background='var(--gold)';" onmouseout="this.style.background='rgba(212,175,55,0.1)';">
                        <span style="font-size:1.2rem;">${getEmoji(s.name)}</span>
                    </div>
                    <p style="font-size:0.6rem; color:var(--gold); font-weight:900; text-transform:uppercase; margin:0;">${s.name}</p>
                    <p style="font-size:0.5rem; opacity:0.5; margin:0; color:white;">${s.itemCount}</p>
                </a>
            `).join('');
        }

        // Random Testimonial
        if (tDisplay && result.testimonials?.length > 0) {
            const t = result.testimonials[Math.floor(Math.random() * result.testimonials.length)];
            tDisplay.innerHTML = `
                <p style="font-style: italic; font-size: 0.85rem; line-height: 1.5; color: #ccc; margin-bottom:10px;">"${t.quote.substring(0, 100)}..."</p>
                <h4 class="gold-text" style="font-size: 0.8rem; text-transform: uppercase;">— ${t.name}</h4>
            `;
        }

        // Random Encounter
        if (eDisplay && result.encounters?.length > 0) {
            const enc = result.encounters[Math.floor(Math.random() * result.encounters.length)];
            const media = enc.videoFileUrl 
                ? `<video muted playsinline autoplay loop style="width:100%; height:100%; object-fit:cover;"><source src="${enc.videoFileUrl}"></video>`
                : `<img src="${enc.imageUrl}" style="width:100%; height:100%; object-fit:cover;">`;
            
            eDisplay.innerHTML = `
                <a href="encounters.html" style="text-decoration:none; color:inherit;">
                    <div style="height:120px; overflow:hidden; border-radius:8px; margin-bottom:10px; border:1px solid rgba(212,175,55,0.2); background:#000;">
                        ${media}
                    </div>
                    <h3 style="font-size:0.8rem; color:var(--gold); text-transform: uppercase; letter-spacing:1px;">${enc.title}</h3>
                </a>
            `;
        }
    } catch (e) { console.error("Home Content Error:", e); }
}

function getEmoji(sport) {
    const emojis = { 'Cricket': '🏏', 'Football': '⚽', 'Basketball': '🏀', 'NBA': '🏀', 'F1': '🏎️', 'Tennis': '🎾', 'Golf': '⛳', 'Boxing': '🥊' };
    return emojis[sport] || '🏆';
}

// --- VAULT LOGIC ---
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
            ${item.itemType ? `<span style="position: absolute; top: 15px; right: 15px; background: var(--gold); color: black; padding: 4px 10px; font-size: 0.6rem; font-weight: 900; border-radius: 4px;">${item.itemType}</span>` : ''}
        </a>
        <div class="card-info" style="padding: 1.5rem;">
            <div class="tags-row" style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
                ${item.year ? `<a href="filter.html?year=${encodeURIComponent(item.year)}" style="color: rgba(255,255,255,0.4); font-size: 0.75rem; font-weight: 900; text-decoration: none;">${item.year}</a>` : ''}
                ${item.sportNames ? item.sportNames.map(s => `<a href="filter.html?sport=${encodeURIComponent(s)}" style="background: rgba(212,175,55,0.1); color: var(--gold); padding: 4px 10px; border-radius: 4px; font-size: 0.65rem; font-weight: 900; text-decoration: none;">${s}</a>`).join('') : ''}
            </div>
            <h3 style="margin-bottom: 10px; font-size: 1.1rem; line-height: 1.3;"><a href="${itemUrl}" style="color: white; text-decoration: none;">${item.title}</a></h3>
            <div class="athlete-row">
                ${item.athleteNames ? item.athleteNames.map(a => `<a href="filter.html?athlete=${encodeURIComponent(a)}" style="color: var(--gold); font-weight: 700; font-size: 0.85rem; text-decoration: none;">${a}</a>`).join('') : ''}
            </div>
        </div>`;
    return card;
}

function setupSearch() {
    const searchInput = document.getElementById('vaultSearch');
    if(!searchInput) return;
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allItems.filter(item => {
            const title = (item.title || "").toLowerCase();
            const athletes = (item.athleteNames || []).join(" ").toLowerCase();
            const sports = (item.sportNames || []).join(" ").toLowerCase();
            return title.includes(term) || athletes.includes(term) || sports.includes(term);
        });
        renderGrid('sportGrid', filtered, true);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadNavbar();
    loadVault();
    loadHomeContent();
});