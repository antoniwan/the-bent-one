# The Bent One — TODO

Reference reader: [Mia, the Sun, and the Moon](https://mia-the-sun-and-the-moon-web-book.stronghandssoftheart.com/) · [repo](https://github.com/antoniwan/book-sun-and-moon).

## Locked — do not break lightly

- SVG line craft: drawn strokes, weight range, visible joints, bent-path identity in the art
- Story text and tense shift from the storyboard (the book is the copy)
- Page compositions in `src/lib/book/scenes.ts` (refine art, don’t replace the system)
- Paper / ink / crimson visual language
- Reader-facing framing: **little book about lines**, not a seek-and-find picture book

---

## Gap vs Mia (release checklist)

| Feature | Mia | Bent One |
|---------|-----|----------|
| EN / ES toggle + persisted lang | yes | **done** |
| Bilingual story + chrome | yes | **done** (ES polish pass still open) |
| SEO: OG / Twitter / canonical / JSON-LD | yes | **done** (confirm live URL + raster OG) |
| `document.documentElement.lang` + live meta | yes | **done** |
| Web app manifest + theme-color | yes | **done** |
| Analytics (gtag) | yes | optional / later |
| Portfolio / credit link in bar | yes | optional |
| Version stamp (hidden footer → repo) | yes | **done** (`v0.9.0` until ES ratified) |
| Cover social image (raster) | yes | need export after first deploy URL |

Already matched: page URLs, history, swipe, keyboard, dots, resume, live region, print CSS (basic), Vercel SPA fallback, cover continue, page hotspots.

**Skipped on purpose:** read aloud / Web Speech (Mia has it; this book won’t).

---

## Now (release path)

- [x] **EN / ES toggle** — cover + reader bar; persist; swap all reader copy
- [x] **Spanish translation** — full book voice (editor pass; polish welcome)
- [x] **SEO pack** — `index.html` meta, OG/Twitter, JSON-LD Book, canonical, manifest, `applyDocumentMeta(lang)`
- [ ] Confirm production `VITE_SITE_URL` + raster `/og.jpg` (or PNG) once domain is known
- [ ] Spanish copy polish pass (kid-ear pass; try both genders on refresh)
- [ ] **v1.0.0** only after Spanish is ratified

SEO note: document/OG title stays **La Doblada** (feminine). Story UI may still randomize línea/trazo.

---

## Voice & framing

- [x] Say **page**, not spread, in the UI
- [x] Say **little book** at most once per screen
- [x] Cover deck invites without dumping the arc; front matter holds the rule
- [x] Front matter = possibility + placement + the bent red one (editor voice, not feedback paste)
- [x] CTA flow: cover **Before we begin** → front matter → **Begin** (page 1)
- [x] Prose styling: geometric terms italic; **red** / **rojo** bold in `--line-bent`
- [x] **Positive-values pass** on all story copy (curiosity, care, difference-as-character; no hunt commands / no “not good” judgment)
- [ ] Keep applying this voice on future page art + copy edits before moving on
- [x] Back matter afterglow (not a second ending); matches page 14 moral without rehashing it

---

## Layout & stage

- [x] Book shell, page-turn motion, hotspots, mobile stack, ReaderBar
- [ ] Caption placement — prose under art stays default

---

## Navigation & URL

- [x] Per-page URLs, history, swipe, keyboard, dots, resume, live region

---

## Later / optional

- [ ] Analytics (only with a real measurement ID)
- [ ] Portfolio link in reader chrome
- [x] Print stylesheet (basic)
- [x] `vercel.json` SPA fallback

---

## Art / craft follow-ups

- [ ] Page 1 — line still “too small”?
- [ ] Pages 6–7 — town density / joints
- [ ] Pages 11–14 — drift, emptiness on 12, fragmentation, field on 14
- [ ] Decoy reds from page 10 — drawing craft only; never announce in UI

Constraint: **line draw system and scene data stay intact**; copy and chrome wrap them.
