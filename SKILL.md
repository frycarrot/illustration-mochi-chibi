---
name: illustration-mochi-chibi
description: Draw original chibi animals as self-contained SVG cards in a soft mochi vinyl-toy style. Use for kawaii mascots, pastel animal scenes, stickers, avatars, greeting cards and spot illustrations.
---

# Mochi chibi

Draw a domed bun head, wide low eyes, a tiny pear torso and soft paws. Use powdery colours, soft upper-left light and a pale card. Choose the species, action, costume and setting from the brief. Keep the animal’s face and body proportions consistent at every level of prop detail.

## Default composition: character vignette

For illustration briefs, including a species or theme alone, give the animal a small piece of its world. Design the footing and its relationship to the character before choosing the held prop. A pond landing under the paws, reeds rising behind one shoulder and a paper boat on the water read as a waterside setting even with the toy removed from the hands. Invent an equivalent for the brief; a quiet pose is enough. Group the setting around and underneath the subject, letting the vignette end in the plain card colour. The strongest contrast and clearest silhouette belong to the face. For an explicitly isolated sticker, cutout or avatar, follow that framing.

## Objects, costume and scene

Start with what the animal is doing. Accessories usually number **one or two**; a themed ensemble can have more when its silhouette and expression remain clear. **Scene props have no fixed count.** Arrange objects by available space, depth and their part in the action. Keep faces, grips and important joints readable through the overlaps. Group distant items into quieter shapes.

Choose detail **per object**. The same teapot can appear at any level:

| Level | Use | What to draw |
|---|---|---|
| Simple · 简洁 | Background or tiny supporting item | A readable profile. A distant teapot can merge the spout and body into one silhouette; preserve the opening inside its handle. |
| Standard · 标准 | An object being worn, held or used | Show assembly and contact. Seat the lid on the rim; join the open spout to the belly and attach the handle at both ends. Let a gripping paw overlap it naturally. |
| Refined · 精致 | A featured object whose craftsmanship matters | Develop the same structure with material-specific layers: fitted lid lip and finial, spout opening, a foot ring, glaze following the curvature, or a painted band turning behind the belly. Choose features visible at the final size. |

A minimalist bun cat can carry an intricate antique teapot. Scale the object so the animal can use it; choose its construction separately. Keep essential joins credible at every level. On a **bow**, cloth narrows into the knot, folds radiate into the loops, and the tails pass behind. On **lace**, cut openings through a connected band so the layer beneath shows through. Repeat the motif along the hem, varying its spacing and apparent width around pleats and turns. A slim page corner, a cut cloth edge and a padded cushion each have their own profile.

## Character frame and silhouette

Use W = 100 for head width. Within `translate(X groundY) scale(S)`, x=0 is the centre, y=0 the ground. Scale the torso, tail, feet, paws and held objects by .74. Translate the entire head (ears and headwear included) by (0,14); tilt it around (0,-56) in head coordinates. Coordinates below are local to those groups.

```
HEAD  M0 -127 C20 -127 37 -118 45 -102 C49 -94 51 -87 50 -79 C49 -63 32 -54 0 -54 C-32 -54 -49 -63 -50 -79 C-51 -87 -49 -94 -45 -102 C-37 -118 -20 -127 0 -127 Z
BODY  M-22 -62 C-31 -60 -34 -44 -34 -30 C-34 -14 -27 -5 -14 -5 L14 -5 C27 -5 34 -14 34 -30 C34 -44 31 -60 22 -62 Z
```

The head is 73 units tall, fullest at the cheeks. The assembled torso is half as wide; the chin overlaps it by about 6. Allow up to 6% squash for individual variation. Keep the face anchors fixed.

Paint back to front: ground shadow, tail, outward paws, torso, clipped belly and chin shadow, feet and collar, then the head. Within the head draw back ears, fur, markings, occlusion, gloss, cheeks, eyes, nose and mouth, front ears and headwear. Finish with the held item at (0,-36) and gripping paws in front.

## Face

Centre both eyes at (±30,-84), ordinary oval radii (11,12). Choose one expression for both. For a puppy, 狗狗眼 or unspecified glossy open eyes, default to `double`. Reserve the three circular dots for an explicit `sparkle` request.

