#!/usr/bin/env node
// mochi.mjs — optional builders for the illustration-mochi-chibi skill.
// Everything here is also written out in SKILL.md, so an agent without Node can copy the same shapes by hand.
//
// CHARACTER FRAME (all part coordinates use it):
//   head width W = 100 units, x = 0 is the character's centre line,
//   y = 0 is the ground under the feet, up is negative y.
//   Place a character with  translate(x, groundY) scale(s).
//
//   node scripts/mochi.mjs --demo out.svg     # a sheet showing every builder
//
import fs from 'node:fs';

// ---------- canonical shapes (W = 100) ----------
export const HEAD = 'M0 -127 C20 -127 37 -118 45 -102 C49 -94 51 -87 50 -79 C49 -63 32 -54 0 -54 C-32 -54 -49 -63 -50 -79 C-51 -87 -49 -94 -45 -102 C-37 -118 -20 -127 0 -127 Z';
export const BODY = 'M-22 -62 C-31 -60 -34 -44 -34 -30 C-34 -14 -27 -5 -14 -5 L14 -5 C27 -5 34 -14 34 -30 C34 -44 31 -60 22 -62 Z';
export const NECK = [0, -56];          // head pivot for tilts
export const EYE = { x: 30, y: -84, rx: 11, ry: 12 };
export const NOSE = { y: -70.8, rx: 2.3, ry: 1.5 };
export const MOUTH_Y = -69;
export const BLUSH = { x: 38, y: -70, rx: 7, ry: 4 };

// Right-side ear paths; the left ear is the same path under scale(-1 1).
export const EARS = {
  point: { // cat, fox, squirrel. Behind the head.
    layer: 'back', root: [30, -112],
    outer: 'M4 -124 C18 -138 32 -152 40 -156 C45 -158 48 -155 48 -150 C50 -132 51 -106 47 -88 L32 -99 Z',
    inner: 'M16 -124 C26 -134 34 -144 39 -147 C41 -148 43 -146 43 -143 C44 -134 44 -124 42 -114 Z',
  },
  long: { // upright rabbit. Behind the head.
    layer: 'back', root: [24, -118],
    outer: 'M10 -116 C6 -150 12 -186 26 -190 C40 -193 42 -160 36 -114 Z',
    inner: 'M17 -122 C15 -150 19 -176 26 -179 C33 -181 34 -156 31 -122 Z',
  },
  floppy: { // dog. In front of the head, hangs past the cheek.
    layer: 'front', root: [30, -122],
    outer: 'M12 -125 C34 -133 58 -124 63 -100 C67 -80 63 -64 54 -61 C45 -58 40 -68 39 -84 C38 -98 34 -110 20 -116 Z',
  },
  lop: { // lop rabbit. In front, longer and narrower than floppy.
    layer: 'front', root: [28, -122],
    outer: 'M14 -124 C32 -132 52 -122 56 -100 C60 -80 60 -56 54 -44 C49 -36 42 -40 41 -54 C40 -74 38 -100 22 -116 Z',
  },
  round: { // bear, panda, hamster (scale 0.8), mouse (scale 1.5). Behind.
    layer: 'back', root: [36, -118],
    outer: 'M36 -136 A17 17 0 1 1 35.9 -136 Z',
    inner: 'M36 -129 A10 10 0 1 1 35.9 -129 Z',
  },
  curl: { // sheep / goat horn curl. In front, at the temple.
    layer: 'front', root: [44, -104], tube: true,
    outer: 'M36 -112 C56 -122 70 -100 60 -86 C53 -77 42 -84 47 -94',
  },
  none: { layer: 'back', root: [0, 0], outer: '' },
};

// ---------- small helpers ----------
const f = (n) => +n.toFixed(2);
export const radial = (id, stops, { cx = 0.42, cy = 0.32, r = 0.78 } = {}) =>
  `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map((c, i) => `<stop offset="${f(i / (stops.length - 1))}" stop-color="${c}"/>`).join('')}</radialGradient>`;
export const linear = (id, stops, [x1, y1, x2, y2] = [0, 0, 0, 1]) =>
  `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map((s) => {
    const [o, c, a = 1] = s; return `<stop offset="${o}" stop-color="${c}"${a !== 1 ? ` stop-opacity="${a}"` : ''}/>`;
  }).join('')}</linearGradient>`;

