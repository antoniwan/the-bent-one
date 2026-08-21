export type ProsePart =
  | { kind: 'text'; value: string }
  | { kind: 'geo'; value: string }
  | { kind: 'red'; value: string }

/**
 * Geometric figures, qualities, and book-notions — always italic in prose.
 * Longer phrases first so “the bent one” wins over “bent”.
 */
const GEOMETRIC: string[] = [
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
  'explosion',
  'straight',
  'crooked',
  'dashed',
  'flat',
]

const geoPattern = GEOMETRIC.map(escapeRegExp).join('|')
const tokenPattern = new RegExp(`\\b(?:${geoPattern}|red)\\b`, 'gi')

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Split a prose string into plain / geometric / red parts. */
export function tokenizeProse(input: string): ProsePart[] {
  const parts: ProsePart[] = []
  let last = 0
  for (const match of input.matchAll(tokenPattern)) {
    const value = match[0]
    const index = match.index ?? 0
    if (index > last) {
      parts.push({ kind: 'text', value: input.slice(last, index) })
    }
    if (value.toLowerCase() === 'red') {
      parts.push({ kind: 'red', value })
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
