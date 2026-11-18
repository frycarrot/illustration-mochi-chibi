#!/usr/bin/env node
// Rebuilds examples/*.svg from the builders in mochi.mjs.  node scripts/build-examples.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as M from './mochi.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = (name, svg) => { fs.writeFileSync(path.join(here, '..', 'examples', name), svg); console.log('wrote', name); };

// ---------------------------------------------------------------- 1. Strawberry Tea Time (one hero)
{
  const p = 'st-';
  const d = [
    M.defs(p, { white: ['#FFFFFF', '#F5F1ED', '#DAD0CA'] }),
    M.accDefs(p),
    M.radial(`${p}wood`, ['#E6D3C2', '#D2BBA6', '#B39C88'], { cx: 0.45, cy: 0.3, r: 0.8 }),
    M.linear(`${p}ped`, [[0, '#B39C88'], [0.45, '#D2BBA6'], [1, '#9C8574']], [0, 0, 1, 0]),
    M.linear(`${p}cake`, [[0, '#E9D0BC'], [0.4, '#F6E6D8'], [1, '#D2B49E']], [0, 0, 1, 0]),
    M.radial(`${p}plate`, ['#FFFFFF', '#F3EFEC', '#D8D0CB']),
    M.radial(`${p}collar`, ['#D88C92', '#C27077', '#9E5560']),
  ].join('\n');
  const strawberries = [[-22, -54], [0, -58], [22, -54]].map(([x, y]) => `<g transform="translate(${x} ${y})">${M.acc.strawberry(p, 0.9)}</g>`).join('');
  const table = `<g transform="translate(336 318)">
    <ellipse cx="0" cy="0" rx="58" ry="6" fill="#5E524E" opacity="0.22" filter="url(#${p}soft)"/>
    <path d="M-12 -70 L12 -70 L16 -6 C16 -2 12 0 8 0 L-8 0 C-12 0 -16 -2 -16 -6 Z" fill="url(#${p}ped)"/>
    <ellipse cx="0" cy="-4" rx="34" ry="6" fill="url(#${p}wood)"/>
    <path d="M-74 -78 C-74 -70 74 -70 74 -78 L74 -82 L-74 -82 Z" fill="#B39C88"/>
    <ellipse cx="0" cy="-82" rx="74" ry="14" fill="url(#${p}wood)"/>
    <ellipse cx="2" cy="-84" rx="52" ry="9" fill="#9C8574" opacity="0.25" filter="url(#${p}blur1)"/>
    <ellipse cx="0" cy="-88" rx="46" ry="9" fill="url(#${p}plate)"/>
    <g transform="translate(0 -92)">
      <path d="M-34 -40 L34 -40 L34 -4 C34 4 -34 4 -34 -4 Z" fill="url(#${p}cake)"/>
      <path d="M-34 -24 C-24 -22 24 -22 34 -24 L34 -18 C24 -16 -24 -16 -34 -18 Z" fill="#E6A6AA"/>
      <path d="M-35 -42 C-35 -50 35 -50 35 -42 L35 -36 C30 -30 28 -38 24 -32 C20 -26 18 -36 12 -31 C6 -26 4 -35 -2 -31 C-8 -27 -10 -35 -16 -30 C-22 -26 -24 -35 -30 -31 C-33 -29 -35 -32 -35 -36 Z" fill="url(#${p}cream)"/>
      ${strawberries}
    </g>
  </g>`;
  const collar = `<path d="M-30 -55 C-14 -48 14 -48 30 -55 L30 -50 C14 -43 -14 -43 -30 -50 Z" fill="url(#${p}collar)"/>`;
  const body = [
    M.floor(p, '#E2D3D0', { cx: 240, cy: 318, rx: 220, ry: 30 }),
    M.decor({ seed: 7, colors: ['#FFFFFF', '#E9C3C6', '#F1D9C4'], box: [70, 60, 420, 330], count: 16 }),
    table,
    M.character(p, {
      x: 170, y: 318, s: 1.32, fur: 'white', ear: 'floppy', eyes: 'double', mouth: 'open',
      blush: '#F0A0A4', tilt: 5, arms: 'hold', held: `<g transform="scale(1.25)">${M.acc.strawberry(p)}</g>`,
      tail: 'nub', behind: '', headwear: M.acc.bow(p, '#E7A9B4', '#C98593', { x: -34, y: -118, rot: -20, s: 0.8 }),
      chin: '#6A5A54', neck: collar,
    }),
  ].join('\n');
  out('strawberry-tea-time.svg', M.card(p, d, body, 'Strawberry Tea Time, mochi chibi style', M.BACKGROUNDS.blush));
}

