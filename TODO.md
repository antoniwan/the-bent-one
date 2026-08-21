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

## Layout & stage (borrow carefully)

Mia uses a full-bleed art stage with a caption card and page-turn offset. Bent One is a **square seek surface** — text below art is currently working. Adopt Mia’s *shell*, not its caption-on-art default, unless seek still works in testing.

- [ ] **Book shell** — full-viewport stage (`min-h-svh`), clearer header + footer chrome like Mia’s Header / ReaderBar split
- [ ] **Page-turn motion** — directional enter (Mia’s `--page-delta` / slide) without restarting line draws mid-gesture awkwardly; redraw on settle only
- [ ] **Illustration hotspots** — tap/click left 25% / right 25% of the stage to prev/next (Mia pattern); keep center free for seeking
- [ ] **Mobile stack** — stage first, prose second; reader bar thumb-reachable; no cramped double nav
- [ ] **Spread 10 bleed** — confirm full-bleed explosion still reads when chrome is denser
- [ ] **Caption placement decision** — A/B: keep prose under art (default) vs optional floating caption; never cover the bent line on seek-critical spreads (1, 6, 11–12)

---

## Navigation & URL (from Mia)

Today: in-memory screen state only. Mia: deep links, resume, swipe, first/last.

- [ ] **Per-spread URLs** — e.g. `/`, `/front`, `/1/one-line` … `/14/the-field`, `/back` (slug from `spreads.ts` titles)
- [ ] **History-friendly prev/next** — browser back matches page turns
- [ ] **Swipe nav** — horizontal swipe threshold (~48px), ignore vertical scroll (port Mia `useSwipeNav` ideas to Svelte)
- [ ] **Keyboard parity** — keep ←/→/Space; add PageUp/PageDown, Home (cover), End (last spread / back)
- [ ] **Skip first / last** in reader bar (Mia ReaderBar)
- [ ] **Page dots** — 14 dots (or denser progress) for direct jump; active state clear for kids + adults
- [ ] **Resume reading** — `localStorage` last spread; cover CTA “Continue” when resume > start (Mia `storage`)
- [ ] **Live region** — announce “Spread N of 14: title” on change (Mia `aria-live`)

---

## Reader chrome

- [ ] **Dedicated ReaderBar** — extract from `Book.svelte`; prev / dots / next + optional first/last
- [ ] **Cover polish** — dedication / author line; “Open” + “Continue” when resume exists
- [ ] **Endpapers** — keep rule-of-the-world beat; optional second endpaper (back) echoing Mia’s closing credit
- [ ] **Focus / a11y** — focusable controls, `sr-only` labels, don’t trap focus in SVG
- [ ] **Reduced motion** — already partial; verify page-turn + swipe respect `prefers-reduced-motion`

---

## Optional (Mia has them; Bent One may not need yet)

- [ ] **Read aloud** — Web Speech for spread text; stop on page change; pace spread 12 with a longer pause after the first line
- [ ] **Bilingual EN/ES** — only if we translate; don’t scaffold until copy exists
- [ ] **Print stylesheet** — hide chrome/hotspots; print square art + text cleanly
- [ ] **Deploy** — Vercel project + `vercel.json` SPA fallback once routes exist

---

## Art / craft follow-ups (separate from layout)

Touch only when polishing a specific spread — not blocked by layout work:

- [ ] Spread 1 — line still “too small”?
- [ ] Spreads 6–7 — town density / joints / seek timing (~8s on 6)
- [ ] Spreads 11–14 — drift, emptiness on 12, fragmentation gradient, field frustration on 14
- [ ] Decoy reds — count and placement from 10 onward without announcing the trap

---

## Suggested order

1. ReaderBar + hotspots + swipe (no URL yet) — biggest kid-reader win, low risk to art  
2. URLs + resume  
3. Page-turn motion + shell polish  
4. Read aloud / print / bilingual only if needed  

Constraint for every PR: **line draw system and scene data stay intact**; layout wraps them.
