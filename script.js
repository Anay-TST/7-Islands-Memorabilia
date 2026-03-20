const PROJECT_ID = 'dpcpc70i';
const DATASET = 'production';

// GROQ Query updated to fetch multiple sportsmen names
const QUERY = encodeURIComponent(`*[_type == "memorabilia"]{
  title,
  description,
  "imageUrl": image.asset->url,
  "sportName": sport->name,
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
    } catch (error) {
        console.error('Vault Error:', error);
    }
}

function renderGrids(items) {
    const mainGrid = document.getElementById('sportGrid');
    const latestGrid = document.getElementById('latestGrid');
    
    mainGrid.innerHTML = '';
    if (latestGrid) latestGrid.innerHTML = '';

    items.forEach(item => {
        const athletes = item.athleteNames ? item.athleteNames.join(', ') : '';
        
        const card = document.createElement('div');
        card.className = 'sport-card';
        card.innerHTML = `
            <div class="card-image-container">
                <img src="${item.imageUrl}" alt="${item.title}">
            </div>
            <div class="card-info">
                <span class="sport-tag">${item.sportName || 'History'}</span>
                <h3>${item.title}</h3>
                <p class="athlete-name">${athletes}</p>
                <p class="item-description">${item.description || ''}</p>
            </div>
        `;

        if (item.isLatest && latestGrid) {
            latestGrid.appendChild(card.cloneNode(true));
        }
        mainGrid.appendChild(card);
    });
}

// Search Functionality
document.getElementById('vaultSearch')?.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allItems.filter(item => {
        const athletes = item.athleteNames ? item.athleteNames.join(' ').toLowerCase() : '';
        return item.title.toLowerCase().includes(term) || 
               athletes.includes(term) || 
               (item.sportName && item.sportName.toLowerCase().includes(term));
    });
    renderGrids(filtered);
});

document.addEventListener('DOMContentLoaded', loadVault);