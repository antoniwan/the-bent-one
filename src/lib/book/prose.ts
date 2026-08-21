import type { Lang } from './lang'

export type ProsePart =
  | { kind: 'text'; value: string }
  | { kind: 'geo'; value: string }
  | { kind: 'red'; value: string }
  | { kind: 'color'; value: string }

/**
 * Geometric figures, qualities, and book-notions — always italic in prose.
 * Longer phrases first so “the bent one” / “el doblado” win over shorter tokens.
 */
const GEOMETRIC_EN: string[] = [
  'the bent one',
  'hexagon',
  'triangles',
  'triangle',
  'mountains',
  'mountain',
  'windows',
  'window',
  'shutters',
  'shutter',
  'squares',
  'square',
  'boxes',
  'box',
  'cubes',
  'cube',
  'circles',
  'circle',
  'shapes',
  'shape',
  'wheels',
  'wheel',
  'sails',
  'sail',
  'beaks',
  'beak',
  'birds',
  'bird',
  'corners',
  'corner',
  'joins',
  'join',
  'houses',
  'house',
  'boats',
  'boat',
  'roofs',
  'roof',
  'fences',
  'fence',
  'lines',
  'line',
  'middle',
  'bends',
  'bend',
  'bent',
  'dots',
  'dot',
  'pieces',
  'piece',
  'thinnest',
  'thin',
  'shorter',
  'short',
  'explosion',
  'straight',
  'crooked',
  'dashed',
  'apart',
  'flat',
]

const GEOMETRIC_ES: string[] = [
  'el doblado',
  'la doblada',
  'hexágono',
  'triángulos',
  'triángulo',
  'montañas',
  'montaña',
  'ventanas',
  'ventana',
  'cuadrados',
  'cuadrado',
  'círculos',
  'círculo',
  'formas',
  'forma',
  'ruedas',
  'rueda',
  'velas',
  'vela',
  'picos',
  'pico',
  'pájaros',
  'pájaro',
  'esquinas',
  'esquina',
  'uniones',
  'unión',
  'casas',
  'casa',
  'barcos',
  'barco',
  'techos',
  'techo',
  'cercas',
  'cerca',
  'líneas',
  'línea',
  'medio',
  'dobleces',
  'doblez',
  'dobladas',
  'doblados',
  'doblada',
  'doblado',
  'puntos',
  'punto',
  'pedacitos',
  'pedazos',
  'pedazo',
  'delgadas',
  'delgada',
  'delgado',
  'delgados',
  'fina',
  'fino',
  'largas',
  'larga',
  'largos',
  'largo',
  'cortas',
  'corta',
  'corto',
  'cortos',
  'explosión',
  'derechitas',
  'derechita',
  'derechos',
  'derecho',
  'rectas',
  'recta',
  'rectos',
  'recto',
  'chueca',
  'chueco',
  'rayitas',
  'aparte',
  'planas',
  'plana',
  'plano',
  'planos',
  'inquietas',
  'inquieta',
  'inquietos',
  'inquieto',
  'figuras',
  'figura',
  'cajas',
  'caja',
  'cubos',
  'cubo',
]

const RED_EN = 'red'
const RED_ES = 'roja|rojo|rojas|rojos'
/** Same word in EN/ES — cycles illustration line colors in prose. */
const COLOR_WORD = 'color'

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const patternByLang: Record<Lang, RegExp> = {
  en: new RegExp(
    `\\b(?:${GEOMETRIC_EN.map(escapeRegExp).join('|')}|${RED_EN}|${COLOR_WORD})\\b`,
    'gi',
  ),
  es: new RegExp(
    `\\b(?:${GEOMETRIC_ES.map(escapeRegExp).join('|')}|${RED_ES}|${COLOR_WORD})\\b`,
    'gi',
  ),
}

const redTestByLang: Record<Lang, RegExp> = {
  en: /^red$/i,
  es: /^(roja|rojo|rojas|rojos)$/i,
}

const colorTest = /^color$/i

/** Split a prose string into plain / geometric / red / color parts. */
export function tokenizeProse(input: string, lang: Lang = 'en'): ProsePart[] {
  const parts: ProsePart[] = []
  let last = 0
  const tokenPattern = patternByLang[lang]
  const redTest = redTestByLang[lang]

  for (const match of input.matchAll(tokenPattern)) {
    const value = match[0]
    const index = match.index ?? 0
    if (index > last) {
      parts.push({ kind: 'text', value: input.slice(last, index) })
    }
    if (redTest.test(value)) {
      parts.push({ kind: 'red', value })
    } else if (colorTest.test(value)) {
      parts.push({ kind: 'color', value })
    } else {
      parts.push({ kind: 'geo', value })
    }
    last = index + value.length
  }
  if (last < input.length) {
    parts.push({ kind: 'text', value: input.slice(last) })
  }
  return parts.length > 0 ? parts : [{ kind: 'text', value: input }]
}
