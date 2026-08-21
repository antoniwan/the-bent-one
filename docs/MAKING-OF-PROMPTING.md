# Making *The Bent One*: prompting, craft, and collaboration

A working report for Antonio Rodriguez Martinez — how this web book was made with Cursor agents, what the prompting patterns were, and what those patterns produced. Written so it can feed a longer essay, talk, or studio note about building bilingual children’s web books with AI.

**Project:** [the-bent-one](https://github.com/antoniwan/the-bent-one)  
**Version at writing:** `1.0.0`  
**Stack:** Svelte 5 + TypeScript + Vite 8 (static SPA)  
**Related:** [*Mia, the Sun, and the Moon*](https://mia-the-sun-and-the-moon-web-book.stronghandssoftheart.com/)  
**Primary agent chats (Cursor):** [project seed & page craft](d2ba36b4-0dd5-46c8-8fd8-23b94375a699), [docs, Spanish, SEO, dedication](49cf354a-b95d-4f6d-8dcc-0acd101a6a5b)

---

## 1. What this book is

*The Bent One* / *La Doblada* is a little bilingual web picture book about a short red line with a bend — and what a line can become depending on where it sits: roof, town, boom, dots, identity.

It is not a seek-and-find game. The story lives in the prose. The drawings are SVG line compositions that draw on, wiggle, rain, flee, and explode in sync with the page.

It ships as a static app: cover → front matter → 14 story pages → back matter (coda + collapsible dedication). English and Spanish. Keyboard, swipe, dots (desktop), resume, deep links, SEO, icons.

Dedication (collapsed by default):

> For my children — Andre, Mia, Catalina, Dario-kun, and Gino.  
> Thank you for teaching me so much.  
> I love you.

---

## 2. Timeline (compressed)

| Phase | When (approx.) | What happened |
|-------|----------------|---------------|
| Seed | 2026-08-20 evening | Storyboard PDF → first web book shell |
| English page craft | 2026-08-21 morning | Page-by-page art + prose; “spread” → “page”; voice rules |
| Scenes & motion | Same day | Escape, rain, birds, sea, neighbor, boom, dust, wiggle |
| Bilingual + SEO | Same day | EN/ES, gender experiments, meta |
| Spanish ear pass | Same afternoon | Boricua / Seuss / toddler editor lens page by page |
| Ship voice | Same evening | Icons, JSON-LD, dedication, **v1.0.0** |

Roughly **43 commits** from init to v1 — one intense creative day after the seed, following a reference reader (Mia) without cloning it blindly.

---

## 3. How you prompted (the real method)

This section is the heart of the report. Your prompting was not “write me a children’s book.” It was **direction**, the way a maker directs a studio.

### 3.1 Start from a real artifact

First move: attach the storyboard PDF and say you want to build *this* web book. That locked:

- page count and arc
- the bent red line as identity
- art as line-craft, not illustration collage

Agents invent less when the source of truth is a file in the chat.

### 3.2 Short, sharp feedback loops

Most messages were **one page, one problem, one tone note** — not multi-chapter briefs.

Examples of the pattern:

- “change spread to pages please”
- “red should be bold and red, same red as the line”
- “the triangle doesn’t look like a triangle”
- “it was not a very good triangle sounds asshole-y”
- “I’m SO sorry! I meant to say page 4”

That last one matters: you corrected yourself in public and kept moving. Agents and humans both stay calibrated when the director owns the miss.

### 3.3 “Don’t take this literally”

A recurring instruction — especially on Spanish:

> don’t take this feedback literally, think about it and apply it from the pov or expertise of a childrens book writer / editor

You supplied **raw speech** (boricua dad voice, Seuss energy, emotional truth) and asked for **editorial translation**. That is a high-skill prompting move: you keep authorship of feeling; the agent keeps craft of form.

Raw → craft examples:

| Your raw | Editorial landing |
|----------|-------------------|
| “anda pal’” (wink at *anda pa’l carajo*) | *¡Anda! ¿Otro bum?!* (kid-safe, still PR) |
| “se volvieran inquietas versus no podían parar” | Restless lines, Seuss beats on page 4 |
| long philosophy about boxes/cubes/infinite curiosity | Toddler chain: line → box → cube → ¿quién sabe? |
| “fua / rakata” | *¡Fua!* snap + *¡Rakata!* cascade |

### 3.4 Dual lenses: child + adult ear

You constantly tested Spanish against:

1. **Toddler ear** — will a kid know *persiana*? (*ventana* instead)
2. **Adult boricua ear** — *aguacero*, *bregaba bien chévere*, *grama*, *bien rapidito*
3. **Your own adult confusion** — “trazo is something i dont even know wtf it is”

That killed the clever-but-wrong *trazo* masculine noun path. Production Spanish stayed on *línea*. DEV kept a title toggle (*La Doblada* / *El Doblado*) for craft checks only.

### 3.5 Asymmetry is allowed

You asked: can *barriguita* be Spanish-only? Yes. Bilingual books need not be line-for-line mirrors. English kept literary Seuss; Spanish got belly, aguacero, fua. Page 12 later found a **happy medium** when English missed the old rhythm — you asked for compromise instead of forcing one language to win.

### 3.6 Systems prompts vs story prompts

You switched modes cleanly:

- **Systems:** “hide dots on mobile,” “wiggle when the reader hits that sentence,” “DEV gender toggle,” “exhaustive SEO + JSON-LD,” “write me a pasteable SEO prompt for the other book”
- **Story:** page voice, moral beats, onomatopoeia
- **Docs:** “formal simple honest objective english” for README/TODO

Agents perform better when the mode is named by the work, not by jargon.

### 3.7 Emotional honesty as direction

Near the end:

> i'm fucking crying of emotion reading through this book… can we add… a dedicatoria for my babies…

That is not noise. That is the product requirement: the book must hold love. The dedication is small and collapsed so it does not compete with the coda — craft serving feeling.

### 3.8 Voice rules you enforced (and that stuck)

Captured in README / `spreads.ts` craft notes / TODO:

- Curiosity and care, never duty or a hunt
- Difference as character, not a flaw to apologize for
- Notice with the reader; don’t order them around
- Possibility language (*puede parecer*), not certainty lectures
- Geometric words italic; red words in bent crimson
- “Little book” at most once per screen
- Say **page**, not spread

These rules came from **prompted corrections**, not from a brand deck written first.

---

## 4. What the agent actually built (architecture map)

Useful when writing about “AI made my book” without the myth that it typed the whole novel alone.

| Layer | Role | Main files |
|-------|------|------------|
| Story text | EN/ES copy, titles, coda, dedication | `src/lib/book/spreads.ts` |
| Chrome strings | Buttons, a11y labels | `src/lib/book/ui.ts` |
| Prose styling | Italic geometry, red, color-cycle | `src/lib/book/prose.ts`, `ProseText.svelte` |
| Scenes | Page illustrations as data | `src/lib/book/scenes.ts` (~2k lines) |
| Line primitives | Draw-on strokes, bent path | `src/lib/lines/*` |
| Shell | Routing, cover, boom field | `Book.svelte`, `paths.ts`, `storage.ts` |
| Language | Persist EN/ES; DEV title gender | `language.svelte.ts`, `esGender.ts` |
| SEO | Meta + JSON-LD sync | `seo.ts`, `index.html`, `public/*` |

`craft` fields on pages are **editor notes only** — never shown to readers. They are the residue of prompting: intent frozen next to the text.

---

## 5. Major creative arcs (for the essay)

### Arc A — Naming the object

Storyboard said “spread.” You said: this is a little book; say **page**. That one rename fixed marketing, UI, and mental model.

### Arc B — Closing the triangle

Early art failed geometry. You rejected soft almost-shapes until the bent side **closed** the triangle and “peculiar” replaced “not very good.” Moral: difference can be beautiful without apology.

### Arc C — Escape and weather

Page 4 shapes flee into the header; even the header rule runs off; page 5 brings rain as *aguacero* and a crooked roof that sheds water “súper bien.” Systems (overflow, animations) served story jokes.

### Arc D — Choice → boom → aftermath

Neighbor leaves the roof. Town can choose. Boom toward the reader. Lines again; bend wiggles only when prose says so; bend pops out; shrink to dots; red dot knows who it is.

### Arc E — Spanish as co-authoring

Not a translation dump. A second writing of the book in the mouth of a Puerto Rican parent reading to toddlers — with Seuss rhythm and editor discipline.

### Arc F — Shipping as love letter

SEO ELI6 (“a little book about a red line with a bend”), icons as the squiggle, dedication for Andre, Mia, Catalina, Dario-kun, Gino. Version **1.0.0**.

---

## 6. Prompting anti-patterns you avoided

Worth naming so the essay can teach:

1. **Big-bang “generate the whole book”** — you didn’t. You seeded from a storyboard and iterated.
2. **Letting the model keep clever wrong Spanish** (*trazo*) — you killed it with lived vocabulary.
3. **Treat AI prose as final** — you rewrote with emotional and cultural tests.
4. **Hide the parent** — you put the dedication in, collapsed, honest.
5. **Endless abstraction in kids’ morals** — you swapped philosophy for concrete chains (line → box → cube).

---

## 7. Reusable prompting recipes (steal these)

### Recipe: Page voice pass

```text
On page N (Spanish):
[paste your raw lines / complaints]

Don’t take this literally. Apply it as a children’s book editor.
Keep toddler-clear. Allow light boricua texture.
Keep the same story beats as English unless I say otherwise.
```

### Recipe: Art sync

```text
On page N, [visual must match prose beat X].
If timing matters, delay or trigger when the reader reaches that sentence.
```

### Recipe: Systems for another book

You already extracted the SEO checklist into a pasteable prompt (icons, OG PNG, JSON-LD Book graph, hreflang, runtime lang sync). Keep that prompt next to Mia / future books.

### Recipe: Docs tone

```text
Audit docs. Formal, simple, honest, objective English.
Story copy stays literary; only developer docs change.
```

---

## 8. Metrics (approximate, for the making-of)

| Signal | Scale |
|--------|--------|
| Git commits (init → v1) | ~43 |
| Story pages | 14 + cover/front/back |
| Primary agent threads | 2 long Cursor chats |
| User turns (docs/Spanish thread) | ~36 |
| User turns (seed/craft thread) | ~88 |
| Languages | EN + ES |
| Dedication names | 5 children |

Numbers are scaffolding for writing — not a productivity score. The real metric is: a parent cried reading it, then dedicated it.

---

## 9. Open craft (post-v1)

Still honest:

- Confirm production `VITE_SITE_URL` when the final domain is fixed
- Optional art density passes (pages 1, 6–7, 11–14)
- Optional analytics / portfolio link
- Ongoing Spanish ear passes as kids react out loud

v1.0.0 means: the book is itself. Not that nothing will ever bend again.

---

## 10. Suggested outline if you write the long essay

1. **Hook:** Reading the finished Spanish aloud and crying; naming the kids.
2. **Origin:** Storyboard PDF; Mia as sibling book; Strong Hands Soft Heart.
3. **Tooling without mystique:** Cursor agents as a tireless junior — you directed.
4. **The method:** short feedback; “don’t take literally”; toddler + boricua ears.
5. **Case studies:** triangle close; *trazo* rejection; *aguacero*; line→box→cube; Fua/Rakata; delayed wiggle.
6. **Systems as care:** SEO a six-year-old can understand; icons as the bent line.
7. **Ethics:** difference without apology; no hunt; bilingual asymmetry.
8. **Closing:** *A bend is just a bend. You’re allowed to have one.*

---

## 11. File pointers for future you

| Doc / code | Why |
|------------|-----|
| `src/lib/book/spreads.ts` | Story + dedication + craft notes |
| `src/lib/book/scenes.ts` | Visual storyboard-in-code |
| `README.md` | Honest project description |
| `TODO.md` | Constraints and leftovers |
| `docs/MAKING-OF-PROMPTING.md` | This report |

---

*Prepared for the v1.0.0 voice of the book. Update this file when you publish the essay or when the kids rename the moral.*
