# The Bent One

A little book for one small line with a bend in it — and everything a line might become.

The story lives in the page text. The drawings show what a line is allowed to be, depending on where it sits.

Reader chrome is inspired by [Mia, the Sun, and the Moon](https://github.com/antoniwan/book-sun-and-moon).

## Read it

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

- Cover CTA **Before we begin** opens the front matter; **Begin** starts page 1
- Arrow keys, Space, Enter, and PageUp/PageDown turn the page
- Home goes to the cover; End jumps to the last page
- Swipe left/right on touch devices
- Tap the left or right edge of the illustration to go back or forward
- Use the dots in the reader bar to jump to a page
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
| `src/lib/book/scenes.ts` | Page compositions (the drawings) |
| `src/lib/book/spreads.ts` | Story text, cover/front copy, slugs |
| `src/lib/lines/` | SVG draw-on line primitives |
| `src/lib/book/Book.svelte` | Shell, cover, routing |
| `src/lib/book/ReaderBar.svelte` | Footer chrome |
| `TODO.md` | Backlog + craft follow-ups |

## Craft notes (for makers, not readers)

Storyboard “seek the bent line” notes were art direction. Readers meet possibility and watching — not a hunt brief on the cover.

See `TODO.md` for remaining polish.
