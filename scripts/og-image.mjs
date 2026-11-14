// Renders public/og.jpg (1200×630), the link-preview image for melissamouton.vercel.app.
//
// Uses the repo's own Playwright (a devDependency):
//   npx playwright install chromium && node scripts/og-image.mjs
//
// The output is deterministic apart from font hinting: the starfield uses a seeded PRNG.
import { chromium } from '@playwright/test';
import { readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { loadSrc } from './load-src.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const dataUri = (rel, type) => `data:${type};base64,${readFileSync(path.join(root, rel)).toString('base64')}`;
const photo = dataUri('src/assets/img/melissa.webp', 'image/webp');
const logo = dataUri('public/logos/app-logo-dark.svg', 'image/svg+xml');
const out = path.join(root, 'public/og.jpg');

// Copy comes from src/data/profile.ts. Re-run when the name, headline or the two halves change.
const site = 'https://melissamouton.vercel.app';
const [{ profile, HERO }] = await loadSrc(root, '/src/data/profile.ts');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// The last name gets the rainbow; any names before it sit on the line above.
const names = profile.name.trim().split(/\s+/);
const last = names.pop();
const first = names.join(' ');
const html = /* html */ `<!doctype html>
<html><head><meta charset="utf-8" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=JetBrains+Mono:wght@500&display=swap" />
<style>
  * { box-sizing: border-box; margin: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body { position: relative; background: #07070b; font-family: Manrope, sans-serif; color: #fafafa; }
  canvas { position: absolute; inset: 0; }
  .wash { position: absolute; inset: 0;
    background:
      radial-gradient(38rem 26rem at 78% 60%, hsl(262 90% 66% / .30), transparent 70%),
      radial-gradient(30rem 22rem at 8% 0%, hsl(217 95% 60% / .22), transparent 70%),
      radial-gradient(26rem 20rem at 100% 100%, hsl(320 85% 62% / .22), transparent 70%); }
  .copy { position: absolute; left: 72px; top: 0; bottom: 0; width: 600px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 20px; letter-spacing: .28em; text-transform: uppercase; color: hsl(262 90% 76%); }
  h1 { margin-top: 18px; font-size: 104px; line-height: .92; font-weight: 900; letter-spacing: -.045em; }
  h1 span { display: block; }
  .rainbow { background: linear-gradient(90deg, #3b82f6, #8b5cf6 45%, #ec4899); -webkit-background-clip: text; color: transparent;
    filter: drop-shadow(0 0 22px hsl(262 90% 66% / .55)); padding-bottom: 8px; }
  .tag { margin-top: 26px; font-size: 31px; font-weight: 700; color: #e4e4e7; line-height: 1.25; }
  .tag .dot2 { color: #71717a; }
  .tag .rainbow { filter: none; padding: 0; }
  .sub { margin-top: 18px; font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: 500; color: #a1a1aa; }
  .eq { position: absolute; left: 640px; right: 0; bottom: 0; height: 330px; display: flex; align-items: flex-end; gap: 6px; padding: 0 20px; opacity: .85; }
  .eq i { flex: 1; border-radius: 6px 6px 0 0; background: linear-gradient(to top, hsl(320 85% 62%), hsl(262 90% 66%) 60%, hsl(217 95% 60% / .6)); }
  .face img.heart { filter: saturate(1.25) hue-rotate(-18deg) contrast(1.05) drop-shadow(0 0 28px hsl(320 85% 62% / .5)); }
  .face img.left { filter: drop-shadow(0 0 28px hsl(217 95% 60% / .4)); }
  .face { position: absolute; right: 8px; bottom: 0; width: 600px; height: 600px; }
  .face img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; object-position: center bottom; }
  .left { clip-path: inset(0 50% 0 0); }
  .seam { position: absolute; left: calc(50% - 1.5px); top: 40px; bottom: 0; width: 3px; border-radius: 9px;
    background: linear-gradient(to bottom, transparent, hsl(217 95% 60%) 15%, hsl(262 90% 66%) 50%, hsl(320 85% 62%) 85%, transparent);
    box-shadow: 0 0 14px 2px hsl(262 90% 66% / .8), 0 0 46px 8px hsl(217 95% 60% / .4); }
  .url { position: absolute; right: 44px; top: 30px; display: flex; align-items: center; gap: 12px; font-family: 'JetBrains Mono', monospace; font-size: 22px; color: #e4e4e7; }
  .url img { width: 40px; height: 40px; }
</style></head>
<body>
  <canvas id="stars" width="1200" height="630"></canvas>
  <div class="wash"></div>
  <div class="eq">${Array.from({ length: 22 }, (_, i) => `<i style="height:${28 + Math.round(Math.abs(Math.sin(i * 1.7) * 52 + Math.cos(i * 0.6) * 18))}%"></i>`).join('')}</div>
  <div class="face"><img class="heart" src="${photo}" /><img class="left" src="${photo}" /><div class="seam"></div></div>
  <div class="url"><img src="${logo}" alt="" />${esc(new URL(site).host)}</div>
  <div class="copy">
    <div class="eyebrow">${esc(profile.headline)}</div>
    <h1>${first ? `<span>${esc(first)}</span>` : ''}<span class="rainbow">${esc(last)}</span></h1>
    <div class="tag">${esc(HERO.trade.replace(/\.$/, ''))} <span class="dot2">·</span> <span class="rainbow">${esc(HERO.heart.replace(/\.$/, ''))}</span></div>
    <div class="sub">${esc(profile.email)}</div>
  </div>
  <script>
    let s = 20160615;
    const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
    const c = document.getElementById('stars').getContext('2d');
    for (let i = 0; i < 420; i++) {
      const x = rnd() * 1200, y = rnd() * 630, r = rnd() ** 3 * 1.8 + 0.3, a = 0.25 + rnd() * 0.75;
      const hue = [217, 262, 320, 0][Math.floor(rnd() * 4)];
      c.fillStyle = hue ? 'hsla(' + hue + ',90%,80%,' + a + ')' : 'rgba(255,255,255,' + a + ')';
      c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
      if (r > 1.6) { c.shadowColor = c.fillStyle; c.shadowBlur = 8; c.fill(); c.shadowBlur = 0; }
    }
  </script>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: out, type: 'jpeg', quality: 84 });
await browser.close();

const kb = Math.round(statSync(out).size / 1024);
console.log(`wrote ${path.relative(root, out)} (${kb} KB)`);
if (kb > 300) {
  console.error('og.jpg is over 300 KB; WhatsApp may drop the preview. Lower the quality.');
  process.exit(1);
}
