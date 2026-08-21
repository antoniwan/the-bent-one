# The Bent One

A web picture book: a child (and the reader) keeps track of one bent red line through everything it becomes — then loses it.

SVG lines are drawn on the page. Finding the bent one is the job.

Reader UX is inspired by [Mia, the Sun, and the Moon](https://github.com/antoniwan/book-sun-and-moon).

## Read it

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

- Arrow keys, Space, Enter, and PageUp/PageDown turn the page
- Home goes to the cover; End jumps to the last page
- Swipe left/right on touch devices
- Tap the left or right edge of the illustration to go back or forward (center stays free for seeking)
- Use the dots in the reader bar to jump to a spread
- Each page has its own URL, such as `/1/one-line` or `/14/the-field`
- **Continue reading** appears on the cover if you left mid-book

## Build

```bash
npm run build
npm run preview
```

For Vercel, `vercel.json` rewrites all routes to `index.html` so deep links work.

## Project shape

| Path | Role |
|------|------|
| `src/lib/book/scenes.ts` | Spread compositions (the drawings) |
| `src/lib/book/spreads.ts` | Story text + slugs |
| `src/lib/lines/` | SVG draw-on line primitives |
| `src/lib/book/Book.svelte` | Shell, cover, routing |
| `src/lib/book/ReaderBar.svelte` | Footer chrome |
| `TODO.md` | Layout backlog + craft follow-ups |

## Craft rules (don’t break lightly)

- One bent red line; everything else black (ochre + blue only on spread 7)
- From spread 10, decoy reds appear — never announce the trap
- Everything is separable line segments; joints stay visible
- Prose stays under the square art so seeking isn’t covered

See `TODO.md` for remaining polish.