| Kind | Mood | Build |
|---|---|---|
| `solid` | calm, deadpan | oval rx 11 ry 12, no highlight |
| `shine` | low semicircular reflection | oval + one shallow white semicircle in the lower half, 13 wide, with a soft top edge at y+2.5 and a curved base at y+8.6 |
| `double` | default open, glossy eye | oval + two slanted white patches: a broad rounded triangular patch upper left and a shorter curved teardrop lower right. Match their tilt; leave a diagonal ink channel between them |
| `sparkle` | explicitly requested three-dot starry eyes | oval + white r 3.5 at (x-3, y-4) + r 1.8 at (x+3.4, y+3.6) + r 1.1 at (x+3.6, y-4.6) |
| `dot` | blank, surprised | small oval rx 4.6 ry 5.4 at y+1 |
| `sleepy` | half-lidded | lower half of the oval (`M x-11 y+1 A11 9.84 0 0 0 x+11 y+1 Z`) + a lid line 2.2 wide |
| `deadpan` | unimpressed, 死鱼眼 | low straight lid over a dark, flat-topped pupil with short vertical sides and a rounded bottom. Extend the lid past the outer corner; omit highlights. |
| `dash` | quiet smile, - - | one short, nearly level ink shape per eye, thicker near the nose and tapered at the outer tip. Keep the lids separate. |
| `closed` | asleep, content | downward arc `M x-7 y-1 Q x y+6 x+7 y-1`, stroke 2.6, round caps |
| `happy` | laughing (^ ^) | upward arc `M x-7 y+3 Q x y-7 x+7 y+3`, stroke 2.6 |
| `squeeze` | > < | two inward-facing corners, each about 19 wide: a steep, thicker upper sweep meets a nearly horizontal lower stroke at the nose side |

Copy the left `double` eye below. Translate its copy to (30,-84) so both reflections tilt the same way.

```svg
<g transform="translate(-30 -84)">
  <ellipse rx="11" ry="12" fill="#2B2325"/>
  <path d="M-7.5 -1.4 C-6.7 -4 -4.3 -8.4 -2.7 -8.7 C-1.2 -9 2.8 -5.9 3 -4.2 C3.2 -2.5 .4 .8 -1.9 2.1 C-4 3.3 -7 3.5 -7.8 2 C-8.4 1 -8.1 -.2 -7.5 -1.4 Z" fill="white"/>
  <path d="M1.3 3.5 Q3.3 1.1 4.6 -.2 Q5.3 -.8 7.2 .4 Q8.6 1.3 8 3.2 C7.3 6.7 5.4 8.4 2.1 8.2 Q.3 8.1 .2 6.1 Q.1 4.9 1.3 3.5 Z" fill="white"/>
</g>
```

- Nose: ellipse (0, -70.8) rx 2.3 ry 1.5. Dark (`#3A2C2E`) on dogs, bears, sheep; dusty pink (`#C98E92`) on cats, rabbits, mice. May be omitted.
- Mouth (stroke 1.5, round caps, `#3A2C2E`):
  - `w`: `M-4.6 -69 Q-2.3 -66.4 0 -69 Q2.3 -66.4 4.6 -69`
  - `line`: `M-2.6 -68.4 Q0 -67.2 2.6 -68.4`
  - `open`: a filled rounded triangle 8 wide 7 tall from y -69, `#5A3438`, with a pink tongue ellipse rx 2.4 ry 1.5 near its bottom
  - `o`: filled ellipse (0, -67) rx 2.2 ry 2.6

Blush at (±38,-70), radii (7,4), dusty pink at .55 opacity, blur 1.2. Optional muzzle at (0,-67.8), radii (15,9.5); belly at (0,-26), radii (19,17). Clip markings to the corresponding silhouette.

## Paws and feet

In body coordinates, mirror these right-side paths for the left. For outward and raised paws, draw the body over the root. For a grip, keep the tip opaque over the object and fade the wrist into the torso. Apply `mask="url(#xx-wrist)"` to the right grip, then mirror path and mask together.

