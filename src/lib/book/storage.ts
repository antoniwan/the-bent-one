import {
  locationFromPathname,
  locationToStep,
  pathForLocation,
  stepToLocation,
  type BookLocation,
} from './paths'
import { pages } from './spreads'

const STORAGE_KEY = 'the-bent-one:step'

export function saveStep(step: number) {
  try {
    localStorage.setItem(STORAGE_KEY, String(step))
  } catch {
    /* ignore quota / private mode */
  }
}

export function readResumeStep(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw == null) return 0
    const step = Number(raw)
    if (!Number.isFinite(step) || step < 0) return 0
    return Math.min(step, 2 + pages.length)
  } catch {
    return 0
  }
}

/** True when resume is past the cover (worth a Continue button). */
export function canResume(step: number): boolean {
  return step > 0
}

export function syncLocationFromUrl(): BookLocation {
  const loc = locationFromPathname(window.location.pathname)
  if (!loc) {
    window.history.replaceState(null, '', '/')
    return { kind: 'cover' }
  }
  const canonical = pathForLocation(loc)
  if (canonical !== (window.location.pathname.replace(/\/+$/, '') || '/')) {
    window.history.replaceState(null, '', canonical)
  }
  return loc
}

export function navigateTo(
  loc: BookLocation,
  opts: { replace?: boolean; direction?: 1 | -1 } = {},
): { location: BookLocation; direction: 1 | -1 } {
  const path = pathForLocation(loc)
  const current = locationFromPathname(window.location.pathname) ?? {
    kind: 'cover' as const,
  }
  const direction =
    opts.direction ??
    (locationToStep(loc) >= locationToStep(current) ? 1 : -1)

  if (opts.replace) {
    window.history.replaceState(null, '', path)
  } else if (path !== (window.location.pathname.replace(/\/+$/, '') || '/')) {
    window.history.pushState(null, '', path)
  }

  saveStep(locationToStep(loc))
  return { location: loc, direction }
}

export function goRelative(
  current: BookLocation,
  delta: number,
): BookLocation {
  return stepToLocation(locationToStep(current) + delta)
}
