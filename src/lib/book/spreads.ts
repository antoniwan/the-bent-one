export interface PageMeta {
  id: number
  slug: string
  title: string
  pages: string
  text: string[]
  /** Craft note from the storyboard — not shown to readers */
  craft?: string
}

export const BOOK = {
  title: 'The Bent One',
  author: 'Antonio Rodriguez Martinez',
  /** Use once on the cover — nowhere else on that screen */
  kind: 'A little book',
  deck: 'For one small line with a bend in it — and everything a line might become.',
  /**
   * Front matter. Possibility, not plot. Read-aloud voice.
   * The bent red one gets a place; placement decides what a line is allowed to be.
   */
  rule: [
    'A line is what it is by where it sits.',
    'Lean it with others and it can be a roof. Leave it alone and it is only itself. Throw it outward and it can look like an explosion. Break it small enough and it looks like a dot.',
    'One of them is bent, and red.',
  ],
  credit: 'A little book',
} as const

/**
 * Voice guide (for future edits):
 * - Curiosity and care, never duty or a hunt
 * - Difference is character that suits, not a flaw to apologize for
 * - Notice with the reader; don’t order them around
 * - The ending may be unresolved without being cruel
 */
export const pages: PageMeta[] = [
  {
    id: 1,
    slug: 'one-line',
    title: 'One line',
    pages: 'pp 5–6',
    text: [
      'This is a line.',
      'It is not very long, and it has a bend in the middle, about here.',
      'Nobody knows how the bend got there.',
      'A curious little line.',
    ],
    craft: 'Wonder, not a briefing.',
  },
  {
    id: 2,
    slug: 'company-arrives',
    title: 'Company arrives',
    pages: 'pp 7–8',
    text: [
      'Soon there were other lines.',
      'Long ones and short ones, lines that lay down flat and lines that stood up very straight.',
      'All of them straight.',
      'Ours was the one with the bend.',
    ],
    craft: 'Identity, not exclusion.',
  },
  {
    id: 3,
    slug: 'the-first-shape',
    title: 'The first shapes',
    pages: 'pp 9–10',
    text: [
      'Three lines leaned together and made a triangle.',
      'Ours was one of the three.',
      'More lines liked becoming triangles after that. Some did. Some only almost.',
      'It was a peculiar triangle. One side had a bend in it.',
      'The triangle did not seem to mind. The bend suited it.',
    ],
    craft: 'Peculiar = character.',
  },
  {
    id: 4,
    slug: 'the-vocabulary',
    title: 'The vocabulary',
    pages: 'pp 11–12',
    text: [
      'After that, the lines could not stop.',
      'Squares. Circles. A hexagon that took six of them and a great deal of arguing.',
      'Shapes everywhere, and every single one of them made of lines,',
      'and one of them bent, the way it always was.',
      'A few shapes were slipping out the top. Nobody knows why.',
      'Even the thin line across the top ran off with them.',
    ],
    craft: 'Escapees + missing header rule.',
  },
  {
    id: 5,
    slug: 'the-trick',
    title: 'A house for the rain',
    pages: 'pp 13–14',
    text: [
      'The thin line came back. Good.',
      'Then it began to rain.',
      'A square and a triangle made a house — quick!',
      'Ours was the roof.',
      'Rain slid off it a little crooked, and that\'s super okay.',
    ],
    craft: 'Header returns; house as answer to weather, not a lecture on invention.',
  },
  {
    id: 6,
    slug: 'the-world',
    title: 'The world',
    pages: 'pp 15–16',
    text: [
      'Soon, almost every line was stacking!',
      'The rain stopped.',
      'Circles became wheels. Triangles became sails, and beaks, and mountains. Squares became windows with somebody behind them.',
      'All of it. So much of it.',
      'Our roof was in there somewhere too.',
    ],
    craft: 'Weather clears; shared wonder; stacking continues.',
  },
  {
    id: 7,
    slug: 'peak',
    title: 'The best part',
    pages: 'pp 17–18',
    text: [
      'For a long time, the shapes kept busy.',
      'They tried new joins. They touched different corners. Some lined up. Some made something nobody had seen yet.',
      'A few of them even got color. Nobody knew why or how!',
      'It was the best part.',
    ],
    craft: 'Warmth; same world as 6, color arrives as a wonder.',
  },
  {
    id: 8,
    slug: 'one-line-comes-loose',
    title: 'One line comes loose',
    pages: 'pp 19–20',
    text: [
      'Then one afternoon — just like that — a line came loose.',
      'Only one. The straight neighbor on our roof.',
      'It slipped off the back and lay down in the grass.',
      'It did not want to be a roof anymore.',
    ],
    craft: 'Zoom house; straight neighbor slips; autonomy, not rescue.',
  },
  {
    id: 9,
    slug: 'falling',
    title: 'They could choose',
    pages: 'pp 21–22',
    text: [
      'After that, the town began to wiggle.',
      'Wiggle, wiggle — a shutter, a wheel, a boat!',
      'Some lines went soft and dashed. Some held tight.',
      'Nothing has to stay what it is forever.',
      'What is even happening?!',
    ],
    craft: 'Free will prelude to explosion; dashed chaos; same town as 7, jittering.',
  },
  {
    id: 10,
    slug: 'the-explosion',
    title: 'BOOM!',
    pages: 'pp 23–24',
    text: [
      'And then the town went BOOM!',
      'Houses and boats and wheels flew apart!',
      'Over our heads! Under our feet! Everywhere! AAAHHH!',
      'And look — ours went whoosh too!',
    ],
    craft: 'Culmination; whole town; explosion toward reader; Seuss boom.',
  },
  {
    id: 11,
    slug: 'lines-again',
    title: 'Lines again',
    pages: 'pp 25–26',
    text: [
      'When the dust came down, the town was gone.',
      'No houses. No boats. No wheels.',
      'Only lines. A few scraps of them, drifting.',
      'Ours was still bent — but it started wiggling.',
      'Oh no. Another boom?!',
    ],
    craft: 'Quiet after BOOM; wiggle tease before the bend comes out.',
  },
  {
    id: 12,
    slug: 'the-bend-comes-out',
    title: 'The bend comes out',
    pages: 'pp 27–28',
    text: [
      'And then — wait — it wasn’t!',
      'The bend popped out in the drifting!',
      'What the… what the what?!',
      'It was a line now, like the rest of them.',
    ],
    craft: 'Surprise beat; Seuss open, toddler middle, quiet close.',
  },
  {
    id: 13,
    slug: 'the-breaking',
    title: 'Down to dots',
    pages: 'pp 29–30',
    text: [
      'The lines broke into shorter lines.',
      'Those broke where they were thinnest, into even shorter ones.',
      'Shorter. And shorter. And shorter still.',
      'Until a line was so short — it was a dot.',
      'Just dots. Dots and dots and dots and dots and dots and dots and dots.',
      'One of them used to be our little red line. We were almost sure.',
    ],
    craft: 'One process: break → shorten → dot (front-matter rule made visible).',
  },
  {
    id: 14,
    slug: 'the-field',
    title: 'Wherever it went',
    pages: 'pp 31–32',
    text: [
      'The dots drifted apart.',
      'We watched as long as we could.',
      'We don’t know which one was ours.',
      'But the dot knew who it was. And that’s enough.',
    ],
    craft: 'Not-knowing + the dot’s own knowing; The End under prose.',
  },
]

/** @deprecated use `pages` */
export const spreads = pages
export type SpreadMeta = PageMeta
