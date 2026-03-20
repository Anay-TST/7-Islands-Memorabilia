// Mobile Menu Toggle
const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.nav-links');

menu.addEventListener('click', function() {
    menuLinks.classList.toggle('active');
    // Add CSS for .nav-links.active to show the menu in your style.css
});

// Sports Data (Sample)
const sports = [
    { name: "Cricket", img: "https://via.placeholder.com/400x400/1a0a2e/D4AF37?text=Cricket" },
    { name: "Football", img: "https://via.placeholder.com/400x400/1a0a2e/D4AF37?text=Football" },
    { name: "F1 Racing", img: "https://via.placeholder.com/400x400/1a0a2e/D4AF37?text=F1" },
    { name: "Basketball", img: "https://via.placeholder.com/400x400/1a0a2e/D4AF37?text=NBA" }
];

const grid = document.getElementById('sportGrid');

function loadSports() {
    sports.forEach(sport => {
        const card = document.createElement('div');
        card.className = 'sport-card';
        card.innerHTML = `<img src="${sport.img}"><h3>${sport.name}</h3>`;
        grid.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', loadSports);