// HSL helpers so ramps can be derived from one base colour.
export function hexToHsl(hex) {
  const n = parseInt(hex.slice(1), 16); let r = (n >> 16 & 255) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0; const l = (mx + mn) / 2;
  if (mx !== mn) { const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; }
  return [h, s * 100, l * 100];
}
export function hslToHex(h, s, l) {
  s /= 100; l /= 100; const k = (n) => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
  const c = (n) => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))));
  return '#' + [c(0), c(8), c(4)].map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase();
}
// base -> [highlight, base, shade]: +7 L / -12 L, shade hue drifts 8° warmer, a touch more saturated.
export function ramp(base) {
  const [h, s, l] = hexToHsl(base);
  return [hslToHex(h, Math.max(0, s - 4), Math.min(99, l + 7)), base, hslToHex((h + 352) % 360, Math.min(100, s + 4), Math.max(4, l - 12))];
}

// ---------- defs ----------
// furs: { name: baseHex | [light, base, shade] }
export function defs(p, furs = {}) {
  const out = [
    `<linearGradient id="${p}wristFade" gradientUnits="userSpaceOnUse" x1="16" x2="29" y1="0" y2="0"><stop stop-color="white"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient>`,
    `<mask id="${p}wrist" maskUnits="userSpaceOnUse" x="3" y="-49" width="30" height="26"><rect x="3" y="-49" width="30" height="26" fill="url(#${p}wristFade)"/></mask>`,
    `<filter id="${p}soft" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="2.4"/></filter>`,
    `<filter id="${p}blur1" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.2"/></filter>`,
    `<filter id="${p}blur4" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4"/></filter>`,
    linear(`${p}ao`, [[0.5, '#4A3C38', 0], [1, '#4A3C38', 0.26]]),
    linear(`${p}gloss`, [[0, '#FFFFFF', 0.55], [1, '#FFFFFF', 0]]),
    `<clipPath id="${p}bodyClip" clipPathUnits="userSpaceOnUse"><path d="${BODY}"/></clipPath>`,
    `<clipPath id="${p}headClip" clipPathUnits="userSpaceOnUse"><path d="${HEAD}"/></clipPath>`,
  ];
  for (const [name, v] of Object.entries(furs)) {
    const r = Array.isArray(v) ? v : ramp(v);
    out.push(radial(`${p}${name}`, r));
  }
  return out.join('\n');
}

