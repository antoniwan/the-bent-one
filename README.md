# The Bent One

A bilingual (English / Spanish) web picture book. The story follows a short line with a bend and the forms a line can take depending on placement and company.

Live site: production URL is set at build time via `VITE_SITE_URL` (default fallback: `https://the-bent-one.vercel.app`).

Related book in the same series: [Mia, the Sun, and the Moon](https://mia-the-sun-and-the-moon-web-book.stronghandssoftheart.com/) ([source](https://github.com/antoniwan/book-sun-and-moon)).

## Stack

- Svelte 5 + TypeScript
- Vite 8
- Static SPA deploy (Vercel rewrite to `index.html`)

Current version: `0.9.0` (see `package.json`). Version `1.0.0` is reserved until Spanish copy is finalized.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`).

```bash
npm run build
npm run preview
npm run check
```

## Reader behavior

- Cover: **Before we begin** / **Antes de empezar** opens front matter; **Begin** / **Empezar** starts page 1.
- Language: **EN / ES** toggle; preference is stored for later visits.
- Spanish story copy always uses *línea* / *líneas*. A **DEV ES F/M** control (local `npm run dev` only) switches the character epithet **La Doblada** / **El Doblado** (and *doblada* / *doblado*). Document and Open Graph titles stay **The Bent One** / **La Doblada**.
- Keyboard: Arrow keys, Space, Enter, Page Up / Page Down turn pages; Home returns to the cover; End jumps to the last screen.
- Touch: swipe left / right; tap the left or right edge of the illustration to go back or forward.
- Reader bar dots jump to a page.
- Each location has a URL (`/`, `/front`, `/1/one-line`, …, `/back`).
- **Continue reading** appears on the cover when a mid-book position was saved.

This book does not include read-aloud / Web Speech.

## Deploy and SEO

Set `VITE_SITE_URL` to the production origin (no trailing slash) before build so canonical and Open Graph image URLs match that origin.

Social previews currently use `public/og.svg`. Many networks prefer a raster `public/og.jpg` or `public/og.png`; export one when the production domain is fixed and point the meta tags at it.

`vercel.json` rewrites all routes to `index.html` so deep links work on a static host.

## Project layout

| Path | Role |
|------|------|
| `src/lib/book/scenes.ts` | Page illustrations (SVG line compositions) |
| `src/lib/book/spreads.ts` | Story text, cover / front / back copy, page slugs |
| `src/lib/book/ui.ts` | Chrome strings (EN / ES) |
| `src/lib/book/seo.ts` | Document meta updates when language changes |
| `src/lib/book/esGender.ts` | Spanish agreement tokens (*línea*) |
| `src/lib/lines/` | SVG stroke primitives and geometry helpers |
| `src/lib/book/Book.svelte` | Shell, cover, routing, navigation |
| `src/lib/book/ReaderBar.svelte` | Footer chrome and language control |
| `TODO.md` | Open work and constraints |

## Editorial notes

Storyboard notes that say “seek the bent line” are art direction only. Reader-facing copy should stay curious and careful: difference as character, noticing with the child, no hunt commands, and no apology for the bend.

See `TODO.md` and the voice guide comment in `src/lib/book/spreads.ts`.