// ---------------------------------------------------------------- 2. Moon Nap (hero on a cushion, night inside a window)
{
  const p = 'mn-';
  const d = [
    M.defs(p, { wool: ['#FFFDF8', '#F3ECE2', '#D9CCBC'], horn: ['#D9C7B4', '#B9A08A', '#8E7663'] }),
    M.accDefs(p),
    M.radial(`${p}cloud`, ['#FFFFFF', '#EEF0F4', '#CBD1DB'], { cx: 0.45, cy: 0.3, r: 0.8 }),
    M.radial(`${p}night`, ['#5E6A84', '#47516A', '#2F364A'], { cx: 0.5, cy: 0.4, r: 0.75 }),
    M.radial(`${p}frame`, ['#D8DDE6', '#BFC6D2', '#9AA3B2']),
    M.radial(`${p}moon`, ['#FBF1CF', '#EEDCA6', '#D7C084']),
    M.radial(`${p}starP`, ['#F8E9B8', '#EBD497', '#CFB474']),
    `<clipPath id="${p}pane" clipPathUnits="userSpaceOnUse"><circle cx="352" cy="118" r="66"/></clipPath>`,
  ].join('\n');
  const windowArt = `<circle cx="352" cy="118" r="76" fill="url(#${p}frame)"/>
  <circle cx="352" cy="118" r="66" fill="url(#${p}night)"/>
  <g clip-path="url(#${p}pane)">
    <path d="M372 76 A30 30 0 1 0 398 124 A24 24 0 1 1 372 76 Z" fill="url(#${p}moon)"/>
    ${M.sparkle(318, 92, 6, '#F3E6C0')}${M.sparkle(336, 150, 4, '#F3E6C0', 12)}${M.sparkle(394, 160, 5, '#F3E6C0')}
    <circle cx="300" cy="128" r="1.6" fill="#F3E6C0"/><circle cx="356" cy="72" r="1.3" fill="#F3E6C0"/><circle cx="380" cy="176" r="1.5" fill="#F3E6C0"/>
    <path d="M276 160 L428 76" stroke="#FFFFFF" stroke-opacity="0.08" stroke-width="18"/>
  </g>`;
  const cloud = (cx, cy, s) => `<g transform="translate(${cx} ${cy}) scale(${s})">
    <path d="M-92 18 C-110 18 -114 -10 -94 -16 C-96 -40 -64 -48 -52 -30 C-44 -54 -6 -56 2 -32 C14 -52 50 -48 54 -24 C76 -36 102 -18 90 2 C108 8 102 26 84 26 L-84 26 C-90 26 -92 22 -92 18 Z" fill="url(#${p}cloud)"/>
    <path d="M-92 18 C-60 30 60 30 92 14 L90 22 C70 34 -70 34 -92 22 Z" fill="#AEB6C4" opacity="0.4" filter="url(#${p}blur1)"/></g>`;
  const starPillow = `<g transform="rotate(-8)"><path d="M0 -15 C2 -15 3 -12 4.4 -8.2 C5.4 -5.6 6 -5 9 -4.8 C13.4 -4.6 15 -4 15 -2.6 C15 -1.4 13 0.2 10 2.8 C7.8 4.6 7.6 5.4 8.4 8.6 C9.6 13 9.4 15 8 15 C6.8 15 5 13.6 2 11.6 C0.6 10.6 -0.6 10.6 -2 11.6 C-5 13.6 -6.8 15 -8 15 C-9.4 15 -9.6 13 -8.4 8.6 C-7.6 5.4 -7.8 4.6 -10 2.8 C-13 0.2 -15 -1.4 -15 -2.6 C-15 -4 -13.4 -4.6 -9 -4.8 C-6 -5 -5.4 -5.6 -4.4 -8.2 C-3 -12 -2 -15 0 -15 Z" fill="url(#${p}starP)"/><ellipse cx="-4" cy="-4" rx="4" ry="2" fill="#FFFFFF" opacity="0.45"/></g>`;
  const zz = `<g fill="none" stroke="#9AA3B2" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M236 92 L246 92 L236 102 L246 102"/><path d="M252 74 L259 74 L252 81 L259 81"/></g>`;
  const body = [
    M.decor({ seed: 11, colors: ['#FFFFFF', '#C9D0DC', '#EFE3C2'], box: [40, 60, 440, 340], count: 12 }),
    windowArt,
    M.floor(p, '#CDD3DC', { cx: 220, cy: 322, rx: 200, ry: 26 }),
    cloud(200, 296, 1.25),
    M.character(p, {
      x: 196, y: 280, s: 1.18, fur: 'wool', ear: 'curl', earFur: 'horn', eyes: 'closed', mouth: 'line',
      blush: '#EEA7A6', tilt: -7, arms: 'hold', held: starPillow, tail: 'none', shadow: '#7E8698',
      headwear: `<g transform="translate(0 12)">${M.acc.woolTuft(p, 'wool')}</g>` + M.acc.nightcap(p, '#A9B7CC', '#8797B0'),
    }),
    zz,
  ].join('\n');
  out('moon-nap.svg', M.card(p, d, body, 'Moon Nap, mochi chibi style', M.BACKGROUNDS.mist));
}

