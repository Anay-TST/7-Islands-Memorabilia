// Array of Sports (You can add all 100+ here)
const sports = [
    { name: "Cricket", img: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500" },
    { name: "Football", img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500" },
    { name: "Tennis", img: "https://images.unsplash.com/photo-1595435064214-04d178f24baf?w=500" },
    { name: "Basketball", img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500" },
    { name: "F1 Racing", img: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=500" },
    { name: "Golf", img: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=500" },
    // Add more sports as needed...
];

const grid = document.getElementById('sportGrid');

// Function to load the gallery
function loadSports() {
    sports.forEach(sport => {
        const card = document.createElement('div');
        card.className = 'sport-card';
        card.innerHTML = `
            <img src="${sport.img}" alt="${sport.name} Memorabilia">
            <h3>${sport.name}</h3>
        `;
        grid.appendChild(card);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', loadSports);

// Optional: Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});