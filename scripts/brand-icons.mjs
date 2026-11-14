// Renders the raster icons from the mm mark (public/logos/app-logo-dark.svg: white disc,
// black mark, the variant that reads on dark backgrounds):
//   public/favicon.ico          16 + 32 px, PNG-in-ICO, transparent (fallback for browsers without SVG favicons)
//   public/apple-touch-icon.png 180 px, padded on the site's dark background
//   public/icon-192.png         192 px, padded on the dark background (manifest)
//   public/icon-512.png         512 px, padded on the dark background (manifest)
// public/favicon.svg is hand-written and swaps colours with prefers-color-scheme.
//
// Uses the repo's own Playwright (a devDependency):
//   npx playwright install chromium && node scripts/brand-icons.mjs
import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const svg = readFileSync(path.join(root, 'public/logos/app-logo-dark.svg'), 'utf8');
const BG = '#09090b';

const browser = await chromium.launch();
const page = await browser.newPage();

/** Renders the logo into a size×size PNG; `pad` is the fraction of the edge left empty on each side. */
async function render(size, { pad = 0, bg = null } = {}) {
  await page.setViewportSize({ width: size, height: size });
  const inner = Math.round(size * (1 - pad * 2));
  await page.setContent(`<!doctype html><html><body style="margin:0;width:${size}px;height:${size}px;display:grid;place-items:center;background:${bg ?? 'transparent'}">
    <div style="width:${inner}px;height:${inner}px">${svg.replace('<svg ', '<svg style="width:100%;height:100%" ')}</div></body></html>`);
  return page.screenshot({ type: 'png', omitBackground: !bg });
}

/** Packs PNG buffers into one .ico (Vista+ PNG entries). */
function ico(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);
  let offset = 6 + entries.length * 16;
  const dir = entries.map(({ size, png }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(png.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += png.length;
    return e;
  });
  return Buffer.concat([header, ...dir, ...entries.map((e) => e.png)]);
}

const out = (name, buf) => {
  writeFileSync(path.join(root, 'public', name), buf);
  console.log(`public/${name}  ${buf.length} B`);
};

const small = [];
for (const size of [16, 32]) small.push({ size, png: await render(size) });
out('favicon.ico', ico(small));
out('apple-touch-icon.png', await render(180, { pad: 0.14, bg: BG }));
out('icon-192.png', await render(192, { pad: 0.14, bg: BG }));
out('icon-512.png', await render(512, { pad: 0.14, bg: BG }));

await browser.close();
