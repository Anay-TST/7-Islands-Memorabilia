const PROJECT_ID = 'dpcpc70i';
const DATASET = 'production';
const BASE_URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=`;

function getEmoji(s) {
    const e = { 'Cricket': '🏏', 'Football': '⚽', 'Tennis': '🎾', 'NBA': '🏀', 'F1': '🏎️' };
    return e[s] || '🏆';
}

async function loadHomeContent() {
    const query = encodeURIComponent(`{
        "testimonials": *[_type == "testimonial"]{ name, quote, "vUrl": videoFile.asset->url, "iUrl": image.asset->url },
        "encounters": *[_type == "encounter"] | order(date desc)[0...3]{ title, "iUrl": image.asset->url, "vUrl": videoFile.asset->url },
        "sports": *[_type == "sport"] | order(name asc) { name, "count": count(*[_type == "memorabilia" && references(^._id)]) }
    }`);

    try {
        const { result } = await (await fetch(BASE_URL + query)).json();

        // 1. Icons
        document.getElementById('sports-icons-row').innerHTML = result.sports.map(s => `
            <a href="filter.html?sport=${s.name}" style="text-decoration:none; text-align:center;">
                <div class="icon-circle"><span>${getEmoji(s.name)}</span></div>
                <p style="font-size:0.5rem; color:var(--gold); margin-top:5px;">${s.name.toUpperCase()}</p>
            </a>`).join('');

        // 2. Testimonial Media Logic
        if (result.testimonials?.length) {
            const t = result.testimonials[Math.floor(Math.random() * result.testimonials.length)];
            let mediaHtml = '';
            if (t.vUrl) mediaHtml = `<video class="sidebar-media" autoplay muted loop playsinline><source src="${t.vUrl}"></video>`;
            else if (t.iUrl) mediaHtml = `<img src="${t.iUrl}" class="sidebar-media">`;
            
            document.getElementById('testimonial-display').innerHTML = `
                ${mediaHtml}
                <p style="font-style:italic; font-size:0.8rem; color:#ccc;">"${t.quote}"</p>
                <h4 class="gold-text" style="font-size:0.7rem; margin-top:5px;">— ${t.name}</h4>`;
        }

        // 3. Encounters
        if (result.encounters?.length) {
            const e = result.encounters[0];
            const media = e.vUrl ? `<video class="sidebar-media" autoplay muted loop playsinline><source src="${e.vUrl}"></video>` : `<img src="${e.iUrl}" class="sidebar-media">`;
            document.getElementById('encounter-display').innerHTML = `${media}<p style="font-size:0.75rem; font-weight:700;">${e.title}</p>`;
        }
    } catch (err) { console.error(err); }
}

async function loadVault() {
    const query = encodeURIComponent(`*[_type == "memorabilia"]{ title, "iUrl": image.asset->url, "sNames": sports[]->name, isLatest }`);
    try {
        const { result } = await (await fetch(BASE_URL + query)).json();
        
        const render = (gridId, items) => {
            const grid = document.getElementById(gridId);
            if (!grid) return;
            grid.innerHTML = items.map(i => `
                <div class="sport-card">
                    <div class="img-container"><img src="${i.iUrl}"></div>
                    <div style="padding:12px;">
                        <h3 style="font-size:0.85rem; margin:0;">${i.title}</h3>
                        <p class="gold-text" style="font-size:0.65rem; margin-top:5px;">${(i.sNames || []).join(', ')}</p>
                    </div>
                </div>`).join('');
        };

        render('latestGrid', result.filter(x => x.isLatest));
        render('sportGrid', result); // Smaller cards via CSS 'small-grid' class
        
        const vaultCount = document.querySelector('#collection .section-title');
        if (vaultCount) vaultCount.innerHTML = `THE <span class="gold-text">${result.length}+</span> VAULT`;
    } catch (err) { console.error(err); }
}

document.addEventListener('DOMContentLoaded', () => {
    loadHomeContent();
    loadVault();
});