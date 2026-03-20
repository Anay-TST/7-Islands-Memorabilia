const PROJECT_ID = 'dpcpc70i'; // Verify this matches your manage.sanity.io
const DATASET = 'production';
const QUERY = encodeURIComponent(`*[_type == "memorabilia"]{
  title,
  "imageUrl": image.asset->url,
  "sportName": sport->name,
  "athleteName": sportsman->name,
  isLatest
}`);

const URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY}`;

// Mobile Menu Toggle
const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.nav-links');

if (menu) {
    menu.addEventListener('click', function() {
        menuLinks.classList.toggle('active');
    });
}

async function loadVault() {
    const mainGrid = document.getElementById('sportGrid');
    const latestGrid = document.getElementById('latestGrid');
    
    try {
        const response = await fetch(URL);
        const { result } = await response.json();

        // Clear existing content
        mainGrid.innerHTML = '';
        if (latestGrid) latestGrid.innerHTML = '';

        if (!result || result.length === 0) {
            mainGrid.innerHTML = '<p class="status-msg">The vault is being polished...</p>';
            return;
        }

        result.forEach(item => {
            // Create the card element
            const card = document.createElement('div');
            card.className = 'sport-card';
            
            card.innerHTML = `
                <div class="card-image-container">
                    <img src="${item.imageUrl}" alt="${item.title}">
                </div>
                <div class="card-info">
                    <span class="sport-tag">${item.sportName || 'Collection'}</span>
                    <h3>${item.title}</h3>
                    <p class="athlete-name">${item.athleteName || ''}</p>
                </div>
            `;

            // Logic: If "isLatest" is checked in Sanity, add to top grid
            if (item.isLatest && latestGrid) {
                const latestCard = card.cloneNode(true);
                latestGrid.appendChild(latestCard);
            }

            // Always add to the main 100+ Vault
            mainGrid.appendChild(card);
        });

    } catch (error) {
        console.error('Vault Error:', error);
        mainGrid.innerHTML = '<p style="color:var(--gold);">Error connecting to the Vault.</p>';
    }
}

document.addEventListener('DOMContentLoaded', loadVault);