// ---------- face parts ----------
export function eyes(p, kind = 'double', { color = '#2B2325', look = [0, 0] } = {}) {
  const [lx, ly] = look; // pupil shift for shine highlights only (-1..1)
  const one = (side) => {
    const x = side * EYE.x, y = EYE.y, { rx, ry } = EYE;
    switch (kind) {
      case 'solid': return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${color}"/>`;
      case 'shine': return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${color}"/>`
        + `<path transform="translate(${f(x + lx * 1.5)} ${f(y + ly)})" d="M-5.4 2.5 Q-6.8 2.5 -6.4 4.1 C-5.6 7.1 -3 8.6 0 8.6 C3 8.6 5.6 7.1 6.4 4.1 Q6.8 2.5 5.4 2.5 Z" fill="#FFFFFF"/>`;
      case 'double': return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${color}"/>`
        + `<g transform="translate(${x} ${y})" fill="#FFFFFF"><path d="M-7.5 -1.4 C-6.7 -4 -4.3 -8.4 -2.7 -8.7 C-1.2 -9 2.8 -5.9 3 -4.2 C3.2 -2.5 .4 .8 -1.9 2.1 C-4 3.3 -7 3.5 -7.8 2 C-8.4 1 -8.1 -.2 -7.5 -1.4 Z"/><path d="M1.3 3.5 Q3.3 1.1 4.6 -.2 Q5.3 -.8 7.2 .4 Q8.6 1.3 8 3.2 C7.3 6.7 5.4 8.4 2.1 8.2 Q.3 8.1 .2 6.1 Q.1 4.9 1.3 3.5 Z"/></g>`;
      case 'sparkle': return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${color}"/>`
        + `<circle cx="${f(x - 3)}" cy="${f(y - 4)}" r="3.5" fill="#FFFFFF"/>`
        + `<circle cx="${f(x + 3.4)}" cy="${f(y + 3.6)}" r="1.8" fill="#FFFFFF"/>`
        + `<circle cx="${f(x + 3.6)}" cy="${f(y - 4.6)}" r="1.1" fill="#FFFFFF"/>`;
      case 'dot': return `<ellipse cx="${x}" cy="${y + 1}" rx="4.6" ry="5.4" fill="${color}"/>`;
      case 'sleepy': return `<path d="M${x - rx} ${y + 1} A${rx} ${ry * 0.82} 0 0 0 ${x + rx} ${y + 1} Z" fill="${color}"/>`
        + `<path d="M${x - rx - 1} ${y + 1} L${x + rx + 1} ${y + 1}" stroke="${color}" stroke-width="2.2" stroke-linecap="round"/>`;
      case 'closed': return `<path d="M${x - 7} ${y - 1} Q${x} ${y + 6} ${x + 7} ${y - 1}" fill="none" stroke="${color}" stroke-width="2.6" stroke-linecap="round"/>`;
      case 'happy': return `<path d="M${x - 7} ${y + 3} Q${x} ${y - 7} ${x + 7} ${y + 3}" fill="none" stroke="${color}" stroke-width="2.6" stroke-linecap="round"/>`;
      // Paths describe the right eye; the left reflects around its own centre.
      case 'deadpan': return `<g transform="translate(${x} ${y}) scale(${side} 1)" fill="${color}">
        <path d="M-8 -4 L8 -3 L7.6 2 C7.2 7.4 4.6 9.2 .1 9.2 C-5.1 9.2 -7.8 6.7 -8 2 Z"/>
        <path d="M-8.2 -4.9 Q1 -4.8 12 -3.6 Q13 -3.3 12.8 -2.5 Q12.6 -2 11.7 -2 L-8.2 -2.6 Z"/></g>`;
      case 'dash': return `<path transform="translate(${x} ${y}) scale(${side} 1)" d="M-9 -1.6 Q-.5 -1.8 6.5 -.1 Q9.3 .6 10 2 Q10.2 2.8 9.2 2.6 Q1.6 1.1 -8.1 1.6 Q-9.8 1.5 -9 -1.6 Z" fill="${color}"/>`;
      case 'squeeze': return `<path transform="translate(${x} ${y}) scale(${side} 1)" d="M-9 3 C-5 -2 2 -8 8 -8.5 Q9.4 -8.6 8.4 -7.4 Q1.6 -3 -4.8 1.6 Q3 -.1 9.5 1.8 Q10.4 2.3 10 3.1 Q2.5 2.3 -7.8 4.5 Q-10 5 -9 3 Z" fill="${color}"/>`;
      default: return '';
    }
  };
  return one(-1) + one(1);
}

export function mouth(kind = 'w', { color = '#3A2C2E', tongue = '#E69A9C' } = {}) {
  const y = MOUTH_Y;
  switch (kind) {
    case 'w': return `<path d="M-4.6 ${y} Q-2.3 ${y + 2.6} 0 ${y} Q2.3 ${y + 2.6} 4.6 ${y}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    case 'open': return `<path d="M-4 ${y} Q0 ${y + 0.8} 4 ${y} Q3.6 ${y + 6.4} 0 ${y + 6.8} Q-3.6 ${y + 6.4} -4 ${y} Z" fill="#5A3438"/><ellipse cx="0" cy="${y + 5}" rx="2.4" ry="1.5" fill="${tongue}"/>`;
    case 'line': return `<path d="M-2.6 ${y + 0.6} Q0 ${y + 1.8} 2.6 ${y + 0.6}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>`;
    case 'o': return `<ellipse cx="0" cy="${y + 2}" rx="2.2" ry="2.6" fill="#5A3438"/>`;
    default: return '';
  }
}

// ---------- tails (behind the body) ----------
export function tail(p, kind, fur, { tip } = {}) {
  const F = `url(#${p}${fur})`;
  switch (kind) {
    case 'cat': return `<path d="M26 -16 C44 -16 50 -32 44 -46" fill="none" stroke="${F}" stroke-width="7" stroke-linecap="round"/>`;
    case 'nub': return `<circle cx="30" cy="-18" r="7" fill="${F}"/>`;
    case 'puff': return `<circle cx="31" cy="-18" r="10" fill="${F}"/>`;
    case 'plume': return `<path d="M22 -14 C46 -10 62 -30 58 -58 C55 -80 66 -96 52 -104 C40 -110 30 -96 38 -84 C44 -74 40 -56 30 -48 C20 -40 14 -28 22 -14 Z" fill="${F}"/>`;
    case 'fox': return `<path d="M24 -12 C44 -8 66 -20 66 -40 C66 -52 58 -56 52 -50 C46 -40 40 -30 26 -26 Z" fill="${F}"/>`
      + (tip ? `<path d="M66 -40 C66 -52 58 -56 52 -50 C50 -46 49 -44 47 -41 C54 -40 60 -40 66 -40 Z" fill="${tip}"/>` : '');
    default: return '';
  }
}

