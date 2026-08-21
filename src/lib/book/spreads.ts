import type { LocalizedLines, LocalizedString } from './lang'

export interface PageMeta {
  id: number
  slug: string
  title: LocalizedString
  pages: string
  text: LocalizedLines
  /** Craft note from the storyboard — not shown to readers */
  craft?: string
}

export const BOOK = {
  title: {
    en: 'The Bent One',
    es: 'El Torcido',
  } satisfies LocalizedString,
  author: {
    en: 'Antonio Rodriguez Martinez',
    es: 'Antonio Rodríguez Martínez',
  } satisfies LocalizedString,
  /** Use once on the cover — nowhere else on that screen */
  kind: {
    en: 'A little book',
    es: 'Un cuentito',
  } satisfies LocalizedString,
  deck: {
    en: 'For one small line with a bend in it — and everything a line might become.',
    es: 'Para una pequeña línea con un doblez — y todo lo que una línea puede llegar a ser.',
  } satisfies LocalizedString,
  /**
   * Front matter. Possibility, not plot. Lap-time voice.
   * The bent red one gets a place; placement decides what a line is allowed to be.
   */
  rule: {
    en: [
      'A line is what it is by where it sits.',
      'Lean it with others and it can be a roof. Leave it alone and it is only itself. Throw it outward and it can look like an explosion. Break it small enough and it looks like a dot.',
      'One of them is bent, and red.',
    ],
    es: [
      'Una línea es lo que es según dónde se siente.',
      'Si se apoya con otras, puede ser un techo. Si se queda sola, es sólo ella misma. Si la lanzas hacia afuera, puede parecer una explosión. Si la partes lo bastante chiquita, parece un punto.',
      'Una de ellas está torcida, y es roja.',
    ],
  } satisfies LocalizedLines,
  credit: {
    en: 'A little book',
    es: 'Un cuentito',
  } satisfies LocalizedString,
  /**
   * Back matter — outside the story. Parent leaning in after The End.
   * Not a slogan; leaves page 14’s moral alone.
   */
  coda: {
    en: [
      'Between us? I never wanted that little red one to straighten out.',
      'A bend is just a bend. You’re allowed to have one.',
    ],
    es: [
      'Entre tú y yo: yo nunca quise que esa rojita se enderezara.',
      'Un doblez es sólo un doblez. Tú también puedes tener uno.',
    ],
  } satisfies LocalizedLines,
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
    title: { en: 'One line', es: 'Una línea' },
    pages: 'pp 5–6',
    text: {
      en: [
        'This is a line.',
        'It is not very long, and it has a bend in the middle, about here.',
        'Nobody knows how the bend got there.',
        'A curious little line.',
      ],
      es: [
        'Esta es una línea.',
        'No es muy larga, y tiene un doblez en el medio, más o menos aquí.',
        'Nadie sabe cómo llegó ese doblez.',
        'Una pequeña línea curiosa.',
      ],
    },
    craft: 'Wonder, not a briefing.',
  },
  {
    id: 2,
    slug: 'company-arrives',
    title: { en: 'Company arrives', es: 'Llega compañía' },
    pages: 'pp 7–8',
    text: {
      en: [
        'Soon there were other lines.',
        'Long ones and short ones, lines that lay down flat and lines that stood up very straight.',
        'All of them straight.',
        'Ours was the one with the bend.',
      ],
      es: [
        'Pronto hubo otras líneas.',
        'Largas y cortas, líneas que se acostaban planas y líneas que se paraban muy rectas.',
        'Todas rectas.',
        'La nuestra era la que tenía el doblez.',
      ],
    },
    craft: 'Identity, not exclusion.',
  },
  {
    id: 3,
    slug: 'the-first-shape',
    title: { en: 'The first shapes', es: 'Las primeras formas' },
    pages: 'pp 9–10',
    text: {
      en: [
        'Three lines leaned together and made a triangle.',
        'Ours was one of the three.',
        'More lines liked becoming triangles after that. Some did. Some only almost.',
        'It was a peculiar triangle. One side had a bend in it.',
        'The triangle did not seem to mind. The bend suited it.',
      ],
      es: [
        'Tres líneas se apoyaron juntas y formaron un triángulo.',
        'La nuestra era una de las tres.',
        'Después, a más líneas les gustó volverse triángulos. Algunas sí. Algunas sólo casi.',
        'Era un triángulo peculiar. Un lado tenía un doblez.',
        'Al triángulo no pareció importarle. El doblez le quedaba bien.',
      ],
    },
    craft: 'Peculiar = character.',
  },
  {
    id: 4,
    slug: 'the-vocabulary',
    title: { en: 'The vocabulary', es: 'El vocabulario' },
    pages: 'pp 11–12',
    text: {
      en: [
        'After that, the lines could not stop.',
        'Squares. Circles. A hexagon that took six of them and a great deal of arguing.',
        'Shapes everywhere, and every single one of them made of lines,',
        'and one of them bent, the way it always was.',
        'A few shapes were slipping out the top. Nobody knows why.',
        'Even the thin line across the top ran off with them.',
      ],
      es: [
        'Después de eso, las líneas no podían parar.',
        'Cuadrados. Círculos. Un hexágono que necesitó seis de ellas y un montón de discusiones.',
        'Formas por todas partes, y cada una hecha de líneas,',
        'y una de ellas torcida, como siempre.',
        'Algunas formas se escapaban por arriba. Nadie sabe por qué.',
        'Hasta la línea delgada de arriba se fue con ellas.',
      ],
    },
    craft: 'Escapees + missing header rule.',
  },
  {
    id: 5,
    slug: 'the-trick',
    title: { en: 'A house for the rain', es: 'Una casa para la lluvia' },
    pages: 'pp 13–14',
    text: {
      en: [
        'The thin line came back. Good.',
        'Then it began to rain.',
        'A square and a triangle made a house — quick!',
        'Ours was the roof.',
        "Rain slid off it a little crooked, and that's super okay.",
      ],
      es: [
        'La línea delgada volvió. Bien.',
        'Entonces empezó a llover.',
        'Un cuadrado y un triángulo hicieron una casa — ¡rápido!',
        'La nuestra era el techo.',
        'La lluvia se resbalaba un poquito chueca, y eso está súper bien.',
      ],
    },
    craft: 'Header returns; house as answer to weather, not a lecture on invention.',
  },
  {
    id: 6,
    slug: 'the-world',
    title: { en: 'The world', es: 'El mundo' },
    pages: 'pp 15–16',
    text: {
      en: [
        'Soon, almost every line was stacking!',
        'The rain stopped.',
        'Circles became wheels. Triangles became sails, and beaks, and mountains. Squares became windows with somebody behind them.',
        'All of it. So much of it.',
        'Our roof was in there somewhere too.',
      ],
      es: [
        '¡Pronto, casi todas las líneas estaban apilándose!',
        'La lluvia paró.',
        'Los círculos se volvieron ruedas. Los triángulos se volvieron velas, y picos, y montañas. Los cuadrados se volvieron ventanas con alguien detrás.',
        'Todo eso. Tantísimo.',
        'Nuestro techo también estaba ahí en alguna parte.',
      ],
    },
    craft: 'Weather clears; shared wonder; stacking continues.',
  },
  {
    id: 7,
    slug: 'peak',
    title: { en: 'The best part', es: 'La mejor parte' },
    pages: 'pp 17–18',
    text: {
      en: [
        'For a long time, the shapes kept busy.',
        'They tried new joins. They touched different corners. Some lined up. Some made something nobody had seen yet.',
        'A few of them even got color. Nobody knew why or how!',
        'It was the best part.',
      ],
      es: [
        'Por mucho tiempo, las formas siguieron ocupadas.',
        'Probaron uniones nuevas. Tocaron esquinas distintas. Algunas se alinearon. Algunas hicieron algo que nadie había visto.',
        '¡Algunas hasta tuvieron color. Nadie sabía por qué ni cómo!',
        'Fue la mejor parte.',
      ],
    },
    craft: 'Warmth; same world as 6, color arrives as a wonder.',
  },
  {
    id: 8,
    slug: 'one-line-comes-loose',
    title: { en: 'One line comes loose', es: 'Una línea se suelta' },
    pages: 'pp 19–20',
    text: {
      en: [
        'Then one afternoon — just like that — a line came loose.',
        'Only one. The straight neighbor on our roof.',
        'It slipped off the back and lay down in the grass.',
        'It did not want to be a roof anymore.',
        'Our little bent red line didn’t understand what was happening at all!',
      ],
      es: [
        'Entonces, una tarde — así de pronto — una línea se soltó.',
        'Sólo una. La vecina recta de nuestro techo.',
        'Se resbaló por atrás y se acostó en la hierba.',
        'Ya no quería ser techo.',
        '¡Nuestra pequeña línea roja torcida no entendía nada de lo que pasaba!',
      ],
    },
    craft: 'Zoom house; neighbor slips; autonomy; bent one is as confused as the kids.',
  },
  {
    id: 9,
    slug: 'falling',
    title: { en: 'They could choose', es: 'Podían elegir' },
    pages: 'pp 21–22',
    text: {
      en: [
        'After that, the town began to wiggle.',
        'Wiggle, wiggle — a shutter, a wheel, a boat!',
        'Some lines went soft and dashed. Some held tight.',
        'Nothing has to stay what it is forever.',
        'What is even happening?!',
      ],
      es: [
        'Después de eso, el pueblo empezó a menearse.',
        '¡Menea, menea — una persiana, una rueda, un barco!',
        'Algunas líneas se pusieron blanditas y a rayitas. Algunas se agarraron fuerte.',
        'Nada tiene que quedarse siendo lo mismo para siempre.',
        '¡¿Qué está pasando?!',
      ],
    },
    craft: 'Free will prelude to explosion; dashed chaos; same town as 7, jittering.',
  },
  {
    id: 10,
    slug: 'the-explosion',
    title: { en: 'BOOM!', es: '¡BUM!' },
    pages: 'pp 23–24',
    text: {
      en: [
        'And then the town went BOOM!',
        'Houses and boats and wheels flew apart!',
        'Over our heads! Under our feet! Everywhere! AAAHHH!',
        'And look — ours went whoosh too!',
      ],
      es: [
        '¡Y entonces el pueblo hizo BUM!',
        '¡Casas y barcos y ruedas volaron por todos lados!',
        '¡Sobre nuestras cabezas! ¡Bajo nuestros pies! ¡En todas partes! ¡AAAAHHH!',
        '¡Y mira — la nuestra también hizo fiuu!',
      ],
    },
    craft: 'Culmination; whole town; explosion toward reader; Seuss boom.',
  },
  {
    id: 11,
    slug: 'lines-again',
    title: { en: 'Lines again', es: 'Otra vez líneas' },
    pages: 'pp 25–26',
    text: {
      en: [
        'After the big boom, it got quiet.',
        'The town was gone.',
        'No houses. No boats. No wheels.',
        'Only lines. A few scraps of them, drifting.',
        'Ours was still bent — but it started wiggling.',
        'Oh no. Another boom?!',
      ],
      es: [
        'Después del gran bum, todo se quedó quieto.',
        'El pueblo ya no estaba.',
        'Ni casas. Ni barcos. Ni ruedas.',
        'Sólo líneas. Unos pedacitos, flotando.',
        'La nuestra seguía torcida — pero empezó a menearse.',
        'Ay no. ¿Otro bum?!',
      ],
    },
    craft: 'Aftermath in toddler-clear beats; wiggle tease.',
  },
  {
    id: 12,
    slug: 'the-bend-comes-out',
    title: { en: 'The bend comes out', es: 'Sale el doblez' },
    pages: 'pp 27–28',
    text: {
      en: [
        'And then — wait — it wasn’t!',
        'The bend popped out in the drifting!',
        'What the… what the what?!',
        'It was a line now, like the rest of them.',
      ],
      es: [
        'Y entonces — espera — ¡no era!',
        '¡El doblez se salió mientras flotaba!',
        '¿Qué… qué qué qué?!',
        'Ahora era una línea, como las demás.',
      ],
    },
    craft: 'Surprise beat; Seuss open, toddler middle, quiet close.',
  },
  {
    id: 13,
    slug: 'the-breaking',
    title: { en: 'Down to dots', es: 'Hasta puntos' },
    pages: 'pp 29–30',
    text: {
      en: [
        'Then the lines began to shrink.',
        'Snap! — right where they were thinnest.',
        'Smaller. And smaller. And smaller still.',
        'Until a line was so small — it was a dot.',
        'Just dots. Dots and dots and dots and dots and dots and dots and dots.',
        'One of them used to be our little red line. We were almost sure.',
      ],
      es: [
        'Entonces las líneas empezaron a encogerse.',
        '¡¡Crack!! — justo donde estaban más delgadas.',
        'Más chiquitas. Y más chiquitas. Y todavía más.',
        'Hasta que una línea era tan chiquita — que era un punto.',
        'Sólo puntos. Puntos y puntos y puntos y puntos y puntos y puntos y puntos.',
        'Uno de ellos había sido nuestra pequeña línea roja. Estábamos casi seguros.',
      ],
    },
    craft: 'Motion kids can feel: shrink → snap → smaller → dot.',
  },
  {
    id: 14,
    slug: 'the-field',
    title: { en: 'Wherever it went', es: 'Dondequiera que fue' },
    pages: 'pp 31–32',
    text: {
      en: [
        'And then those dots drifted apart.',
        'We watched as long as we could.',
        'We don’t know which one was ours.',
        'But the red dot knew who it was.',
        'And that’s enough. Knowing who you are is enough.',
      ],
      es: [
        'Y entonces aquellos puntos se alejaron.',
        'Miramos todo lo que pudimos.',
        'No sabemos cuál era el nuestro.',
        'Pero el punto rojo sí sabía quién era.',
        'Y eso basta. Saber quién eres basta.',
      ],
    },
    craft: 'Last line bold moral; red on the knowing beat.',
  },
]

/** @deprecated use `pages` */
export const spreads = pages
export type SpreadMeta = PageMeta
