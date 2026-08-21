# The Bent One

A little book for one small line with a bend in it — and everything a line might become.

The story lives in the page text. The drawings show what a line is allowed to be, depending on where it sits.

## More books

- **[Mia, the Sun, and the Moon](https://mia-the-sun-and-the-moon-web-book.stronghandssoftheart.com/)** — read it live · [source on GitHub](https://github.com/antoniwan/book-sun-and-moon)

## Read it

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

- Cover CTA **Before we begin** / **Antes de empezar** opens the front matter; **Begin** / **Empezar** starts page 1
- Switch language any time with **EN / ES** (saved for next visit)
- Arrow keys, Space, Enter, and PageUp/PageDown turn the page
- Home goes to the cover; End jumps to the last page
- Swipe left/right on touch devices
- Tap the left or right edge of the illustration to go back or forward
- Use the dots in the reader bar to jump to a page
- Each page has its own URL, such as `/1/one-line` or `/14/the-field`
- **Continue reading** appears on the cover if you left mid-book

## Deploy / SEO

Set `VITE_SITE_URL` to the production origin (no trailing slash) before build so Open Graph image URLs match. Default fallback is `https://the-bent-one.vercel.app`.

For best social previews, export a raster `public/og.jpg` later and point meta tags at it (many networks prefer JPG/PNG over SVG).

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
| `src/lib/book/spreads.ts` | Bilingual story text, cover/front copy, slugs |
| `src/lib/book/ui.ts` | Chrome strings (EN/ES) |
| `src/lib/book/seo.ts` | Document meta when language changes |
| `src/lib/lines/` | SVG draw-on line primitives |
| `src/lib/book/Book.svelte` | Shell, cover, routing |
| `src/lib/book/ReaderBar.svelte` | Footer chrome + language toggle |
| `TODO.md` | Backlog + craft follow-ups |

## Craft notes (for makers, not readers)

Storyboard “seek the bent line” notes were art direction. Reader copy follows positive human values: curiosity and care, difference as character, noticing beside the child — never duty, hunt commands, or apologizing for the bend.

See `TODO.md` and the voice guide comment in `spreads.ts`.