// ---------- arms ----------
export function arms(p, pose, fur) {
  const F = `url(#${p}${fur})`;
  // The torso conceals the wrist of each outward-reaching paw.
  const down = "M22 -45 C30 -47 41 -46 46 -42 Q51 -37 47 -31 C44 -27 34 -27 23 -29 Z";
  const raised = "M22 -49 C29 -55 36 -63 44 -63 Q52 -63 52 -55 C52 -48 43 -43 26 -36 Z";
  const grip = "M29 -45 Q29 -47 26 -46 C18 -45 9 -39 6 -32 Q4 -26 11 -25 Q20 -24 28 -26 Q30 -26 30 -29 Z";
  const right = (d) => `<path d="${d}" fill="${F}"/>`;
  const left = (d) => `<g transform="scale(-1 1)">${right(d)}</g>`;
  switch (pose) {
    case 'down': return left(down) + right(down);
    case 'hold': {
      const paw = `<path d="${grip}" fill="${F}" mask="url(#${p}wrist)"/>`;
      return `<g transform="scale(-1 1)">${paw}</g>${paw}`;
    }
    case 'wave': return left(down);
    case 'wave-front': return right(raised);
    case 'up-front': return left(raised) + right(raised);
    default: return '';
  }
}

// ---------- the whole character ----------
// o = { x, y, s, fur, earFur, inner, ear, earScale, eyes, eyeColor, look, mouth, nose, noseColor, blush,
//       tail, tailTip, arms, tilt, flip, muzzle, belly, markings, neck, headwear, held, behind }
export function character(p, o) {
  const fur = o.fur, F = `url(#${p}${fur})`;
  const E = EARS[o.ear || 'point'];
  const earF = `url(#${p}${o.earFur || fur})`;
  const es = o.earScale || 1;
  const earT = (side) => {
    const [rx, ry] = E.root;
    const sc = es === 1 ? '' : ` translate(${rx} ${ry}) scale(${es}) translate(${-rx} ${-ry})`;
    return `${side < 0 ? 'scale(-1 1)' : ''}${sc}`.trim();
  };
  const ear = (side) => {
    if (!E.outer) return '';
    const t = earT(side);
    const body = E.tube
      ? `<path d="${E.outer}" fill="none" stroke="${earF}" stroke-width="9" stroke-linecap="round"/>`
      : `<path d="${E.outer}" fill="${earF}"/>` + (E.inner && o.inner ? `<path d="${E.inner}" fill="${o.inner}"/>` : '');
    return t ? `<g transform="${t}">${body}</g>` : body;
  };
  const ears = ear(-1) + ear(1);
  const bl = o.blush === false ? '' : [-1, 1].map((s) =>
    `<ellipse cx="${s * BLUSH.x}" cy="${BLUSH.y}" rx="${BLUSH.rx}" ry="${BLUSH.ry}" fill="${o.blush || '#EE9FA2'}" opacity="0.55" filter="url(#${p}blur1)"/>`).join('');
  const nose = o.nose === false ? '' : `<ellipse cx="0" cy="${NOSE.y}" rx="${NOSE.rx}" ry="${NOSE.ry}" fill="${o.noseColor || '#3A2C2E'}"/>`;
  const muzzle = o.muzzle ? `<ellipse cx="0" cy="-67.8" rx="15" ry="9.5" fill="${o.muzzle}"/>` : '';
  const belly = o.belly ? `<ellipse cx="0" cy="-26" rx="19" ry="17" fill="${o.belly}" clip-path="url(#${p}bodyClip)"/>` : '';
  const head = [
    E.layer === 'back' ? ears : '',
    `<path d="${HEAD}" fill="${F}"/>`,
    `<g clip-path="url(#${p}headClip)">${o.markings || ''}${muzzle}<path d="${HEAD}" fill="url(#${p}ao)"/></g>`,
    `<ellipse cx="${o.flip ? 18 : -18}" cy="-114" rx="16" ry="5" fill="url(#${p}gloss)" opacity="0.5" filter="url(#${p}blur1)"/>`,
    bl, eyes(p, o.eyes || 'double', { color: o.eyeColor, look: o.look }), nose, mouth(o.mouth || 'w', { color: o.mouthColor }),
    E.layer === 'front' ? ears : '',
    o.headwear || '',
  ].join('');
  const tilt = o.tilt ? ` transform="rotate(${o.tilt} ${NECK[0]} ${NECK[1]})"` : '';
  const holdArms = o.arms === 'hold';
  const parts = [
    `<ellipse cx="0" cy="0" rx="40" ry="5" fill="${o.shadow || '#5E524E'}" opacity="0.22" filter="url(#${p}soft)"/>`,
    o.behind || '',
    '<g transform="scale(.74)">',
    tail(p, o.tail, o.tailFur || fur, { tip: o.tailTip }),
    holdArms ? '' : arms(p, o.arms || 'down', fur),
    o.arms === 'wave' ? arms(p, 'wave-front', fur) : o.arms === 'up' ? arms(p, 'up-front', fur) : '',
    `<path d="${BODY}" fill="${F}"/>`,
    belly,
    `<ellipse cx="0" cy="-55" rx="42" ry="9" fill="${o.chin || '#4A3C38'}" opacity="0.32" filter="url(#${p}soft)" clip-path="url(#${p}bodyClip)"/>`,
    `<path transform="translate(-14 -6)" d="M-10 1 C-10 -3.5 -6 -7 0 -7 C5.8 -7 10 -3.4 10 .8 C10 4 5.4 6 0 6 C-5.3 6 -10 4.4 -10 1 Z" fill="${F}"/><path transform="translate(14 -6)" d="M-10 1 C-10 -3.5 -6 -7 0 -7 C5.8 -7 10 -3.4 10 .8 C10 4 5.4 6 0 6 C-5.3 6 -10 4.4 -10 1 Z" fill="${F}"/>`,
    o.neck || '',
    '</g>',
    `<g transform="translate(0 14)"><g${tilt}>${head}</g></g>`,
    '<g transform="scale(.74)">',
    holdArms ? (o.held ? `<g transform="translate(0 -36)">${o.held}</g>` : '') + arms(p, 'hold', fur) : (o.held || ''),
    '</g>',
  ].join('\n');
  const flip = o.flip ? ' scale(-1 1)' : '';
  return `<g transform="translate(${o.x} ${o.y}) scale(${o.s || 1})${flip}">\n${parts}\n</g>`;
}

