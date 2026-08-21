import { spreads } from './spreads'

export type BookLocation =
  | { kind: 'cover' }
  | { kind: 'front' }
  | { kind: 'spread'; index: number }
  | { kind: 'back' }

export function locationToStep(loc: BookLocation): number {
  if (loc.kind === 'cover') return 0
  if (loc.kind === 'front') return 1
  if (loc.kind === 'spread') return 2 + loc.index
  return 2 + spreads.length // back
}

export function stepToLocation(step: number): BookLocation {
  const clamped = Math.min(Math.max(step, 0), 2 + spreads.length)
  if (clamped === 0) return { kind: 'cover' }
  if (clamped === 1) return { kind: 'front' }
  if (clamped >= 2 + spreads.length) return { kind: 'back' }
  return { kind: 'spread', index: clamped - 2 }
}

export function pathForLocation(loc: BookLocation): string {
  if (loc.kind === 'cover') return '/'
  if (loc.kind === 'front') return '/front'
  if (loc.kind === 'back') return '/back'
  const spread = spreads[loc.index]
  return `/${spread.id}/${spread.slug}`
}

export function locationFromPathname(pathname: string): BookLocation | null {
  const clean = pathname.replace(/\/+$/, '') || '/'
  if (clean === '/') return { kind: 'cover' }
  if (clean === '/front') return { kind: 'front' }
  if (clean === '/back') return { kind: 'back' }

  const match = clean.match(/^\/(\d+)\/([a-z0-9-]+)$/)
  if (!match) return null
  const id = Number(match[1])
  const slug = match[2]
  const index = spreads.findIndex((s) => s.id === id)
  if (index < 0) return null
  // Allow id-only mismatch on slug by redirecting via canonical later
  if (spreads[index].slug !== slug) {
    return { kind: 'spread', index }
  }
  return { kind: 'spread', index }
}

export function liveLabel(loc: BookLocation): string {
  if (loc.kind === 'cover') return 'Cover'
  if (loc.kind === 'front') return 'Front endpapers'
  if (loc.kind === 'back') return 'The end'
  const s = spreads[loc.index]
  return `Spread ${s.id} of ${spreads.length}: ${s.title}`
}
