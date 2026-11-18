#!/usr/bin/env node
// Headless SVG -> PNG renderer (optional helper; the skill works without it).
//
//   node scripts/render.mjs card.svg card.png                 # 2x render
//   node scripts/render.mjs card.svg face.png --zoom x,y,w,h --scale 8
//   node scripts/render.mjs --sheet sheet.png a.svg b.svg c.svg
//
// Needs Playwright (`npm i -D playwright` + `npx playwright install chromium`).
// If it lives elsewhere, point to that node_modules folder:
//   PLAYWRIGHT_NODE_MODULES=/path/to/node_modules node scripts/render.mjs ...
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

async function loadChromium() {
  const bases = [process.env.PLAYWRIGHT_NODE_MODULES, path.join(process.cwd(), 'node_modules')].filter(Boolean);
  for (const base of bases) {
    const req = createRequire(path.join(base, 'noop.js'));
    for (const name of ['playwright', 'playwright-core', '@playwright/test']) {
      try { return req(name).chromium; } catch {}
    }
  }
  for (const name of ['playwright', 'playwright-core', '@playwright/test']) {
    try { return (await import(name)).chromium; } catch {}
  }
  console.error('Playwright not found. Install it or set PLAYWRIGHT_NODE_MODULES.');
  process.exit(1);
}

const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf(k); if (i < 0) return null; const v = args[i + 1]; args.splice(i, 2); return v; };
const sheet = opt('--sheet');
const zoom = opt('--zoom');
const scale = Number(opt('--scale') || 2);

const chromium = await loadChromium();
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const readSvg = (f) => fs.readFileSync(f, 'utf8');
const size = (svg) => {
  const m = svg.match(/viewBox="([-\d.\s]+)"/);
  const [, , w, h] = m ? m[1].trim().split(/\s+/).map(Number) : [0, 0, 480, 360];
  return { w, h };
};

if (sheet) {
  const files = args;
  const cols = Math.min(3, files.length);
  const cell = 480;
  const cells = files.map((f) => {
    const svg = readSvg(f);
    return `<figure style="margin:0;width:${cell}px"><div style="width:${cell}px;line-height:0">${svg.replace('<svg', `<svg width="${cell}" height="${cell * size(svg).h / size(svg).w}"`)}</div><figcaption style="font:12px ui-monospace,monospace;padding:4px 0">${path.basename(f)}</figcaption></figure>`;
  }).join('');
  await page.setViewportSize({ width: cols * (cell + 16) + 16, height: 400 });
  await page.setContent(`<body style="margin:16px;background:#fff;display:grid;grid-template-columns:repeat(${cols},${cell}px);gap:16px">${cells}</body>`);
  await page.screenshot({ path: sheet, fullPage: true });
} else {
  const [inFile, outFile] = args;
  if (!inFile || !outFile) { console.error('usage: render.mjs in.svg out.png [--zoom x,y,w,h] [--scale n]'); process.exit(1); }
  let svg = readSvg(inFile);
  let { w, h } = size(svg);
  if (zoom) {
    const [zx, zy, zw, zh] = zoom.split(',').map(Number);
    svg = svg.replace(/viewBox="[^"]*"/, `viewBox="${zx} ${zy} ${zw} ${zh}"`);
    w = zw; h = zh;
  }
  svg = svg.replace('<svg', `<svg width="${w}" height="${h}"`);
  await page.setViewportSize({ width: Math.ceil(w), height: Math.ceil(h) });
  const ctx = page.context();
  await page.close();
  const p2 = await ctx.browser().newPage({ deviceScaleFactor: scale, viewport: { width: Math.ceil(w), height: Math.ceil(h) } });
  await p2.setContent(`<body style="margin:0">${svg}</body>`);
  await p2.locator('svg').first().screenshot({ path: outFile, omitBackground: true });
}
await browser.close();
console.log('ok');
