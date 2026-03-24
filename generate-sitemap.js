const fs = require('fs');

const PROJECT_ID = 'dpcpc70i';
const DATASET = 'production';
const BASE_URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=`;

// Make sure this matches your exact live URL!
const SITE_URL = 'https://anay-tst.github.io/7-Islands-Memorabilia';

async function generateSitemap() {
    console.log("Fetching live data from Sanity...");

    // Query all items, active sports, and active legends
    const query = encodeURIComponent(`{
        "items": *[_type == "memorabilia"]{title},
        "sports": *[_type == "sport" && count(*[_type == "memorabilia" && references(^._id)]) > 0]{name},
        "legends": *[_type == "sportsman" && count(*[_type == "memorabilia" && references(^._id)]) > 0]{name}
    }`);

    try {
        const resp = await fetch(BASE_URL + query);
        const { result } = await resp.json();

        let urls = [];

        // 1. Add Core Static Pages
        const staticPages = [
            '', 
            '/vault.html', 
            '/sports.html', 
            '/celebrities.html', 
            '/encounters.html', 
            '/testimonials.html'
        ];
        
        staticPages.forEach(page => {
            urls.push(`${SITE_URL}${page}`);
        });

        // 2. Add Dynamic Vault Items
        if (result.items) {
            result.items.forEach(item => {
                urls.push(`${SITE_URL}/item.html?name=${encodeURIComponent(item.title)}`);
            });
        }

        // 3. Add Dynamic Sport Categories
        if (result.sports) {
            result.sports.forEach(sport => {
                urls.push(`${SITE_URL}/filter.html?sport=${encodeURIComponent(sport.name)}`);
            });
        }

        // 4. Add Dynamic Legend Profiles
        if (result.legends) {
            result.legends.forEach(legend => {
                urls.push(`${SITE_URL}/filter.html?athlete=${encodeURIComponent(legend.name)}`);
            });
        }

        // Build the XML String
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.map(url => `
    <url>
        <loc>${url.replace(/&/g, '&amp;')}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`).join('')}
</urlset>`;

        // Save the file
        fs.writeFileSync('sitemap.xml', xml.trim());
        console.log(`✅ sitemap.xml generated successfully with ${urls.length} URLs!`);

    } catch (error) {
        console.error("Error generating sitemap:", error);
    }
}

// Run the function
generateSitemap();