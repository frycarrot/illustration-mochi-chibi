#!/usr/bin/env node
// Zero-dependency checks for a mochi-chibi card.  node scripts/lint.mjs card.svg [--prefix xx-]
import fs from 'node:fs';

const args = process.argv.slice(2);
const pi = args.indexOf('--prefix');
const prefix = pi >= 0 ? args.splice(pi, 2)[1] : null;
const file = args[0];
if (!file) { console.error('usage: lint.mjs card.svg [--prefix xx-]'); process.exit(1); }
const svg = fs.readFileSync(file, 'utf8');
const errors = [], warns = [];
const E = (m) => errors.push(m), W = (m) => warns.push(m);

// file format
if (!/<svg[^>]*viewBox="0 0 480 360"/.test(svg)) E('root <svg> must have viewBox="0 0 480 360"');
if (!/<svg[^>]*xmlns="http:\/\/www\.w3\.org\/2000\/svg"/.test(svg)) E('root <svg> needs xmlns="http://www.w3.org/2000/svg"');
for (const [re, msg] of [[/<style[\s>]/, '<style>'], [/\sclass="/, 'class attribute'], [/<script[\s>]/, '<script>'],
  [/<image[\s>]/, '<image>'], [/<foreignObject[\s>]/, '<foreignObject>'], [/href="(https?:|data:)/, 'external or data href'],
  [/url\((?!#)/, 'url() that is not a local #id']]) if (re.test(svg)) E(`forbidden: ${msg}`);

// background: first drawn element after </defs> is a full-bleed rect without rx
const afterDefs = svg.split('</defs>')[1] || svg;
const first = afterDefs.match(/<(?!\/)(\w+)[^>]*>/);
if (!first || first[1] !== 'rect' || !/width="480"/.test(first[0]) || !/height="360"/.test(first[0])) E('first shape after <defs> must be <rect width="480" height="360" fill="...">');
else if (/\srx=/.test(first[0])) E('background rect must not have rx');

// ids
const ids = [...svg.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
const dup = ids.filter((v, i) => ids.indexOf(v) !== i);
if (dup.length) E(`duplicate ids: ${[...new Set(dup)].join(', ')}`);
const pfx = prefix || (ids[0] && ids[0].match(/^[a-z0-9]+-/i)?.[0]);
if (pfx) { const bad = ids.filter((i) => !i.startsWith(pfx)); if (bad.length) E(`ids without prefix "${pfx}": ${bad.slice(0, 8).join(', ')}`); }
for (const m of svg.matchAll(/url\(#([^)]+)\)/g)) if (!ids.includes(m[1])) E(`url(#${m[1]}) points to a missing id`);

// Exclude the full-card paint from foreground colour checks. Shared colours
// and shared gradients still get checked where they appear in the artwork.
let foreground = svg;
if (first?.[1] === 'rect') {
  const backgroundTag = first[0];
  const position = svg.length - afterDefs.length + first.index;
  foreground = svg.slice(0, position) + svg.slice(position + backgroundTag.length);
  const backgroundId = backgroundTag.match(/fill="url\(#([^)]+)\)"/)?.[1];
  if (backgroundId && !foreground.includes(`url(#${backgroundId})`) && !foreground.includes(`href="#${backgroundId}"`)) {
    foreground = foreground.replace(/<(linearGradient|radialGradient)\b[^>]*>[\s\S]*?<\/\1>/g,
      (gradient) => gradient.includes(`id="${backgroundId}"`) ? '' : gradient);
  }
}
const colors = [...new Set([...foreground.matchAll(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b(?![0-9a-fA-F])/g)].map((m) => m[0].toUpperCase()))]
  .filter((c) => !ids.includes(c.slice(1)));
// chroma = max(R,G,B) - min(R,G,B) on 0-255: the skill's saturation measure
const chroma = (hex) => {
  if (hex.length === 4) hex = '#' + [...hex.slice(1)].map((c) => c + c).join('');
  const n = parseInt(hex.slice(1), 16); const v = [n >> 16 & 255, n >> 8 & 255, n & 255];
  return Math.max(...v) - Math.min(...v);
};
for (const c of colors) {
  const k = chroma(c);
  if (c === '#000000' || c === '#000') E('pure black #000000: use a warm near-black such as #2B2325');
  else if (k > 140) E(`${c} chroma ${k} > 140: too saturated for this style`);
  else if (k > 110) W(`${c} chroma ${k} > 110: allowed only for tiny accents (a cherry, a bow knot)`);
}
if (/fill="(?:red|blue|green|yellow|orange|purple|black)"/i.test(foreground)) W('named colour found: use hex from the palette ranges');

// outlines: a filled, opaque shape that also carries a stroke
for (const m of svg.matchAll(/<(path|circle|ellipse|rect|polygon)\b([^>]*)>/g)) {
  const a = m[2];
  const fill = a.match(/\sfill="([^"]+)"/)?.[1];
  const stroke = a.match(/\sstroke="([^"]+)"/)?.[1];
  const fo = Number(a.match(/fill-opacity="([^"]+)"/)?.[1] ?? 1);
  if (stroke && stroke !== 'none' && fill && fill !== 'none' && fo >= 0.5) W(`possible outline: <${m[1]}> has both fill and stroke (${m[0].slice(0, 70)}...)`);
}

// filters stay small and portable
for (const m of svg.matchAll(/<filter\b[\s\S]*?<\/filter>/g))
  for (const t of m[0].matchAll(/<(fe\w+)/g)) if (!['feTurbulence', 'feGaussianBlur', 'feOffset', 'feMerge', 'feMergeNode', 'feFlood', 'feComposite', 'feBlend', 'feColorMatrix'].includes(t[1])) W(`filter primitive ${t[1]} may render differently across viewers`);

const kb = Buffer.byteLength(svg) / 1024;
if (kb > 120) W(`file is ${kb.toFixed(0)} KB; aim for under 80 KB`);

for (const e of errors) console.log('ERROR', e);
for (const w of warns) console.log('WARN ', w);
console.log(`${file}: ${errors.length} error(s), ${warns.length} warning(s), ${colors.length} colours, ${ids.length} ids, ${kb.toFixed(1)} KB`);
process.exit(errors.length ? 1 : 0);
