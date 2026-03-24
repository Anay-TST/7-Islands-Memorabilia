const fs = require('fs');

const PROJECT_ID = 'dpcpc70i';
const DATASET = 'production';
const BASE_URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=`;
const SITE_URL = 'https://anay-tst.github.io/7-Islands-Memorabilia';

async function generateSitemap() {
    console.log("Fetching live data from Sanity...");

    const query = encodeURIComponent(`{
        "items": *[_type == "memorabilia"]{title},
        "sports": *[_type == "sport" && count(*[_type == "memorabilia" && references(^._id)]) > 0]{name},
        "legends": *[_type == "sportsman" && count(*[_type == "memorabilia" && references(^._id)]) > 0]{name}
    }`);

    try {
        const resp = await fetch(BASE_URL + query);
        const { result } = await resp.json();

        let urls = [];

        // 1. Add Core Static Pages (No .html)
        const staticPages = ['', '/vault', '/sports', '/celebrities', '/encounters', '/testimonials'];
        staticPages.forEach(page => urls.push(`${SITE_URL}${page}`));

        // 2. Add Dynamic Vault Items (No .html)
        if (result.items) {
            result.items.forEach(item => urls.push(`${SITE_URL}/item?name=${encodeURIComponent(item.title)}`));
        }

        // 3. Add Dynamic Sport Categories (No .html)
        if (result.sports) {
            result.sports.forEach(sport => urls.push(`${SITE_URL}/filter?sport=${encodeURIComponent(sport.name)}`));
        }

        // 4. Add Dynamic Legend Profiles (No .html)
        if (result.legends) {
            result.legends.forEach(legend => urls.push(`${SITE_URL}/filter?athlete=${encodeURIComponent(legend.name)}`));
        }

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.map(url => `
    <url>
        <loc>${url.replace(/&/g, '&amp;')}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`).join('')}
</urlset>`;

        fs.writeFileSync('sitemap.xml', xml.trim());
        console.log(`✅ sitemap.xml generated successfully with ${urls.length} URLs!`);

    } catch (error) { console.error("Error generating sitemap:", error); }
}

generateSitemap();