# The Bent One — TODO

Reference reader: [Mia, the Sun, and the Moon](https://mia-the-sun-and-the-moon-web-book.stronghandssoftheart.com/) · [repository](https://github.com/antoniwan/book-sun-and-moon).

## Constraints

Do not change these without a deliberate decision:

- SVG line craft: drawn strokes, weight range, visible joints, bent-path identity in the art
- Story text and tense (the book copy is authoritative)
- Page compositions in `src/lib/book/scenes.ts` (refine art; do not replace the scene system)
- Paper / ink / crimson visual language
- Reader framing: a short book about lines, not a seek-and-find picture book

## Feature status (vs Mia)

| Feature | Mia | This project |
|---------|-----|--------------|
| EN / ES toggle + persisted language | yes | done |
| Bilingual story + chrome | yes | done |
| SEO: OG / Twitter / canonical / JSON-LD | yes | done |
| `document.documentElement.lang` + live meta | yes | done |
| Web app manifest + theme-color | yes | done |
| Analytics (gtag) | yes | optional / later |
| Portfolio / credit link in bar | yes | optional |
| Version stamp (footer → repository) | yes | done |
| Cover social image (raster) | yes | done (`og.png`) |

Already matched: page URLs, history, swipe, keyboard, dots, resume, live region, basic print CSS, Vercel SPA fallback, cover continue, page hotspots.

Intentionally omitted: read aloud / Web Speech (present in Mia; not planned here).

## Release path

- [x] EN / ES toggle — cover + reader bar; persist; swap reader copy
- [x] Spanish translation — full book voice (ongoing page-by-page polish welcome)
- [x] SEO pack — `index.html` meta, OG / Twitter, JSON-LD Book, canonical, manifest, `applyDocumentMeta(lang)`
- [x] Confirm production `VITE_SITE_URL` — `https://the-bent-one-book.stronghandssoftheart.com`
- [x] Raster social card (`og.png`) + icon set
- [x] **v1.0.0** — first public voice of the bilingual book

SEO note: document / OG title stays **La Doblada**. Story Spanish always uses *línea* / *líneas*; DEV F/M only flips **La Doblada** / **El Doblado**.

## Voice and framing

- [x] Say **page**, not spread, in the UI
- [x] Say **little book** at most once per screen
- [x] Cover deck invites without summarizing the plot; front matter holds the rule
- [x] Front matter = possibility + placement + the bent red line (editor voice)
- [x] CTA flow: cover **Before we begin** → front matter → **Begin** (page 1)
- [x] Prose styling: geometric terms italic; **red** / **rojo** bold in `--line-bent`
- [x] Positive-values pass on story copy (curiosity, care, difference as character; no hunt commands; no “not good” judgment)
- [ ] Keep applying this voice on future art and copy edits
- [x] Back matter afterglow + collapsible dedication
- [x] Back matter matches page 14 without repeating it as a second ending

## Layout and stage

- [x] Book shell, page-turn motion, hotspots, mobile stack, ReaderBar
- [ ] Caption placement — prose under art remains the default

## Navigation and URL

- [x] Per-page URLs, history, swipe, keyboard, dots, resume, live region

## Later / optional

- [ ] Analytics (only with a real measurement ID)
- [ ] Portfolio link in reader chrome
- [x] Print stylesheet (basic)
- [x] `vercel.json` SPA fallback

## Art follow-ups

- [ ] Page 1 — line scale still too small?
- [ ] Pages 6–7 — town density / joints
- [ ] Pages 11–14 — drift, emptiness on 12, straighten, field on 14
- [ ] Decoy reds from page 10 — drawing craft only; never announce in the UI

Constraint: keep the line draw system and scene data intact; copy and chrome wrap them.