```
OUT  M22 -45 C30 -47 41 -46 46 -42 Q51 -37 47 -31 C44 -27 34 -27 23 -29 Z
WAVE  M22 -49 C29 -55 36 -63 44 -63 Q52 -63 52 -55 C52 -48 43 -43 26 -36 Z
GRIP  M29 -45 Q29 -47 26 -46 C18 -45 9 -39 6 -32 Q4 -26 11 -25 Q20 -24 28 -26 Q30 -26 30 -29 Z
```

```svg
<linearGradient id="xx-wristFade" gradientUnits="userSpaceOnUse" x1="16" x2="29" y1="0" y2="0"><stop stop-color="white"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient>
<mask id="xx-wrist" maskUnits="userSpaceOnUse" x="3" y="-49" width="30" height="26"><rect x="3" y="-49" width="30" height="26" fill="url(#xx-wristFade)"/></mask>
```

Place a foot at each (±14,-6). Use the fur ramp and this continuous shallow underside; its lowest point meets the ground shadow.

    M-10 1 C-10 -3.5 -6 -7 0 -7 C5.8 -7 10 -3.4 10 .8 C10 4 5.4 6 0 6 C-5.3 6 -10 4.4 -10 1 Z

## Species

Mirror the right ear around x=0 for the left. Scale each ear about its root. A new horn, ear or antler should emerge from the crown or temple with a broad root; overlap front attachments with the head. Keep hanging ears outside the eyes and allow pointed tips characteristic of the species.

| Module | Layer | Right-ear path | Suits |
|---|---|---|---|
| `point` | back | `M4 -124 C18 -138 32 -152 40 -156 C45 -158 48 -155 48 -150 C50 -132 51 -106 47 -88 L32 -99 Z`, inner `M16 -124 C26 -134 34 -144 39 -147 C41 -148 43 -146 43 -143 C44 -134 44 -124 42 -114 Z` | cat, fox (scale 1.1), squirrel (scale 0.8), upright-eared dog |
| `long` | back | `M10 -116 C6 -150 12 -186 26 -190 C40 -193 42 -160 36 -114 Z`, inner `M17 -122 C15 -150 19 -176 26 -179 C33 -181 34 -156 31 -122 Z` | rabbit, hare (scale 1.15) |
| `floppy` | front | `M12 -125 C34 -133 58 -124 63 -100 C67 -80 63 -64 54 -61 C45 -58 40 -68 39 -84 C38 -98 34 -110 20 -116 Z` | dogs, puppies |
| `lop` | front | `M14 -124 C32 -132 52 -122 56 -100 C60 -80 60 -56 54 -44 C49 -36 42 -40 41 -54 C40 -74 38 -100 22 -116 Z` | lop rabbit, long-eared dog |
| `round` | back | circle centre (36, -119) r 17, inner r 10 | bear, panda, hamster (scale 0.8), mouse (scale 1.5) |
| `curl` | front | tube `M36 -112 C56 -122 70 -100 60 -86 C53 -77 42 -84 47 -94`, stroke 9, round caps, horn ramp | sheep, ram, goat |

Scale an ear about its root with `translate(rx ry) scale(k) translate(-rx -ry)`. Roots: point (30,-112), long (24,-118), floppy (30,-122), lop (28,-122), round (36,-118), curl (44,-104).

Tail roots sit near (26,-16), behind the torso. Mirror the character for the opposite side.

| Tail | Build |
|---|---|
| `cat` | tube `M26 -16 C44 -16 50 -32 44 -46`, stroke 7, round caps, fur gradient |
| `nub` | circle (30, -18) r 7 |
| `puff` | circle (31, -18) r 10 (rabbit, sheep) |
| `plume` | `M22 -14 C46 -10 62 -30 58 -58 C55 -80 66 -96 52 -104 C40 -110 30 -96 38 -84 C44 -74 40 -56 30 -48 C20 -40 14 -28 22 -14 Z` (squirrel: big, rising above the shoulder) |
| `fox` | fat teardrop `M24 -12 C44 -8 66 -20 66 -40 C66 -52 58 -56 52 -50 C46 -40 40 -30 26 -26 Z` with a cream tip |

## Light and colour

