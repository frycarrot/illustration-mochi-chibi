# Card review

Use `SKILL.md` for geometry, colours and detail levels. Review the rendered card at its intended display size before zooming in.

| Inspect | Look for |
|---|---|
| First read | The expression and action read at 480 px. For a vignette, hide the hand prop: the footing and nearby forms still establish the place. Leave open space around the group. Add or regroup props according to theme and space. |
| Assembly | A wrist emerges from the body; a gripping tip overlaps its object. A resting object touches its support. Headwear overlaps the crown or ear root. |
| Construction | Follow the main object from part to part. A handle joins twice, a lid fits its opening, ribbon gathers at the knot, and lace openings reveal the underlying colour through folds. |
| Hierarchy | Silhouettes read at thumbnail size. At card size the focal object reveals assembly and material; quieter supporting objects still read clearly. |
| Finish | Check hand-drawn eye reflections, rounded soles, softly blended gripping wrists, consistent upper-left light and continuous canvas texture that disappears into the face at normal size. Keep characters and markings original. |

## Render and inspect

- Render: `node scripts/render.mjs card.svg card.png`.
- Compare cards: `node scripts/render.mjs --sheet sheet.png examples/*.svg card.svg`.
- Inspect a contact or joint: `node scripts/render.mjs card.svg crop.png --zoom x,y,w,h --scale 6`.
- Fix visible issues and re-render. Run `node scripts/lint.mjs card.svg --prefix xx-` for markup, ID references and colour checks. For standalone chat, inspect the path, its local coordinates, transform and layer order directly.

When scoring a set, use 0–2 each for style fidelity, character appeal, contact, composition and subject clarity. For a formal scored review, target 8/10; take the lower of two independent scores when judges are available. Compare versions at the same scale. Check the intended change against the original subject line.
