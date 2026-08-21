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
    craft: 'Not yet. This is the briefing.',
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
      'Only ours had the bend.',
    ],
    craft: 'Trivial — on purpose.',
  },
  {
    id: 3,
    slug: 'the-first-shape',
    title: 'The first shape',
    pages: 'pp 9–10',
    text: [
      'Three lines leaned together and made a triangle.',
      'Ours was one of the three.',
      'It was not a very good triangle. One side had a bend in it.',
      'The triangle did not seem to mind.',
    ],
    craft: 'Trivial.',
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
      'and one of them still a little bent.',
    ],
    craft: 'Easy. Red triangle, upper third.',
  },
  {
    id: 5,
    slug: 'the-trick',
    title: 'The trick',
    pages: 'pp 13–14',
    text: [
      'Then the shapes learned the trick.',
      'A square and a triangle stacked up and became a house.',
      'Ours was the roof.',
      'Rain slid off it a little crooked, and that was fine.',
    ],
    craft: 'Obvious. Let it be.',
  },
  {
    id: 6,
    slug: 'the-world',
    title: 'The world',
    pages: 'pp 15–16',
    text: [
      'The trick spread fast.',
      'Circles became wheels. Triangles became sails, and beaks, and mountains. Squares became windows with somebody behind them.',
      'Look at all of it. Look how much there is.',
      'Our roof is in here somewhere. Find it.',
    ],
    craft: 'About eight seconds.',
  },
  {
    id: 7,
    slug: 'peak',
    title: 'Peak',
    pages: 'pp 17–18',
    text: [
      'For a long time, everything held.',
      'Boats went out and came back. Wheels turned. Somebody was always hammering something new onto something old.',
      'It was the best part.',
      'It went on and on, and nobody wrote any of it down.',
    ],
    craft: 'Moderate. Reward the hunt.',
  },
  {
    id: 8,
    slug: 'one-line-comes-loose',
    title: 'One line comes loose',
    pages: 'pp 19–20',
    text: [
      'Then one afternoon a line came loose.',
      'Only one. From a fence, near the back, where nobody was looking.',
      'It lay down in the grass, and nothing came to put it back.',
    ],
    craft: 'Our house is up there, tiny, still fine.',
  },
  {
    id: 9,
    slug: 'falling',
    title: 'Falling',
    pages: 'pp 21–22',
    text: [
      'After that, things fell.',
      'Not all at once. A shutter. A wheel. A whole boat, slowly, over years.',
      'Everything that goes up is only borrowing.',
    ],
    craft: 'Easy — house at far right.',
  },
  {
    id: 10,
    slug: 'the-explosion',
    title: 'The explosion',
    pages: 'pp 23–24',
    text: [
      'And then the house.',
      'It did not fall so much as let go — all at once, in every direction — and for one second the whole thing was in the air.',
      'Every line it had ever been, flying apart.',
      'Ours is in there. Look fast.',
    ],
    craft: 'Hard, and now unreliable.',
  },
  {
    id: 11,
    slug: 'lines-again',
    title: 'Lines again',
    pages: 'pp 25–26',
    text: [
      'When the dust came down, there were no more things.',
      'No houses. No boats. No wheels.',
      'Only lines. Thousands of them, drifting.',
      'Ours was still bent. We could still find it.',
    ],
    craft: 'Findable. The last time.',
  },
  {
    id: 12,
    slug: 'the-bend-comes-out',
    title: 'The bend comes out',
    pages: 'pp 27–28',
    text: [
      'And then it wasn’t.',
      'Somewhere in all that drifting, the bend came out.',
      'Nobody saw it happen.',
      'It was just a line now, like the rest of them.',
    ],
    craft: 'Impossible. That is the page.',
  },
  {
    id: 13,
    slug: 'the-breaking',
    title: 'The breaking',
    pages: 'pp 29–30',
    text: [
      'The lines got shorter.',
      'They broke where they were weakest, and then the pieces broke, and then those broke,',
      'until there was nothing left to break.',
      'Just dots. Dots and dots and dots.',
      'One of them used to be ours. We were almost sure.',
    ],
    craft: 'Failing. Dozens of red dots now.',
  },
  {
    id: 14,
    slug: 'the-field',
    title: 'The field',
    pages: 'pp 31–32',
    text: [
      'The dots drifted apart.',
      'We watched as long as we could.',
      'Then they were too far, and too small, and too many.',
      'We lost it.',
      'We don’t know which one it was.',
    ],
    craft: 'Gone.',
  },
]

/** @deprecated use `pages` */
export const spreads = pages
export type SpreadMeta = PageMeta