// ---------- scene ----------
export const BACKGROUNDS = { warm: '#EFEBE7', blush: '#F2E7E5', sage: '#E6EBE4', mist: '#E4E8ED', butter: '#F3EEE1' };
export const card = (p, defsStr, body, title = 'Mochi chibi illustration', bg = BACKGROUNDS.warm, { canvasTexture = true } = {}) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360" role="img" aria-label="${title}">\n<title>${title}</title>\n<defs>\n${defsStr}\n${canvasTexture ? `<filter id="${p}canvas" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency=".56" numOctaves="2" seed="17"/>
  <feColorMatrix type="matrix" values="2.6 0 0 0 -.8  2.6 0 0 0 -.8  2.6 0 0 0 -.8  0 0 0 0 1"/>
</filter>` : ''}\n</defs>\n<rect width="480" height="360" fill="${bg}"/>\n${body}\n${canvasTexture ? `<rect width="100%" height="100%" fill="#808080" filter="url(#${p}canvas)" opacity=".016" pointer-events="none"/>` : ''}\n</svg>\n`;

// Floor: a wide soft ellipse one step darker than the background, no hard line.
export const floor = (p, color, { cx = 240, cy = 316, rx = 230, ry = 34 } = {}) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${color}" opacity="0.7" filter="url(#${p}blur4)"/>`;

// Decor: 4-point sparkles, dots and tiny hearts; seeded, margins only.
export function sparkle(x, y, r, color, rot = 0) {
  const k = r * 0.22;
  return `<path transform="translate(${f(x)} ${f(y)}) rotate(${rot})" d="M0 ${-r} Q${k} ${-k} ${r} 0 Q${k} ${k} 0 ${r} Q${-k} ${k} ${-r} 0 Q${-k} ${-k} 0 ${-r} Z" fill="${color}"/>`;
}
export const heart = (x, y, s, color) =>
  `<path transform="translate(${f(x)} ${f(y)}) scale(${s})" d="M0 3 C-6 -1 -6 -6 -3 -6 C-1.5 -6 -0.5 -5 0 -4 C0.5 -5 1.5 -6 3 -6 C6 -6 6 -1 0 3 Z" fill="${color}"/>`;
export function decor({ seed = 1, colors = ['#FFFFFF'], box = [96, 70, 384, 330], count = 14 } = {}) {
  let s = seed; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const out = []; let tries = 0;
  while (out.length < count && tries++ < 500) {
    const x = 18 + rnd() * 444, y = 18 + rnd() * 300;
    if (x > box[0] && x < box[2] && y > box[1] && y < box[3]) continue;
    const c = colors[Math.floor(rnd() * colors.length)], t = rnd();
    out.push(t < 0.35 ? sparkle(x, y, 4 + rnd() * 4, c, rnd() * 20 - 10) : t < 0.85 ? `<circle cx="${f(x)}" cy="${f(y)}" r="${f(1.4 + rnd() * 1.4)}" fill="${c}"/>` : heart(x, y, 0.8 + rnd() * 0.4, c));
  }
  return out.join('\n');
}

// ---------- accessory and prop examples (a starting vocabulary, not a whitelist) ----------
// All in the character frame (W = 100). Headwear goes in o.headwear, held items in o.held (centred on the paws).
export const acc = {
  bow: (p, c = '#E7A9B4', dark = '#C98593', { x = 30, y = -118, rot = 18, s = 1 } = {}) =>
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">`
    + `<path d="M0 0 C-6 -12 -22 -14 -22 -2 C-22 8 -8 8 0 0 Z" fill="${c}"/><path d="M0 0 C6 -12 22 -14 22 -2 C22 8 8 8 0 0 Z" fill="${c}"/>`
    + `<path d="M-2 1 C-6 6 -10 14 -8 18 L-2 14 Z M2 1 C6 6 10 14 8 18 L2 14 Z" fill="${dark}"/>`
    + `<path d="M-16 -6 Q-9 -5 -2 -1 Q-8 -2 -14 -2 Z M3 0 Q11 -6 18 -4 Q11 -4 5 2 Z" fill="${dark}" opacity="0.72"/>`
    + `<ellipse cx="0" cy="0" rx="5" ry="5.6" fill="${dark}"/><ellipse cx="-12" cy="-4" rx="5" ry="2.6" fill="#FFFFFF" opacity="0.35"/></g>`,
  halo: (p, c = '#F1DE9C') =>
    `<ellipse cx="0" cy="-142" rx="27" ry="7" fill="none" stroke="${c}" stroke-width="4.2"/><ellipse cx="-8" cy="-146.5" rx="7" ry="1.4" fill="#FFFFFF" opacity="0.6"/>`,
  maidband: (p, c = '#FFFFFF', band = '#3A3336') => {
    const ys = (x) => -118 + (x * x) / 160;           // follows the head top
    const frills = [-28, -14, 0, 14, 28].map((x) => `<path d="M${x - 8} ${f(ys(x))} C${x - 8} ${f(ys(x) - 13)} ${x + 8} ${f(ys(x) - 13)} ${x + 8} ${f(ys(x))} Z" fill="${c}"/>`).join('');
    return frills + `<path d="M-42 -106 Q0 -132 42 -106" fill="none" stroke="${band}" stroke-width="4.6" stroke-linecap="round"/>`
      + `<path d="M-30 -112 Q0 -127 30 -112" fill="none" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="1.2" stroke-linecap="round"/>`;
  },
  // sheep fringe: a row of wool puffs across the forehead (draw before a hat)
  woolTuft: (p, fill) => [[-30, -116, 10], [-14, -122, 11], [2, -124, 11.5], [18, -121, 11], [33, -114, 9.5], [-22, -108, 8], [-6, -112, 9], [10, -112, 9], [25, -107, 8]]
    .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${p}${fill})"/>`).join(''),
  nightcap: (p, c = '#9FB3C8', dark = '#7F94AA', pom = '#FBF6EE') =>
    `<path d="M-44 -110 C-40 -140 -6 -150 22 -142 C40 -137 52 -124 60 -104 C52 -112 44 -118 34 -120 C14 -126 -24 -122 -44 -110 Z" fill="${c}"/>`
    + `<path d="M-47 -108 C-30 -124 30 -126 47 -108 C47 -100 42 -98 34 -102 C12 -110 -14 -110 -38 -100 C-46 -98 -48 -102 -47 -108 Z" fill="#FBF6EE"/>`
    + `<path d="M22 -142 C40 -137 52 -124 60 -104 C54 -112 46 -120 30 -128 Z" fill="${dark}" opacity="0.6"/>`
    + `<circle cx="62" cy="-100" r="8" fill="${pom}"/><circle cx="59.5" cy="-103" r="2.4" fill="#FFFFFF" opacity="0.8"/>`,
  // glasses: shape = round | oval | square | heart | star | half | sun
  glasses: (p, shape = 'round', frame = '#3A3134', { lens = '#FFFFFF', lensOpacity = 0.18, w = 2.2 } = {}) => {
    const lensAt = (x) => {
      const y = EYE.y;
      switch (shape) {
        case 'oval': return `<ellipse cx="${x}" cy="${y}" rx="15" ry="11.5"/>`;
        case 'square': return `<rect x="${x - 14.5}" y="${y - 11.5}" width="29" height="23" rx="7"/>`;
        case 'heart': return `<path d="M${x} ${y + 12} C${x - 18} ${y + 2} ${x - 18} ${y - 13} ${x - 8} ${y - 12} C${x - 4} ${y - 12} ${x - 1} ${y - 9} ${x} ${y - 7} C${x + 1} ${y - 9} ${x + 4} ${y - 12} ${x + 8} ${y - 12} C${x + 18} ${y - 13} ${x + 18} ${y + 2} ${x} ${y + 12} Z"/>`;
        case 'star': { let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 7.5 : 16; d += `${i ? 'L' : 'M'}${f(x + r * Math.cos(a))} ${f(y + 1 + r * Math.sin(a))} `; } return `<path d="${d}Z" stroke-linejoin="round"/>`; }
        case 'half': return `<path d="M${x - 14} ${y - 4} L${x + 14} ${y - 4}"/>`;
        case 'sun': return `<rect x="${x - 15}" y="${y - 10}" width="30" height="20" rx="9"/>`;
        default: return `<circle cx="${x}" cy="${y}" r="15"/>`;
      }
    };
    const fillL = shape === 'sun' ? `fill="${frame}" fill-opacity="0.85"` : shape === 'half' ? 'fill="none"' : `fill="${lens}" fill-opacity="${lensOpacity}"`;
    const bridgeY = EYE.y - (shape === 'half' ? 4 : 2);
    return `<g stroke="${frame}" stroke-width="${w}" stroke-linecap="round" ${fillL}>${lensAt(-EYE.x)}${lensAt(EYE.x)}</g>`
      + `<path d="M-16 ${bridgeY} Q0 ${bridgeY - 4} 16 ${bridgeY}" fill="none" stroke="${frame}" stroke-width="${w}" stroke-linecap="round"/>`
      + (shape === 'sun' ? `<path d="M${-EYE.x - 9} ${EYE.y - 5} l5 -2 M${EYE.x - 9} ${EYE.y - 5} l5 -2" stroke="#FFFFFF" stroke-opacity="0.6" stroke-width="2" stroke-linecap="round"/>` : '');
  },
  // a cream dollop with a fruit on top; fruit = strawberry | cherry
  creamTop: (p, fruit = 'strawberry', { x = 0, y = -124, s = 1 } = {}) =>
    `<g transform="translate(${x} ${y}) scale(${s})">`
    + `<path d="M-24 2 C-28 -6 -20 -12 -14 -10 C-14 -18 -4 -22 2 -16 C8 -22 18 -18 16 -10 C24 -12 30 -4 24 2 C16 6 -16 6 -24 2 Z" fill="url(#${p}cream)"/>`
    + `<path d="M-14 -10 C-8 -8 -4 -6 0 -2 M2 -16 C4 -12 6 -8 6 -4 M16 -10 C12 -6 10 -2 10 1" fill="none" stroke="#E7D9C9" stroke-width="1.4" stroke-linecap="round"/>`
    + `<g transform="translate(0 -18)">${fruit === 'cherry' ? acc.cherry(p) : acc.strawberry(p)}</g></g>`,
  strawberry: (p, s = 1) =>
    `<g transform="scale(${s})"><path d="M0 12 C-10 8 -12 -2 -9 -6 C-6 -9 6 -9 9 -6 C12 -2 10 8 0 12 Z" fill="url(#${p}berry)"/>`
    + [[-4, -2], [3, -3], [-1, 3], [5, 3], [-5, 5], [1, 8]].map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx="0.7" ry="1" fill="#F6E3C0"/>`).join('')
    + `<path d="M-7 -6 L-3 -9 L0 -12 L3 -9 L7 -6 L2 -7 L0 -5 L-2 -7 Z" fill="#8FA27A"/><ellipse cx="-4" cy="-3" rx="2.4" ry="1.4" fill="#FFFFFF" opacity="0.4"/></g>`,
  cherry: (p, s = 1) =>
    `<g transform="scale(${s})"><path d="M0 -4 C1 -12 4 -18 9 -20" fill="none" stroke="#7E8A62" stroke-width="1.6" stroke-linecap="round"/>`
    + `<circle cx="0" cy="2" r="7.5" fill="url(#${p}cherryG)"/><ellipse cx="-2.6" cy="-1" rx="2.2" ry="1.4" fill="#FFFFFF" opacity="0.55"/></g>`,
  // held items: centred on (0,0) = the meeting point of 'hold' paws
  cookie: (p) =>
    `<circle cx="0" cy="0" r="12" fill="url(#${p}cookie)"/>`
    + [[-4, -4], [4, -2], [-2, 5], [5, 5]].map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx="1.8" ry="1.4" fill="#5E4136"/>`).join(''),
  mug: (p, c = 'mugA') =>
    `<path d="M10 -4 C18 -4 18 8 10 8" fill="none" stroke="url(#${p}${c})" stroke-width="3.4" stroke-linecap="round"/>`
    + `<path d="M-11 -10 L11 -10 L10 10 C10 13 8 14 5 14 L-5 14 C-8 14 -10 13 -10 10 Z" fill="url(#${p}${c})"/>`
    + `<ellipse cx="0" cy="-10" rx="11" ry="3.2" fill="url(#${p}${c})"/><ellipse cx=".3" cy="-10" rx="8.8" ry="2" fill="#6E4C40"/>`
    + `<path d="M-9 -9 Q-6 -7.1 -2 -7.3 M-6.8 -4.5 Q-7.4 -.6 -6.7 3" fill="none" stroke="#FFFDF9" stroke-width="1.2" stroke-linecap="round" opacity=".72"/>`,
};

