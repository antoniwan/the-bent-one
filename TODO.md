# The Bent One — TODO

Reference reader UX: [book-sun-and-moon](https://github.com/antoniwan/book-sun-and-moon).

## Locked — do not break lightly

- SVG line craft: drawn strokes, weight range, visible joints, bent-path identity in the art
- Story text and tense shift from the storyboard (the book is the copy)
- Page compositions in `src/lib/book/scenes.ts` (refine art, don’t replace the system)
- Paper / ink / crimson visual language
- Reader-facing framing: **little book about lines**, not a seek-and-find picture book

---

## Voice & framing

- [x] Say **page**, not spread, in the UI
- [x] Say **little book** at most once per screen
- [x] Cover deck invites without dumping the arc; front matter holds the rule
- [x] Front matter = possibility + placement + the bent red one (editor voice, not feedback paste)
- [x] CTA flow: cover **Before we begin** → front matter → **Begin** (page 1)
- [x] Prose styling: geometric terms italic; **red** bold in `--line-bent`
- [x] **Positive-values pass** on all story copy (curiosity, care, difference-as-character; no hunt commands / no “not good” judgment)
- [ ] Keep applying this voice on future page art + copy edits before moving on

---

## Layout & stage

- [x] Book shell, page-turn motion, hotspots, mobile stack, ReaderBar
- [ ] Caption placement — prose under art stays default

---

## Navigation & URL

- [x] Per-page URLs, history, swipe, keyboard, dots, resume, live region

---

## Optional (later)

- [ ] Read aloud — Web Speech; longer pause after page 12’s first line
- [ ] Bilingual EN/ES — only after translation exists
- [x] Print stylesheet (basic)
- [x] `vercel.json` SPA fallback

---

## Art / craft follow-ups

- [ ] Page 1 — line still “too small”?
- [ ] Pages 6–7 — town density / joints
- [ ] Pages 11–14 — drift, emptiness on 12, fragmentation, field on 14
- [ ] Decoy reds from page 10 — drawing craft only; never announce in UI

Constraint: **line draw system and scene data stay intact**; copy and chrome wrap them.
