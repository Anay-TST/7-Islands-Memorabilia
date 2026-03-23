const PROJECT_ID = 'dpcpc70i';
const DATASET = 'production';
const BASE_URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=`;

function getEmoji(sport) {
    const emojis = { 'Cricket': '🏏', 'Football': '⚽', 'Tennis': '🎾', 'NBA': '🏀', 'Basketball': '🏀', 'F1': '🏎️', 'Golf': '⛳' };
    return emojis[sport] || '🏆';
}

// Function to expand the testimonial quote
window.expandQuote = function() {
    document.getElementById('t-quote-short').style.display = 'none';
    document.getElementById('t-quote-full').style.display = 'block';
};

async function loadHomeContent() {
    const query = encodeURIComponent(`{
        "testimonials": *[_type == "testimonial"]{ name, quote, "vUrl": videoFile.asset->url, "iUrl": image.asset->url },
        "encounters": *[_type == "encounter"] | order(date desc)[0...5]{ title, "imageUrl": image.asset->url, "videoFileUrl": videoFile.asset->url },
        "sports": *[_type == "sport"] | order(name asc) { name, "itemCount": count(*[_type == "memorabilia" && references(^._id)]) },
        "legends": *[_type == "sportsman"] { name, "itemCount": count(*[_type == "memorabilia" && references(^._id)]) } | order(itemCount desc)[0...6]
    }`);

    try {
        const resp = await fetch(BASE_URL + query);
        const { result } = await resp.json();

        // 1. Sports Icons
        const iconRow = document.getElementById('sports-icons-row');
        if (iconRow && result.sports) {
            iconRow.innerHTML = result.sports.map(s => `
                <a href="filter.html?sport=${encodeURIComponent(s.name)}" style="text-decoration:none; text-align:center;">
                    <div class="icon-circle"><span>${getEmoji(s.name)}</span></div>
                    <p style="font-size:0.6rem; color:var(--gold); font-weight:900; margin-top:5px;">${s.name.toUpperCase()}</p>
                    <p style="font-size:0.5rem; opacity:0.5; color:white;">${s.itemCount}</p>
                </a>`).join('');
        }

        // 2. Top Legends Icons
        const legendsRow = document.getElementById('legends-icons-row');
        if (legendsRow && result.legends) {
            legendsRow.innerHTML = result.legends.map(l => {
                const initials = l.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
                return `
                <a href="filter.html?athlete=${encodeURIComponent(l.name)}" style="text-decoration:none; text-align:center; min-width: 60px;">
                    <div class="icon-circle" style="background:rgba(212,175,55,0.05); color:var(--gold); font-family:'Arvo', serif; font-size:1.2rem;">${initials}</div>
                    <p style="font-size:0.6rem; color:var(--gold); font-weight:900; margin-top:5px; max-width: 60px; line-height: 1.2; margin-left: auto; margin-right: auto;">${l.name.toUpperCase()}</p>
                    <p style="font-size:0.5rem; opacity:0.5; color:white;">${l.itemCount} ITEMS</p>
                </a>`;
            }).join('');
        }

        // 3. Testimonials (With Sound Controls & "See More" logic)
        if (result.testimonials?.length > 0) {
            const t = result.testimonials[Math.floor(Math.random() * result.testimonials.length)];
            
            let mediaHtml = '';
            if (t.vUrl) {
                // ADDED controls and REMOVED muted so sound can be played
                mediaHtml = `<video class="sidebar-media" controls autoplay playsinline><source src="${t.vUrl}"></video>`;
            } else if (t.iUrl) {
                mediaHtml = `<img src="${t.iUrl}" class="sidebar-media" alt="Testimonial">`;
            }

            const isLong = t.quote.length > 60;
            const shortQuote = isLong ? t.quote.substring(0, 60) + "..." : t.quote;
            const seeMoreBtn = isLong ? `<span style="color:var(--gold); cursor:pointer; font-weight:900; margin-left:5px; text-decoration: underline;" onclick="expandQuote()">See More</span>` : '';

            document.getElementById('testimonial-display').innerHTML = `
                ${mediaHtml}
                <div id="t-quote-short" style="font-style:italic; font-size:0.85rem; color:#ccc; line-height:1.4;">
                    "${shortQuote}" ${seeMoreBtn}
                </div>
                <div id="t-quote-full" style="display:none; font-style:italic; font-size:0.85rem; color:#ccc; line-height:1.4;">
                    "${t.quote}"
                </div>
                <h4 class="gold-text" style="font-size:0.75rem; margin-top:8px;">— ${t.name}</h4>`;
        }

        // 4. Encounters
        if (result.encounters?.length > 0) {
            const e = result.encounters[Math.floor(Math.random() * result.encounters.length)];
            const media = e.videoFileUrl ? `<video muted playsinline autoplay loop style="width:100%; border-radius:8px;"><source src="${e.videoFileUrl}"></video>` : `<img src="${e.imageUrl}" style="width:100%; border-radius:8px;">`;
            document.getElementById('encounter-display').innerHTML = `<div style="margin-top:10px;">${media}<p style="font-size:0.8rem; margin-top:8px; font-weight:700;">${e.title}</p></div>`;
        }
    } catch (err) { console.error("Data Load Error:", err); }
}

async function loadVault() {
    const query = encodeURIComponent(`*[_type == "memorabilia"]{ title, "imageUrl": image.asset->url, "itemType": itemType->name, "sportNames": sports[]->name, isLatest }`);
    try {
        const resp = await fetch(BASE_URL + query);
        const { result } = await resp.json();
        
        // Update Dynamic Count
        const countTitle = document.getElementById('dynamic-vault-count');
        if (countTitle && result.length) {
            countTitle.innerHTML = `${result.length}+ VAULT`;
        }

        const render = (id, items) => {
            const grid = document.getElementById(id);
            if (!grid) return;
            
            const isSmall = id === 'sportGrid';
            const imgHeight = isSmall ? '150px' : '220px';
            const titleSize = isSmall ? '0.85rem' : '1rem';

            grid.innerHTML = items.map(i => `
                <div class="sport-card">
                    <div style="background:#000; width:100%; height:${imgHeight}; display:flex; align-items:center; justify-content:center;">
                        <img src="${i.imageUrl}" style="max-width:100%; max-height:100%; object-fit:contain; padding:10px;">
                    </div>
                    <div style="padding:15px;">
                        <h3 style="font-size:${titleSize}; margin-bottom: 5px;">${i.title}</h3>
                        <p class="gold-text" style="font-size:0.8rem;">${(i.sportNames || []).join(', ')}</p>
                    </div>
                </div>`).join('');
        };
        
        render('latestGrid', result.filter(i => i.isLatest));
        render('sportGrid', result);
    } catch (err) { console.error("Vault Error:", err); }
}

document.addEventListener('DOMContentLoaded', () => {
    loadHomeContent();
    loadVault();
});