// Extra gradients used by the accessory examples.
export const accDefs = (p) => [
  radial(`${p}cream`, ['#FFFDF9', '#F8F1E7', '#E7DACB']),
  radial(`${p}berry`, ['#EBA2A2', '#D9787C', '#B05A60']),
  radial(`${p}cherryG`, ['#E08A8E', '#C25E66', '#8E3E48']),
  radial(`${p}cookie`, ['#E8C9A0', '#D2A877', '#AE8458']),
  linear(`${p}mugA`, [[0, '#B7C4B0'], [0.45, '#D6DFD0'], [1, '#93A28C']], [0, 0, 1, 0]),
].join('\n');

// ---------- demo ----------
if (process.argv[2] === '--demo') {
  const p = 'dm-';
  const d = defs(p, { white: ['#FFFFFF', '#F4F0EC', '#D9D0CA'], gray: '#6E6A6D', cocoa: '#B79A86', pink: '#E9CFCB' }) + accDefs(p);
  const body = [
    floor(p, '#DDD7D1'),
    character(p, { x: 90, y: 300, s: 0.85, fur: 'white', ear: 'floppy', eyes: 'double', mouth: 'open', noseColor: '#3A2C2E', arms: 'hold', held: acc.cookie(p) }),
    character(p, { x: 200, y: 300, s: 0.85, fur: 'gray', ear: 'point', inner: '#B79A9C', eyes: 'solid', tail: 'cat', muzzle: '#F1ECE8', noseColor: '#C98E92', headwear: acc.glasses(p, 'round', '#C9A86A') }),
    character(p, { x: 300, y: 300, s: 0.85, fur: 'pink', ear: 'long', inner: '#E2B3B2', eyes: 'sleepy', mouth: 'line', tail: 'puff', headwear: acc.bow(p) }),
    character(p, { x: 400, y: 300, s: 0.85, fur: 'cocoa', ear: 'round', inner: '#8E7262', eyes: 'happy', tail: 'nub', headwear: acc.creamTop(p, 'cherry'), tilt: -6 }),
  ].join('\n');
  fs.writeFileSync(process.argv[3] || 'demo.svg', card(p, d, body, 'Mochi chibi demo'));
  console.log('wrote', process.argv[3] || 'demo.svg');
}