// ---------------------------------------------------------------- 3. Picnic Pals (three characters)
{
  const p = 'pp-';
  const d = [
    M.defs(p, { gray: ['#8F8B8E', '#6F6B6E', '#4C484B'], latte: ['#E4D3C6', '#CDB8A8', '#A8907E'], amber: ['#D9B596', '#C29878', '#9C755A'] }),
    M.accDefs(p),
    `<pattern id="${p}check" patternTransform="matrix(1 0 -.28 .52 0 0)" patternUnits="userSpaceOnUse" width="28" height="28"><rect width="28" height="28" fill="#F4EFE6"/><rect width="14" height="14" fill="#C7D3BD"/><rect x="14" y="14" width="14" height="14" fill="#C7D3BD"/><rect x="0" y="14" width="14" height="14" fill="#DDE4D4"/><rect x="14" y="0" width="14" height="14" fill="#DDE4D4"/></pattern>`,
    M.linear(`${p}blShade`, [[0, '#FFFFFF', 0.18], [0.6, '#6B7A62', 0], [1, '#6B7A62', 0.25]]),
    M.radial(`${p}basket`, ['#E2C7A4', '#C9A57E', '#9E7D5C']),
    M.radial(`${p}orange`, ['#F4CFA0', '#E7B07C', '#C78E5E']),
  ].join('\n');
  const clothEdge = 'M78 251 Q159 252 235 250 L437 252 L451 335 Q354 332 273 336 Q168 339 39 335 Z';
  const blanket = `<path d="${clothEdge}" fill="url(#${p}check)"/><path d="${clothEdge}" fill="url(#${p}blShade)"/>`;
  const basket = `<g transform="translate(418 276)">
    <ellipse cx="0" cy="18" rx="30" ry="5" fill="#5E524E" opacity="0.22" filter="url(#${p}soft)"/>
    <path d="M-22 -8 C-22 -34 22 -34 22 -8" fill="none" stroke="#B48F6A" stroke-width="4.5" stroke-linecap="round"/>
    <circle cx="-8" cy="-10" r="9" fill="url(#${p}orange)"/><g transform="translate(8 -10)">${M.acc.cherry(p, 0.9)}</g>
    <path d="M-26 -8 L26 -8 L22 14 C21 18 18 19 14 19 L-14 19 C-18 19 -21 18 -22 14 Z" fill="url(#${p}basket)"/>
    <path d="M-24 0 L24 0 M-23 8 L23 8" stroke="#9E7D5C" stroke-width="1.3" stroke-linecap="round"/></g>`;
  const body = [
    M.decor({ seed: 5, colors: ['#FFFFFF', '#D3DCCB', '#EAD9C2'], box: [30, 40, 450, 340], count: 14 }),
    `${M.sparkle(46, 60, 8, '#FFFFFF')}${M.sparkle(436, 50, 7, '#FFFFFF', 10)}${M.sparkle(240, 30, 5, '#EAD9C2')}${M.heart(70, 112, 1.1, '#E6C7C3')}${M.heart(410, 120, 1, '#E6C7C3')}`,
    blanket,
    M.character(p, {
      x: 116, y: 304, s: 0.92, fur: 'amber', ear: 'point', inner: '#E7CBB7', earScale: 0.8, eyes: 'shine', look: [1, 0],
      mouth: 'w', muzzle: '#F4E7DA', tail: 'plume', tilt: -6, flip: true, arms: 'wave', headwear: M.acc.halo(p),
    }),
    M.character(p, {
      x: 240, y: 312, s: 0.98, fur: 'gray', ear: 'point', inner: '#B9A0A2', eyes: 'solid', mouth: 'w', muzzle: '#F1ECE8',
      noseColor: '#C98E92', tail: 'cat', arms: 'hold', held: M.acc.mug(p), headwear: M.acc.glasses(p, 'round', '#C9A86A'),
    }),
    M.character(p, {
      x: 360, y: 304, s: 0.92, fur: 'latte', ear: 'lop', eyes: 'happy', mouth: 'open', tail: 'puff', tilt: -6,
      arms: 'hold', held: M.acc.cookie(p), headwear: M.acc.maidband(p),
    }),
    basket,
  ].join('\n');
  out('picnic-pals.svg', M.card(p, d, body, 'Picnic Pals, mochi chibi style', M.BACKGROUNDS.sage));
}
