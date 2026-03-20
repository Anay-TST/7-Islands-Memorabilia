/**
 * 7 ISLANDS MEMORABILIA - VAULT ENGINE
 * Project ID: dpcpc70i
 */

const PROJECT_ID = 'dpcpc70i';
const DATASET = 'production';

// The GROQ Query: Pulls Item Title, Image, Sport Name, and Athlete Name
const QUERY = encodeURIComponent(`*[_type == "memorabilia"]{
  title,
  "imageUrl": image.asset->url,
  "sportName": sport->name,
  "athleteName": sportsman->name,
  isLatest
}`);

const URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY}`;

// 1. Mobile Menu Toggle
const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.nav-links');

if (menu) {
    menu.addEventListener('click', function() {
        menuLinks.classList.toggle('active');
    });
}

// 2. Fetch and Load the Vault from Sanity
async function loadVault() {
    const grid = document.getElementById('sportGrid');
    
    try {
        const response = await fetch(URL);
        const { result } = await response.json();

        // Clear the "Sample" placeholders
        grid.innerHTML = '';

        if (!result || result.length === 0) {
            grid.innerHTML = '<p style="color:white; text-align:center; width:100%;">The vault is currently being polished. Check back soon!</p>';
            return;
        }

        // Loop through each piece of memorabilia from Sanity
        result.forEach(item => {
            const card = document.createElement('div');
            card.className = 'sport-card';
            
            // Build the Purple & Gold Card
            card.innerHTML = `
                <div class="card-image-container">
                    <img src="${item.imageUrl || 'https://via.placeholder.com/400x400/1a0a2e/D4AF37?text=7+Islands'}" alt="${item.title}">
                </div>
                <div class="card-info">
                    <span class="sport-tag">${item.sportName || 'Collection'}</span>
                    <h3>${item.title}</h3>
                    <p class="athlete-name">${item.athleteName || ''}</p>
                    ${item.isLatest ? '<span class="latest-badge">New Arrival</span>' : ''}
                </div>
            `;
            grid.appendChild(card);
        });

    } catch (error) {
        console.error('Vault Error:', error);
        grid.innerHTML = '<p style="color:var(--gold);">Error connecting to the Vault. Please refresh.</p>';
    }
}

// Initialize the Museum on load
document.addEventListener('DOMContentLoaded', loadVault);