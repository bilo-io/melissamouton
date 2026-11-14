// Writes a static HTML file per route into dist/ after `vite build`, each with that page's own
// title, description, canonical URL, share card and JSON-LD (src/seo/meta.ts). Link previews
// and most crawlers never run JavaScript, so these tags must be in the HTML served.
//
// Also writes dist/404.html (served by Vercel with a real 404 status), sitemap.xml and llms.txt.
// Runs as part of `npm run build`; needs no browser.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { loadSrc } from './load-src.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

const [{ PAGES, NOT_FOUND, fillHead, sitemapXml, llmsTxt }] = await loadSrc(root, '/src/seo/meta.ts');

const template = readFileSync(path.join(dist, 'index.html'), 'utf8');

// Two pages on one route (a game id that is also a showreel id) would overwrite each other.
const seen = new Set();
for (const { route } of PAGES) {
  if (seen.has(route)) throw new Error(`two pages claim ${route} in src/seo/meta.ts`);
  seen.add(route);
}

for (const meta of PAGES) {
  // Flat files (games/msp.html): Vercel's cleanUrls and Vite's preview both serve /games/msp from them.
  const file = meta.route === '/' ? 'index.html' : `${meta.route.slice(1)}.html`;
  mkdirSync(path.dirname(path.join(dist, file)), { recursive: true });
  writeFileSync(path.join(dist, file), fillHead(template, meta));
}
writeFileSync(path.join(dist, '404.html'), fillHead(template, NOT_FOUND));
writeFileSync(path.join(dist, 'sitemap.xml'), sitemapXml());
writeFileSync(path.join(dist, 'llms.txt'), llmsTxt());

console.log(`prerender: ${PAGES.length} pages, 404.html, sitemap.xml (${PAGES.filter((p) => p.sitemap).length} urls), llms.txt`);
