import { pages } from './spreads'

export type BookLocation =
  | { kind: 'cover' }
  | { kind: 'front' }
  | { kind: 'page'; index: number }
  | { kind: 'back' }

export function locationToStep(loc: BookLocation): number {
  if (loc.kind === 'cover') return 0
  if (loc.kind === 'front') return 1
  if (loc.kind === 'page') return 2 + loc.index
  return 2 + pages.length // back
}

export function stepToLocation(step: number): BookLocation {
  const clamped = Math.min(Math.max(step, 0), 2 + pages.length)
  if (clamped === 0) return { kind: 'cover' }
  if (clamped === 1) return { kind: 'front' }
  if (clamped >= 2 + pages.length) return { kind: 'back' }
  return { kind: 'page', index: clamped - 2 }
}

export function pathForLocation(loc: BookLocation): string {
  if (loc.kind === 'cover') return '/'
  if (loc.kind === 'front') return '/front'
  if (loc.kind === 'back') return '/back'
  const page = pages[loc.index]
  return `/${page.id}/${page.slug}`
}

export function locationFromPathname(pathname: string): BookLocation | null {
  const clean = pathname.replace(/\/+$/, '') || '/'
  if (clean === '/') return { kind: 'cover' }
  if (clean === '/front') return { kind: 'front' }
  if (clean === '/back') return { kind: 'back' }

  const match = clean.match(/^\/(\d+)\/([a-z0-9-]+)$/)
  if (!match) return null
  const id = Number(match[1])
  const index = pages.findIndex((s) => s.id === id)
  if (index < 0) return null
  return { kind: 'page', index }
}

export function liveLabel(loc: BookLocation): string {
  if (loc.kind === 'cover') return 'Cover'
  if (loc.kind === 'front') return 'Before we begin'
  if (loc.kind === 'back') return 'The end'
  const s = pages[loc.index]
  return `Page ${s.id} of ${pages.length}: ${s.title}`
}
