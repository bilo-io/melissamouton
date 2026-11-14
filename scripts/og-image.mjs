// Renders public/og.jpg (1200×630), the link-preview image for bilo.dev.
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
const web = dataUri('src/assets/img/hero/portrait-web.webp', 'image/webp');
const game = dataUri('src/assets/img/hero/portrait-game.webp', 'image/webp');
const logo = dataUri('public/logos/app-logo-dark.svg', 'image/svg+xml');
const out = path.join(root, 'public/og.jpg');

// Copy comes from src/data (profile, and the current role). Re-run when the name, headline,
// location or current role changes.
const [{ profile }, { experience }] = await loadSrc(root, '/src/data/cv-profile.ts', '/src/data/cv-experience.ts');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// The last name gets the rainbow; any names before it sit on the line above.
const names = profile.name.trim().split(/\s+/);
const last = names.pop();
const first = names.join(' ');
const current = experience.find((e) => e.isCurrent);
const html = /* html */ `<!doctype html>
<html><head><meta charset="utf-8" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;800;900&family=JetBrains+Mono:wght@500&display=swap" />
<style>
  * { box-sizing: border-box; margin: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body { position: relative; background: #07070b; font-family: Inter, sans-serif; color: #fafafa; }
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
  .tag { margin-top: 26px; font-size: 32px; font-weight: 600; color: #e4e4e7; }
  .sub { margin-top: 10px; font-size: 24px; font-weight: 500; color: #a1a1aa; }
  .chip { margin-top: 30px; align-self: flex-start; display: inline-flex; gap: 12px; align-items: center; padding: 10px 18px; border-radius: 999px;
    border: 1px solid #27272a; background: #18181bcc; font-size: 22px; font-weight: 600; color: #e4e4e7; }
  .dot { width: 12px; height: 12px; border-radius: 99px; background: #22c55e; box-shadow: 0 0 12px #22c55e; }
  .face { position: absolute; right: 30px; bottom: 0; width: 600px; height: 600px; }
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
  <div class="face"><img src="${game}" /><img class="left" src="${web}" /><div class="seam"></div></div>
  <div class="url"><img src="${logo}" alt="" />bilo.dev</div>
  <div class="copy">
    <div class="eyebrow">Web dev · Game dev</div>
    <h1>${first ? `<span>${esc(first)}</span>` : ''}<span class="rainbow">${esc(last)}</span></h1>
    <div class="tag">${esc(profile.headline)}</div>
    <div class="sub">${esc(profile.location)}</div>
    ${current ? `<div class="chip"><span class="dot"></span>${esc(`${current.role.title} at ${current.company.name}`)}</div>` : ''}
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