- Round forms: radial gradient centred at (.42,.32), radius .78; light at 0, base at .5, shade at 1. For fur, lift the base by about 7 HSL lightness points and darken it by 12 for the shade. Use horizontal ramps for cylinders, a light upper face and darker side for slabs. Use fine detail strokes or open frames; separate solid forms by value.
- Head base: darken the lower half with a vertical gradient ending at #4A3C38, opacity .26. Gloss at (-18,-114), radii (16,5), white gradient .55→0, opacity .5, blur 1.2. Keep the light upper-left when mirroring.
- Chin shadow: body-clipped ellipse at (0,-55), radii (42,9), opacity .32, blur 2.4. Ground contact: ellipse (0,0), radii (40,5), opacity .22, blur 2.4. Scale material highlights with surface shape; polished trim can catch a thin glint and matte cloth a broad fold shadow.
- Chroma = highest minus lowest RGB channel (0–255). Background ≤20 with highest channel ≥225; large areas ≤80, accents ≤110, deep darks ≤40 with highest channel ≤70. Include a light ≥240 and a dark ≤50; avoid pure black, neon and chroma >140. Aim for ≥25 difference in highest RGB channel between adjacent animals.
- Starter colours: card #EFEBE7, milk #F5F1ED, latte #CDB8A8, charcoal #6F6B6E, eyes #2B2325, blush #EE9FA2, rose #E7A9B4, sage #B7C4B0, gold #C9A86A. See `style.json` for more ramps and anchors.

**Canvas feel.** One barely perceptible monochrome texture spans the entire finished card in canvas coordinates. At 480 px the face reads as smooth vinyl; the surface becomes apparent on zoom. Use gradients for shadow volume. Leave chin, cheeks and muzzle free of stippled shapes. Put the filter in `defs`, then paint the rect once above the finished scene. The shared grain stays continuous across the background, fur, cloth and wood.

```svg
<filter id="xx-canvas" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency=".56" numOctaves="2" seed="17"/>
  <feColorMatrix type="matrix" values="2.6 0 0 0 -.8  2.6 0 0 0 -.8  2.6 0 0 0 -.8  0 0 0 0 1"/>
</filter>
<rect width="100%" height="100%" fill="#808080" filter="url(#xx-canvas)" opacity=".016" pointer-events="none"/>
```

## Compose and deliver

Make one self-contained 480×360 SVG (square sticker 360×360), with a title, prefixed IDs and a full-bleed background rect. Target under 80 KB. Use inline presentation attributes; omit linked assets, scripts, logos and visible text. Keep night skies inside windows or panels. Use a soft floor ellipse, ground at y 296–322, scene width about 300–420 and margins ≥24. Keep about 40% calm background. Keep decorative sparkles, dots and hearts in the margins; the example scattering uses 10–18 small marks.

| Characters | S | Spacing between centres |
|---|---|---|
| 1 | 1.2-1.4 | hero at x 170-240; compact setting supports and frames the hero |
| 2 | 1.0-1.15 | 120-150 px; heads tilt 4-8° toward each other |
| 3 | 0.85-0.98 | 115-130 px; the middle one 4-8 px lower (closer) and up to 6% larger |
| 4 | 0.75-0.85 | 95-105 px, in a slight arc |

Use separate cards for groups above four. Stagger characters and turn them toward the shared action. Give a head accessory a clear attachment at the crown or ear root. For scale, a mug is typically 22–28 units across in the body group, a bow 30–48 in the head group. A featured prop can occupy more space when its construction needs to read.

**Standalone chat:** draw from the paths above. Check the actual SVG for the intended eyes, curved soles, seamless wrists, readable contacts and physically connected props. At thumbnail size, check that the place still reads with the hand-held item hidden and that the face draws the eye first. If available, `references/template.svg` is a ready-to-edit card.

**With Node:** import `scripts/mochi.mjs`. See `scripts/build-examples.mjs` for calls and `examples/` for finished cards. Render with `node scripts/render.mjs card.svg card.png`; inspect at card size, then zoom the face and hero prop. Run `node scripts/lint.mjs card.svg --prefix xx-`. Use `references/craft.md` for a closer review.
