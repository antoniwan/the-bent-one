import type { LineSpec } from './types'

/** Deterministic PRNG for stable line fields across reloads. */
export function mulberry32(seed: number) {
  return function next() {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function straight(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): string {
  return `M ${x1} ${y1} L ${x2} ${y2}`
}

/** Place the bent path at position with scale/rotation via SVG transform string. */
export function bentTransform(
  x: number,
  y: number,
  scale = 1,
  rotateDeg = 0,
): string {
  return `translate(${x} ${y}) rotate(${rotateDeg}) scale(${scale})`
}

export function randomSegment(
  rand: () => number,
  bounds: { x: number; y: number; w: number; h: number },
  lenMin: number,
  lenMax: number,
): string {
  const len = lenMin + rand() * (lenMax - lenMin)
  const angle = rand() * Math.PI * 2
  const x1 = bounds.x + rand() * bounds.w
  const y1 = bounds.y + rand() * bounds.h
  const x2 = x1 + Math.cos(angle) * len
  const y2 = y1 + Math.sin(angle) * len
  return straight(x1, y1, x2, y2)
}

export function fieldOfLines(
  seed: number,
  count: number,
  bounds: { x: number; y: number; w: number; h: number },
  opts: {
    lenMin?: number
    lenMax?: number
    weightMin?: number
    weightMax?: number
    color?: LineSpec['color']
    delayBase?: number
    delayStep?: number
    idPrefix?: string
  } = {},
): LineSpec[] {
  const rand = mulberry32(seed)
  const {
    lenMin = 20,
    lenMax = 80,
    weightMin = 1,
    weightMax = 3.5,
    color = 'ink',
    delayBase = 0.15,
    delayStep = 0.02,
    idPrefix = 'seg',
  } = opts

  return Array.from({ length: count }, (_, i) => ({
    id: `${idPrefix}-${i}`,
    d: randomSegment(rand, bounds, lenMin, lenMax),
    color,
    weight: weightMin + rand() * (weightMax - weightMin),
    delay: delayBase + i * delayStep,
    duration: 0.6 + rand() * 0.5,
    opacity: 0.75 + rand() * 0.25,
  }))
}

export function edgeEnteringLines(
  seed: number,
  count: number,
): LineSpec[] {
  const rand = mulberry32(seed)
  const lines: LineSpec[] = []

  for (let i = 0; i < count; i++) {
    const edge = Math.floor(rand() * 4)
    const len = 40 + rand() * 180
    const weight = 1 + rand() * 3.2
    let x1 = 0
    let y1 = 0
    let x2 = 0
    let y2 = 0
    const t = rand()

    if (edge === 0) {
      // top
      x1 = 40 + t * 920
      y1 = -20
      x2 = x1 + (rand() - 0.5) * 40
      y2 = 40 + rand() * len
    } else if (edge === 1) {
      // right
      x1 = 1020
      y1 = 40 + t * 920
      x2 = 1000 - (40 + rand() * len)
      y2 = y1 + (rand() - 0.5) * 40
    } else if (edge === 2) {
      // bottom
      x1 = 40 + t * 920
      y1 = 1020
      x2 = x1 + (rand() - 0.5) * 40
      y2 = 1000 - (40 + rand() * len)
    } else {
      // left
      x1 = -20
      y1 = 40 + t * 920
      x2 = 40 + rand() * len
      y2 = y1 + (rand() - 0.5) * 40
    }

    // Some fully horizontal / vertical as the text says
    if (rand() > 0.55) {
      if (rand() > 0.5) {
        y2 = y1 // flat
      } else {
        x2 = x1 // upright
      }
    }

    lines.push({
      id: `company-${i}`,
      d: straight(x1, y1, x2, y2),
      color: 'ink',
      weight,
      delay: 0.2 + i * 0.04,
      duration: 0.7 + rand() * 0.4,
    })
  }

  return lines
}
