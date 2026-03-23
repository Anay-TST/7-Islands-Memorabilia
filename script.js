const PROJECT_ID = 'dpcpc70i';
const DATASET = 'production';
const BASE_URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=`;

function getEmoji(sport) {
    const emojis = { 'Cricket': '🏏', 'Football': '⚽', 'Tennis': '🎾', 'NBA': '🏀', 'Basketball': '🏀', 'F1': '🏎️', 'Golf': '⛳' };
    return emojis[sport] || '🏆';
}

async function loadHomeContent() {
    const query = encodeURIComponent(`{
        "testimonials": *[_type == "testimonial"]{ name, quote, "vUrl": videoFile.asset->url, "iUrl": image.asset->url },
        "encounters": *[_type == "encounter"] | order(date desc)[0...5]{ title, "imageUrl": image.asset->url, "videoFileUrl": videoFile.asset->url },
        "sports": *[_type == "sport"] | order(name asc) { name, "itemCount": count(*[_type == "memorabilia" && references(^._id)]) }
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

        // 2. Sidebar Randomizers (Testimonials & Encounters)
        if (result.testimonials?.length > 0) {
            const t = result.testimonials[Math.floor(Math.random() * result.testimonials.length)];
            
            let mediaHtml = '';
            if (t.vUrl) {
                mediaHtml = `<video class="sidebar-media" autoplay muted loop playsinline><source src="${t.vUrl}"></video>`;
            } else if (t.iUrl) {
                mediaHtml = `<img src="${t.iUrl}" class="sidebar-media" alt="Testimonial">`;
            }

            document.getElementById('testimonial-display').innerHTML = `
                ${mediaHtml}
                <p style="font-style:italic; font-size:0.85rem; color:#ccc;">"${t.quote}"</p>
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
    const query = encodeURIComponent(`*[_type == "memorabilia"]{ title, "imageUrl": image.asset->url, "itemType": itemType->name, "sportNames": sports[]->name, isLatest }`);
    try {
        const resp = await fetch(BASE_URL + query);
        const { result } = await resp.json();
        
        // Update 100+ Count
        const countTitle = document.querySelector('#collection .section-title');
        if (countTitle && result.length) {
            countTitle.innerHTML = `THE <span class="gold-text">${result.length}+</span> VAULT`;
        }

        // Render Grids with contain and dynamic sizing
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