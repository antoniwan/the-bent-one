export type LineColor = 'ink' | 'bent' | 'decoy' | 'ochre' | 'water'

export interface LineSpec {
  id: string
  d: string
  color?: LineColor
  weight?: number
  delay?: number
  duration?: number
  opacity?: number
  dashed?: boolean
  dashPattern?: string
  className?: string
  /** When false, skip stroke-draw intro (useful for looping rain). Default true. */
  animate?: boolean
}

export const VIEWBOX = { w: 1000, h: 1000 } as const

/** The bent one's canonical shape in local coords (length ~100). */
export const BENT_PATH =
  'M 0 0 L 32 1.5 L 40 -9 L 48 1 L 100 0'
