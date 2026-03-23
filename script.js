const PROJECT_ID = 'dpcpc70i';
const DATASET = 'production';
const BASE_URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=`;

let allItems = []; 

function shuffleArray(array) {
    let curId = array.length;
    while (0 !== curId) {
        let randId = Math.floor(Math.random() * curId);
        curId -= 1;
        let tmp = array[curId];
        array[curId] = array[randId];
        array[randId] = tmp;
    }
    return array;
}

function getEmoji(sport) {
    const emojis = { 'Cricket': '🏏', 'Football': '⚽', 'Tennis': '🎾', 'NBA': '🏀', 'Basketball': '🏀', 'F1': '🏎️', 'Golf': '⛳' };
    return emojis[sport] || '🏆';
}

window.expandQuote = function() {
    document.getElementById('t-quote-short').style.display = 'none';
    document.getElementById('t-quote-full').style.display = 'block';
};

function renderGrid(id, items) {
    const grid = document.getElementById(id);
    if (!grid) return;
    
    const isSmall = id === 'sportGrid' || id === 'fullVaultGrid';
    const imgHeight = isSmall ? '160px' : '220px';
    const titleSize = isSmall ? '0.85rem' : '1rem';

    grid.innerHTML = items.map(i => `
        <div class="sport-card">
            <div style="background:#000; width:100%; height:${imgHeight}; display:flex; align-items:center; justify-content:center;">
                <img src="${i.imageUrl}" style="max-width:100%; max-height:100%; object-fit:contain; padding:10px;">
            </div>
            <div style="padding:15px;">
                <h3 style="font-size:${titleSize}; margin-bottom: 5px;">${i.title}</h3>
                <p class="gold-text" style="font-size:0.75rem; font-weight:900;">${(i.sportNames || []).join(', ').toUpperCase()}</p>
            </div>
        </div>`).join('');
}

async function loadHomeContent() {
    if(!document.getElementById('testimonial-display')) return;

    const query = encodeURIComponent(`{
        "testimonials": *[_type == "testimonial"]{ name, quote, "vUrl": videoFile.asset->url, "iUrl": image.asset->url },
        "encounters": *[_type == "encounter"] | order(date desc)[0...5]{ title, "imageUrl": image.asset->url, "videoFileUrl": videoFile.asset->url },
        "sports": *[_type == "sport" && count(*[_type == "memorabilia" && references(^._id)]) > 0] { name, "itemCount": count(*[_type == "memorabilia" && references(^._id)]) } | order(itemCount desc),
        "legends": *[_type == "sportsman" && count(*[_type == "memorabilia" && references(^._id)]) > 0] { name, "itemCount": count(*[_type == "memorabilia" && references(^._id)]) } | order(itemCount desc)[0...6]
    }`);

    try {
        const resp = await fetch(BASE_URL + query);
        const { result } = await resp.json();

        const iconRow = document.getElementById('sports-icons-row');
        if (iconRow && result.sports) {
            iconRow.innerHTML = result.sports.map(s => `
                <a href="sports.html?sport=${encodeURIComponent(s.name)}" style="text-decoration:none; text-align:center;">
                    <div class="icon-circle"><span>${getEmoji(s.name)}</span></div>
                    <p style="font-size:0.6rem; color:var(--gold); font-weight:900; margin-top:5px;">${s.name.toUpperCase()}</p>
                    <p style="font-size:0.5rem; opacity:0.5; color:white;">${s.itemCount}</p>
                </a>`).join('');
        }

        const legendsRow = document.getElementById('legends-icons-row');
        if (legendsRow && result.legends) {
            legendsRow.innerHTML = result.legends.map(l => {
                const initials = l.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
                return `
                <a href="celebrities.html?legend=${encodeURIComponent(l.name)}" style="text-decoration:none; text-align:center; min-width: 60px;">
                    <div class="icon-circle" style="background:rgba(212,175,55,0.05); color:var(--gold); font-family:'Arvo', serif; font-size:1.2rem;">${initials}</div>
                    <p style="font-size:0.6rem; color:var(--gold); font-weight:900; margin-top:5px; max-width: 60px; line-height: 1.2; margin-left: auto; margin-right: auto;">${l.name.toUpperCase()}</p>
                    <p style="font-size:0.5rem; opacity:0.5; color:white;">${l.itemCount} ITEMS</p>
                </a>`;
            }).join('');
        }

        if (result.testimonials?.length > 0) {
            const t = result.testimonials[Math.floor(Math.random() * result.testimonials.length)];
            let mediaHtml = '';
            if (t.vUrl) mediaHtml = `<video class="sidebar-media" controls autoplay playsinline><source src="${t.vUrl}"></video>`;
            else if (t.iUrl) mediaHtml = `<img src="${t.iUrl}" class="sidebar-media" alt="Testimonial">`;

            const isLong = t.quote.length > 60;
            const shortQuote = isLong ? t.quote.substring(0, 60) + "..." : t.quote;
            const seeMoreBtn = isLong ? `<span style="color:var(--gold); cursor:pointer; font-weight:900; margin-left:5px; text-decoration: underline;" onclick="expandQuote()">See More</span>` : '';

            document.getElementById('testimonial-display').innerHTML = `
                ${mediaHtml}
                <div id="t-quote-short" style="font-style:italic; font-size:0.85rem; color:#ccc; line-height:1.4;">"${shortQuote}" ${seeMoreBtn}</div>
                <div id="t-quote-full" style="display:none; font-style:italic; font-size:0.85rem; color:#ccc; line-height:1.4;">"${t.quote}"</div>
                <h4 class="gold-text" style="font-size:0.75rem; margin-top:8px;">— ${t.name}</h4>`;
        }

        if (result.encounters?.length > 0) {
            const e = result.encounters[Math.floor(Math.random() * result.encounters.length)];
            const media = e.videoFileUrl ? `<video muted playsinline autoplay loop style="width:100%; border-radius:8px;"><source src="${e.videoFileUrl}"></video>` : `<img src="${e.imageUrl}" style="width:100%; border-radius:8px;">`;
            document.getElementById('encounter-display').innerHTML = `<div style="margin-top:10px;">${media}<p style="font-size:0.8rem; margin-top:8px; font-weight:700;">${e.title}</p></div>`;
        }
    } catch (err) { console.error("Data Load Error:", err); }
}

async function loadVault() {
    const query = encodeURIComponent(`*[_type == "memorabilia"]{ title, year, "imageUrl": image.asset->url, "itemType": itemType->name, "sportNames": sports[]->name, "athleteNames": sportsmen[]->name, isLatest }`);
    try {
        const resp = await fetch(BASE_URL + query);
        const { result } = await resp.json();
        allItems = result || [];

        const countTitle = document.getElementById('dynamic-vault-count');
        if (countTitle && allItems.length) countTitle.innerHTML = `${allItems.length}+ VAULT`;

        // LATEST GRID
        if (document.getElementById('latestGrid')) {
            renderGrid('latestGrid', allItems.filter(i => i.isLatest).slice(0, 3));
        }

        // HOME PAGE VAULT: Limit to exactly 8 random items (2 rows of 4)
        if (document.getElementById('sportGrid')) {
            renderGrid('sportGrid', shuffleArray([...allItems]).slice(0, 8));
        }

        // VAULT PAGE (vault.html)
        if (document.getElementById('fullVaultGrid')) {
            setupFullVaultSearch();
        }
        
        setupSearch(); 
    } catch (err) { console.error("Vault Error:", err); }
}

function setupSearch() {
    const searchInput = document.getElementById('vaultSearch');
    const seeMoreBtn = document.getElementById('see-more-container');
    if(!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        if(term === '') {
            renderGrid('sportGrid', shuffleArray([...allItems]).slice(0, 8)); // Return to 8 on clear
            if(seeMoreBtn) seeMoreBtn.style.display = 'block';
        } else {
            const filtered = allItems.filter(item => {
                const title = (item.title || "").toLowerCase();
                const athletes = (item.athleteNames || []).join(" ").toLowerCase();
                const sports = (item.sportNames || []).join(" ").toLowerCase();
                const year = (item.year || "").toString().toLowerCase();
                return title.includes(term) || athletes.includes(term) || sports.includes(term) || year.includes(term);
            });
            renderGrid('sportGrid', filtered); // Show all search results dynamically
            if(seeMoreBtn) seeMoreBtn.style.display = 'none';
        }
    });
}

function setupFullVaultSearch() {
    const searchInput = document.getElementById('fullVaultSearch');
    const sportFilter = document.getElementById('sportFilter');
    const latestFilter = document.getElementById('latestFilter');
    
    if(!searchInput && !sportFilter && !latestFilter) return;

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('filter') === 'latest' && latestFilter) {
        latestFilter.checked = true;
    }

    function filterFullVault() {
        const term = searchInput ? searchInput.value.toLowerCase() : '';
        const sport = sportFilter ? sportFilter.value.toLowerCase() : '';
        const onlyLatest = latestFilter ? latestFilter.checked : false;

        const filtered = allItems.filter(item => {
            const title = (item.title || "").toLowerCase();
            const athletes = (item.athleteNames || []).join(" ").toLowerCase();
            const sportsArr = (item.sportNames || []).map(s => s.toLowerCase());
            const sportsString = sportsArr.join(" ");
            const year = (item.year || "").toString().toLowerCase();
            
            const matchesSearch = title.includes(term) || athletes.includes(term) || sportsString.includes(term) || year.includes(term);
            const matchesSport = sport === '' || sportsArr.includes(sport);
            const matchesLatest = onlyLatest ? item.isLatest : true;

            return matchesSearch && matchesSport && matchesLatest;
        });
        
        renderGrid('fullVaultGrid', filtered);
    }

    if(searchInput) searchInput.addEventListener('input', filterFullVault);
    if(sportFilter) sportFilter.addEventListener('change', filterFullVault);
    if(latestFilter) latestFilter.addEventListener('change', filterFullVault);

    filterFullVault();
}

document.addEventListener('DOMContentLoaded', () => {
    loadHomeContent();
    loadVault();
});