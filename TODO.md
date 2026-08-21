# The Bent One — TODO

Reference reader UX: [book-sun-and-moon](https://github.com/antoniwan/book-sun-and-moon) (Mia, the Sun, and the Moon).

## Locked — do not break

Keep these as-is unless we deliberately redesign them later:

- SVG line craft: drawn strokes, weight range, visible joints, bent-path identity
- Seek mechanic: one bent red line; decoys from spread 10; ochre/blue only on 7
- Story text and tense shift from the storyboard
- Spread compositions in `src/lib/book/scenes.ts` (refine art, don’t replace the system)
- Paper / ink / crimson visual language (not a night-sky theme transplant from Mia)

Layout and chrome can evolve around this. Art and narrative should stay.

---

## Layout & stage

- [x] **Book shell** — full-viewport stage, header + ReaderBar split
- [x] **Page-turn motion** — directional enter via `--page-delta`
- [x] **Illustration hotspots** — left/right 25% of stage; center free for seeking
- [x] **Mobile stack** — stage first, prose second; reader bar wraps on narrow screens
- [x] **Spread 10 bleed** — still scales slightly inside the stage frame
- [ ] **Caption placement decision** — prose under art for now; revisit only if seek suffers

---

## Navigation & URL

- [x] **Per-spread URLs** — `/`, `/front`, `/1/one-line` … `/14/the-field`, `/back`
- [x] **History-friendly prev/next** — `pushState` + `popstate`
- [x] **Swipe nav** — ~48px horizontal threshold; ignore vertical
- [x] **Keyboard parity** — ←/→/Space/Enter/PageUp/PageDown/Home/End
- [x] **Skip first / last** in reader bar
- [x] **Page dots** — 14 dots with active + passed states
- [x] **Resume reading** — `localStorage`; cover **Continue reading**
- [x] **Live region** — announces cover / spread / end

---

## Reader chrome

- [x] **Dedicated ReaderBar**
- [x] **Cover polish** — author line; Open + Continue
- [x] **Endpapers** — rule-of-the-world; back credit line
- [x] **Focus / a11y** — labeled controls, `sr-only` live region, hotspot focus style
- [x] **Reduced motion** — page-turn + prose animations respect preference

---

## Optional (later)

- [ ] **Read aloud** — Web Speech; longer pause after spread 12’s first line
- [ ] **Bilingual EN/ES** — only after translation exists
- [x] **Print stylesheet** — hide chrome/hotspots (basic)
- [x] **Deploy** — `vercel.json` SPA fallback ready

---

## Art / craft follow-ups

- [ ] Spread 1 — line still “too small”?
- [ ] Spreads 6–7 — town density / joints / seek timing (~8s on 6)
- [ ] Spreads 11–14 — drift, emptiness on 12, fragmentation gradient, field frustration on 14
- [ ] Decoy reds — count and placement from 10 onward without announcing the trap

Constraint: **line draw system and scene data stay intact**; layout wraps them.
