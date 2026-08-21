export interface SpreadMeta {
  id: number
  title: string
  pages: string
  text: string[]
  /** Seek difficulty hint — never shown as spoilers in UI */
  seek: string
}

export const spreads: SpreadMeta[] = [
  {
    id: 1,
    title: 'One line',
    pages: 'pp 5–6',
    text: [
      'This is a line.',
      'It is not very long, and it has a bend in the middle, about here.',
      'Nobody knows how the bend got there.',
      'Keep your eye on it. You are going to need to.',
    ],
    seek: 'Not yet. This is the briefing.',
  },
  {
    id: 2,
    title: 'Company arrives',
    pages: 'pp 7–8',
    text: [
      'Soon there were other lines.',
      'Long ones and short ones, lines that lay down flat and lines that stood up very straight.',
      'All of them straight.',
      'Only ours had the bend.',
    ],
    seek: 'Trivial — on purpose.',
  },
  {
    id: 3,
    title: 'The first shape',
    pages: 'pp 9–10',
    text: [
      'Three lines leaned together and made a triangle.',
      'Ours was one of the three.',
      'It was not a very good triangle. One side had a bend in it.',
      'The triangle did not seem to mind.',
    ],
    seek: 'Trivial.',
  },
  {
    id: 4,
    title: 'The vocabulary',
    pages: 'pp 11–12',
    text: [
      'After that, the lines could not stop.',
      'Squares. Circles. A hexagon that took six of them and a great deal of arguing.',
      'Shapes everywhere, and every single one of them made of lines,',
      'and one of them still a little bent.',
    ],
    seek: 'Easy. Red triangle, upper third.',
  },
  {
    id: 5,
    title: 'The trick',
    pages: 'pp 13–14',
    text: [
      'Then the shapes learned the trick.',
      'A square and a triangle stacked up and became a house.',
      'Ours was the roof.',
      'Rain slid off it a little crooked, and that was fine.',
    ],
    seek: 'Obvious. Let it be.',
  },
  {
    id: 6,
    title: 'The world',
    pages: 'pp 15–16',
    text: [
      'The trick spread fast.',
      'Circles became wheels. Triangles became sails, and beaks, and mountains. Squares became windows with somebody behind them.',
      'Look at all of it. Look how much there is.',
      'Our roof is in here somewhere. Find it.',
    ],
    seek: 'About eight seconds.',
  },
  {
    id: 7,
    title: 'Peak',
    pages: 'pp 17–18',
    text: [
      'For a long time, everything held.',
      'Boats went out and came back. Wheels turned. Somebody was always hammering something new onto something old.',
      'It was the best part.',
      'It went on and on, and nobody wrote any of it down.',
    ],
    seek: 'Moderate. Reward the hunt.',
  },
  {
    id: 8,
    title: 'One line comes loose',
    pages: 'pp 19–20',
    text: [
      'Then one afternoon a line came loose.',
      'Only one. From a fence, near the back, where nobody was looking.',
      'It lay down in the grass, and nothing came to put it back.',
    ],
    seek: 'Our house is up there, tiny, still fine.',
  },
  {
    id: 9,
    title: 'Falling',
    pages: 'pp 21–22',
    text: [
      'After that, things fell.',
      'Not all at once. A shutter. A wheel. A whole boat, slowly, over years.',
      'Everything that goes up is only borrowing.',
    ],
    seek: 'Easy — house at far right.',
  },
  {
    id: 10,
    title: 'The explosion',
    pages: 'pp 23–24',
    text: [
      'And then the house.',
      'It did not fall so much as let go — all at once, in every direction — and for one second the whole thing was in the air.',
      'Every line it had ever been, flying apart.',
      'Ours is in there. Look fast.',
    ],
    seek: 'Hard, and now unreliable.',
  },
  {
    id: 11,
    title: 'Lines again',
    pages: 'pp 25–26',
    text: [
      'When the dust came down, there were no more things.',
      'No houses. No boats. No wheels.',
      'Only lines. Thousands of them, drifting.',
      'Ours was still bent. We could still find it.',
    ],
    seek: 'Findable. The last time.',
  },
  {
    id: 12,
    title: 'The bend comes out',
    pages: 'pp 27–28',
    text: [
      'And then it wasn’t.',
      'Somewhere in all that drifting, the bend came out.',
      'Nobody saw it happen.',
      'It was just a line now, like the rest of them.',
    ],
    seek: 'Impossible. That is the page.',
  },
  {
    id: 13,
    title: 'The breaking',
    pages: 'pp 29–30',
    text: [
      'The lines got shorter.',
      'They broke where they were weakest, and then the pieces broke, and then those broke,',
      'until there was nothing left to break.',
      'Just dots. Dots and dots and dots.',
      'One of them used to be ours. We were almost sure.',
    ],
    seek: 'Failing. Dozens of red dots now.',
  },
  {
    id: 14,
    title: 'The field',
    pages: 'pp 31–32',
    text: [
      'The dots drifted apart.',
      'We watched as long as we could.',
      'Then they were too far, and too small, and too many.',
      'We lost it.',
      'We don’t know which one it was.',
    ],
    seek: 'Gone.',
  },
]
