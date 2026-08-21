import type { LineSpec } from '../lines/types'
import { BENT_PATH } from '../lines/types'
import {
  bentChord,
  bentTransform,
  edgeEnteringLines,
  fieldOfLines,
  mulberry32,
  straight,
} from '../lines/geometry'

export function bentLine(
  id: string,
  x: number,
  y: number,
  scale: number,
  rotate: number,
  opts: Partial<LineSpec> = {},
): { transform: string; line: LineSpec } {
  return {
    transform: bentTransform(x, y, scale, rotate),
    line: {
      id,
      d: BENT_PATH,
      color: 'bent',
      weight: opts.weight ?? 2.4,
      delay: opts.delay ?? 0.1,
      duration: opts.duration ?? 1.1,
      ...opts,
    },
  }
}

/** Bake transform into path via a wrapper group — consumers use groups. */
export type ScenePart =
  | { kind: 'lines'; lines: LineSpec[] }
  | { kind: 'bent'; transform: string; line: LineSpec }
  | { kind: 'group'; transform?: string; lines: LineSpec[]; className?: string }
  | { kind: 'fill'; d: string; fill: string; opacity?: number }
  | { kind: 'dots'; dots: Dot[]; animate?: boolean }
  | { kind: 'drift'; className: string; lines: LineSpec[] }

export interface Dot {
  id: string
  cx: number
  cy: number
  r: number
  color: 'ink' | 'bent' | 'decoy'
  delay?: number
}

function openSquare(
  x: number,
  y: number,
  size: number,
  gap = 8,
  id: string,
  delay = 0.3,
): LineSpec[] {
  const s = size
  return [
    { id: `${id}-t`, d: straight(x + gap, y, x + s - gap, y), weight: 1.8, delay },
    {
      id: `${id}-r`,
      d: straight(x + s, y + gap, x + s, y + s - gap),
      weight: 1.6,
      delay: delay + 0.05,
    },
    {
      id: `${id}-b`,
      d: straight(x + s - gap, y + s, x + gap, y + s),
      weight: 2,
      delay: delay + 0.1,
    },
    {
      id: `${id}-l`,
      d: straight(x, y + s - gap, x, y + gap),
      weight: 1.5,
      delay: delay + 0.15,
    },
  ]
}

function openCircle(
  cx: number,
  cy: number,
  r: number,
  segments: number,
  id: string,
  delay = 0.3,
): LineSpec[] {
  const lines: LineSpec[] = []
  for (let i = 0; i < segments; i++) {
    const a0 = (i / segments) * Math.PI * 2 - Math.PI / 2
    const a1 = ((i + 0.72) / segments) * Math.PI * 2 - Math.PI / 2
    lines.push({
      id: `${id}-${i}`,
      d: straight(
        cx + Math.cos(a0) * r,
        cy + Math.sin(a0) * r,
        cx + Math.cos(a1) * r,
        cy + Math.sin(a1) * r,
      ),
      weight: 1.4 + (i % 3) * 0.3,
      delay: delay + i * 0.04,
    })
  }
  return lines
}

function openHex(
  cx: number,
  cy: number,
  r: number,
  id: string,
  delay = 0.4,
): LineSpec[] {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as const
  })
  return pts.map(([x1, y1], i) => {
    const [x2, y2] = pts[(i + 1) % 6]
    // One line clearly in the wrong place (the joke)
    if (i === 3) {
      return {
        id: `${id}-${i}`,
        d: straight(x1, y1, x2 + 18, y2 - 22),
        weight: 2.2,
        delay: delay + i * 0.06,
      }
    }
    return {
      id: `${id}-${i}`,
      d: straight(x1 + (i === 0 ? 4 : 0), y1, x2 - (i === 5 ? 4 : 0), y2),
      weight: 1.5 + (i % 2) * 0.5,
      delay: delay + i * 0.06,
    }
  })
}

/** Three sides that meet at the corners. */
function closedTriangle(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  cx: number,
  cy: number,
  id: string,
  delay = 0.3,
  weight = 1.6,
  opacity = 1,
): LineSpec[] {
  return [
    {
      id: `${id}-ab`,
      d: straight(ax, ay, bx, by),
      weight,
      delay,
      opacity,
    },
    {
      id: `${id}-bc`,
      d: straight(bx, by, cx, cy),
      weight: weight * 0.95,
      delay: delay + 0.04,
      opacity,
    },
    {
      id: `${id}-ca`,
      d: straight(cx, cy, ax, ay),
      weight: weight * 0.9,
      delay: delay + 0.08,
      opacity,
    },
  ]
}

/**
 * Almost a triangle: corners don't quite meet, or one side stops short.
 * mode 0 = gap at each corner, 1 = missing tip, 2 = third side too short
 */
function almostTriangle(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  cx: number,
  cy: number,
  id: string,
  delay = 0.3,
  mode = 0,
  weight = 1.4,
  opacity = 0.85,
): LineSpec[] {
  const lerp = (x1: number, y1: number, x2: number, y2: number, t: number) =>
    [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t] as const

  if (mode === 1) {
    // two sides only — an open V
    return [
      {
        id: `${id}-a`,
        d: straight(ax, ay, cx, cy),
        weight,
        delay,
        opacity,
      },
      {
        id: `${id}-b`,
        d: straight(bx, by, cx, cy),
        weight: weight * 0.95,
        delay: delay + 0.05,
        opacity,
      },
    ]
  }

  if (mode === 2) {
    const [mx, my] = lerp(cx, cy, ax, ay, 0.72)
    return [
      {
        id: `${id}-ab`,
        d: straight(ax, ay, bx, by),
        weight,
        delay,
        opacity,
      },
      {
        id: `${id}-bc`,
        d: straight(bx, by, cx, cy),
        weight,
        delay: delay + 0.04,
        opacity,
      },
      {
        id: `${id}-ca`,
        d: straight(cx, cy, mx, my),
        weight: weight * 0.9,
        delay: delay + 0.08,
        opacity,
      },
    ]
  }

  // mode 0: each side stops short of the corners (open joints)
  const [ab1x, ab1y] = lerp(ax, ay, bx, by, 0.08)
  const [ab2x, ab2y] = lerp(ax, ay, bx, by, 0.92)
  const [bc1x, bc1y] = lerp(bx, by, cx, cy, 0.08)
  const [bc2x, bc2y] = lerp(bx, by, cx, cy, 0.92)
  const [ca1x, ca1y] = lerp(cx, cy, ax, ay, 0.08)
  const [ca2x, ca2y] = lerp(cx, cy, ax, ay, 0.92)
  return [
    {
      id: `${id}-ab`,
      d: straight(ab1x, ab1y, ab2x, ab2y),
      weight,
      delay,
      opacity,
    },
    {
      id: `${id}-bc`,
      d: straight(bc1x, bc1y, bc2x, bc2y),
      weight,
      delay: delay + 0.04,
      opacity,
    },
    {
      id: `${id}-ca`,
      d: straight(ca1x, ca1y, ca2x, ca2y),
      weight,
      delay: delay + 0.08,
      opacity,
    },
  ]
}

function house(
  x: number,
  y: number,
  w: number,
  h: number,
  id: string,
  opts: { roofBent?: boolean; lit?: boolean; delay?: number } = {},
): ScenePart[] {
  const { roofBent = false, lit = false, delay = 0.2 } = opts
  const parts: ScenePart[] = []
  const body: LineSpec[] = [
    { id: `${id}-fl`, d: straight(x, y + h, x, y), weight: 2.2, delay },
    {
      id: `${id}-fr`,
      d: straight(x + w, y + h, x + w, y),
      weight: 2,
      delay: delay + 0.05,
    },
    {
      id: `${id}-fb`,
      d: straight(x, y + h, x + w, y + h),
      weight: 2.4,
      delay: delay + 0.1,
    },
    // eaves
    {
      id: `${id}-eave`,
      d: straight(x - 4, y, x + w + 4, y),
      weight: 1.6,
      delay: delay + 0.12,
    },
  ]
  // window
  const wx = x + w * 0.35
  const wy = y + h * 0.35
  const ws = w * 0.28
  body.push(
    ...openSquare(wx, wy, ws, 3, `${id}-win`, delay + 0.2).map((l) => ({
      ...l,
      weight: 1.2,
    })),
  )
  if (lit) {
    parts.push({
      kind: 'fill',
      d: `M ${wx + 3} ${wy + 3} H ${wx + ws - 3} V ${wy + ws - 3} H ${wx + 3} Z`,
      fill: 'var(--window-glow)',
      opacity: 0.55,
    })
  }
  parts.push({ kind: 'lines', lines: body })

  if (roofBent) {
    const b = bentLine(`${id}-roof`, x - 2, y, (w + 4) / 100, -18, {
      weight: 2.6,
      delay: delay + 0.25,
    })
    // Adjust: bent path along ridge — use two roof sides + bent ridge
    parts.push({
      kind: 'lines',
      lines: [
        {
          id: `${id}-rl`,
          d: straight(x - 8, y, x + w / 2, y - h * 0.55),
          weight: 2,
          delay: delay + 0.2,
        },
        {
          id: `${id}-rr`,
          d: straight(x + w + 8, y, x + w / 2, y - h * 0.55),
          weight: 1.8,
          delay: delay + 0.22,
        },
      ],
    })
    parts.push({
      kind: 'bent',
      transform: bentTransform(x + 6, y - h * 0.28, (w * 0.88) / 100, -8),
      line: { ...b.line, weight: 2.8 },
    })
  } else {
    parts.push({
      kind: 'lines',
      lines: [
        {
          id: `${id}-rl`,
          d: straight(x - 8, y, x + w / 2, y - h * 0.55),
          weight: 2,
          delay: delay + 0.2,
        },
        {
          id: `${id}-rr`,
          d: straight(x + w + 8, y, x + w / 2, y - h * 0.55),
          weight: 1.8,
          delay: delay + 0.22,
        },
        {
          id: `${id}-ridge`,
          d: straight(x + 4, y - 2, x + w - 4, y - 2),
          weight: 1.5,
          delay: delay + 0.24,
        },
      ],
    })
  }
  return parts
}

/** Page 6–7 shared world. `colored` adds the quiet surprise of ochre / water. */
function stackingWorld(
  seed: number,
  mood: 'plain' | 'colored' = 'plain',
  opts: { roofNeighborGone?: boolean } = {},
): ScenePart[] {
  const rand = mulberry32(seed)
  const parts: ScenePart[] = []
  const groundY = 820
  const colored = mood === 'colored'
  const roofNeighborGone = opts.roofNeighborGone === true
  let delay = 0.06

  const pushLines = (lines: LineSpec[]) => {
    parts.push({ kind: 'lines', lines })
  }

  const littleBoat = (
    x: number,
    waterY: number,
    scale: number,
    id: string,
    d0: number,
    sailColor: LineSpec['color'] = 'ink',
  ): LineSpec[] => {
    const s = scale
    const deckY = waterY - 2 * s
    const keelY = waterY + 14 * s
    const stern = x
    const bow = x + 88 * s
    const mastX = x + 34 * s
    const mastTop = deckY - 68 * s
    // Cup hull with a lifted bow — reads as a boat at a glance
    return [
      {
        id: `${id}-hull`,
        d: `M ${stern} ${deckY} L ${stern + 8 * s} ${keelY} L ${bow - 16 * s} ${keelY} L ${bow} ${deckY - 10 * s}`,
        weight: 2.2 * Math.min(s, 1.15),
        delay: d0,
      },
      {
        id: `${id}-deck`,
        d: straight(stern, deckY, bow - 6 * s, deckY),
        weight: 1.5,
        delay: d0 + 0.04,
        opacity: 0.75,
      },
      {
        id: `${id}-mast`,
        d: straight(mastX, deckY, mastX, mastTop),
        weight: 1.55,
        delay: d0 + 0.06,
      },
      {
        id: `${id}-sail-a`,
        d: straight(mastX, mastTop + 2 * s, mastX, deckY - 10 * s),
        weight: 1.35,
        delay: d0 + 0.08,
        color: sailColor,
      },
      {
        id: `${id}-sail-b`,
        d: straight(mastX, mastTop + 2 * s, mastX + 40 * s, deckY - 16 * s),
        weight: 1.7,
        delay: d0 + 0.1,
        color: sailColor,
      },
      {
        id: `${id}-sail-c`,
        d: straight(mastX, deckY - 10 * s, mastX + 40 * s, deckY - 16 * s),
        weight: 1.4,
        delay: d0 + 0.12,
        color: sailColor,
      },
    ]
  }

  // Color arrives behind the line-work (page 7)
  if (colored) {
    parts.push(
      {
        kind: 'fill',
        d: 'M 88 86 H 152 V 150 H 88 Z',
        fill: 'var(--window-glow)',
        opacity: 0.22,
      },
      {
        kind: 'fill',
        d: 'M 210 560 H 300 V 700 H 210 Z',
        fill: 'var(--line-ochre)',
        opacity: 0.38,
      },
      {
        kind: 'fill',
        d: 'M 455 500 H 520 V 640 H 455 Z',
        fill: 'var(--line-ochre)',
        opacity: 0.3,
      },
      {
        kind: 'fill',
        d: 'M 700 545 H 790 V 700 H 700 Z',
        fill: 'var(--line-ochre)',
        opacity: 0.34,
      },
    )
  }

  // Soft sun — one calm circle with short rays (not a fireworks burst)
  {
    const sx = 118
    const sy = 128
    const r = 42
    const sunLines = openCircle(sx, sy, r, 10, 'sun', delay).map((l) =>
      colored ? { ...l, color: 'ochre' as const, opacity: 0.9 } : l,
    )
    for (let i = 0; i < 9; i++) {
      const a = -Math.PI * 0.15 + (i / 8) * Math.PI * 1.15
      const x1 = sx + Math.cos(a) * (r + 10)
      const y1 = sy + Math.sin(a) * (r + 10)
      const x2 = sx + Math.cos(a) * (r + 22 + (i % 2) * 6)
      const y2 = sy + Math.sin(a) * (r + 22 + (i % 2) * 6)
      sunLines.push({
        id: `sun-ray-${i}`,
        d: straight(x1, y1, x2, y2),
        weight: 1.15,
        delay: delay + 0.2 + i * 0.02,
        opacity: 0.7,
        color: colored ? 'ochre' : 'ink',
      })
    }
    pushLines(sunLines)
    delay += 0.15
  }

  // Far ridge — triangles becoming mountains (quiet, light)
  const farBase = 520
  const farPeaks: { x: number; y: number; w: number }[] = [
    { x: -40, y: farBase, w: 280 },
    { x: 180, y: farBase + 10, w: 340 },
    { x: 420, y: farBase - 20, w: 300 },
    { x: 640, y: farBase + 8, w: 320 },
    { x: 860, y: farBase + 18, w: 220 },
  ]
  const mountainLines: LineSpec[] = []
  farPeaks.forEach((p, i) => {
    const peakX = p.x + p.w * (0.38 + rand() * 0.2)
    const peakY = p.y - (110 + rand() * 70)
    mountainLines.push(
      ...closedTriangle(
        p.x,
        p.y,
        p.x + p.w,
        p.y + 8,
        peakX,
        peakY,
        `mtn-far-${i}`,
        delay + i * 0.04,
        1.35,
        0.38,
      ),
    )
    for (let s = 0; s < 3; s++) {
      const t = 0.15 + s * 0.12
      const ax = peakX + (p.x - peakX) * t
      const ay = peakY + (p.y - peakY) * t
      mountainLines.push({
        id: `snow-l-${i}-${s}`,
        d: straight(ax - 6, ay + 2, ax + 10, ay + 8),
        weight: 1,
        delay: delay + 0.25 + i * 0.03 + s * 0.02,
        opacity: 0.45,
      })
    }
  })
  pushLines(mountainLines)
  delay += 0.2

  // Mid hills — houses tucked into the slope
  const midBase = 610
  const midPeaks = [
    { x: 40, w: 260, h: 95 },
    { x: 260, w: 300, h: 130 },
    { x: 520, w: 280, h: 110 },
    { x: 760, w: 240, h: 90 },
  ]
  midPeaks.forEach((p, i) => {
    const peakX = p.x + p.w * 0.45
    const peakY = midBase - p.h
    pushLines(
      closedTriangle(
        p.x,
        midBase,
        p.x + p.w,
        midBase + 6,
        peakX,
        peakY,
        `mtn-mid-${i}`,
        delay + i * 0.05,
        1.7,
        0.55,
      ),
    )
    const hx = p.x + p.w * 0.22
    const hy = midBase - 28 - (i % 2) * 8
    const hw = 28 + (i % 3) * 4
    const hh = 22
    parts.push(
      ...house(hx, hy, hw, hh, `slope-h-${i}`, {
        lit: i % 2 === 0,
        delay: delay + 0.2 + i * 0.06,
      }),
    )
  })
  delay += 0.25

  const tree = (
    x: number,
    base: number,
    scale: number,
    id: string,
    d0: number,
  ): LineSpec[] => {
    const trunkH = 18 * scale
    const tw = 22 * scale
    const th = 34 * scale
    return [
      {
        id: `${id}-trunk`,
        d: straight(x, base, x, base - trunkH),
        weight: 1.4 * scale,
        delay: d0,
        opacity: 0.85,
      },
      ...closedTriangle(
        x - tw,
        base - trunkH + 4,
        x + tw,
        base - trunkH + 4,
        x,
        base - trunkH - th,
        `${id}-crown`,
        d0 + 0.04,
        1.5 * Math.min(scale, 1.2),
        0.8,
      ),
    ]
  }

  pushLines([
    ...tree(70, midBase + 4, 0.85, 'tree-a', delay),
    ...tree(115, midBase + 2, 1.05, 'tree-b', delay + 0.05),
    ...tree(900, midBase, 0.9, 'tree-c', delay + 0.08),
  ])
  delay += 0.15

  const bands: {
    y: number
    count: number
    scale: number
    startX: number
    step: number
  }[] = [
    { y: groundY - 210, count: 6, scale: 0.72, startX: 90, step: 130 },
    { y: groundY - 140, count: 7, scale: 0.88, startX: 40, step: 125 },
    { y: groundY - 70, count: 8, scale: 1, startX: 20, step: 118 },
  ]

  const bentBand = 1
  const bentSlot = 4

  bands.forEach((band, bi) => {
    for (let i = 0; i < band.count; i++) {
      const isBent = bi === bentBand && i === bentSlot
      const hw = (48 + rand() * 28) * band.scale
      const hh = (40 + rand() * 32) * band.scale
      const hx = band.startX + i * band.step + rand() * 12
      const hy = band.y - hh + rand() * 10

      if (isBent) {
        const eavesY = hy
        const left = hx - 4
        const right = hx + hw + 4
        const peakX = hx + hw * 0.48
        const peakY = eavesY - hh * 0.55
        const wx = hx + hw * 0.36
        const wy = eavesY + hh * 0.32
        const ws = hw * 0.26
        parts.push({
          kind: 'fill',
          d: `M ${wx + 2} ${wy + 2} H ${wx + ws - 2} V ${wy + ws - 2} H ${wx + 2} Z`,
          fill: 'var(--window-glow)',
          opacity: 0.55,
        })
        pushLines([
          {
            id: 'bent-house-l',
            d: straight(hx, hy + hh, hx, eavesY),
            weight: 2.2,
            delay: delay + 0.3,
          },
          {
            id: 'bent-house-r',
            d: straight(hx + hw, hy + hh, hx + hw, eavesY),
            weight: 2,
            delay: delay + 0.32,
          },
          {
            id: 'bent-house-b',
            d: straight(hx, hy + hh, hx + hw, hy + hh),
            weight: 2.3,
            delay: delay + 0.34,
          },
          ...openSquare(wx, wy, ws, 3, 'bent-house-win', delay + 0.36).map(
            (l) => ({ ...l, weight: 1.15 }),
          ),
          // Continuity: after page 8 the straight neighbor is gone
          ...(roofNeighborGone
            ? [
                {
                  id: 'roof-gap-peak',
                  d: straight(peakX, peakY, peakX - 14, peakY + 16),
                  weight: 1.4,
                  delay: delay + 0.38,
                  opacity: 0.4,
                  dashed: true,
                  dashPattern: '3 6',
                },
                {
                  id: 'roof-gap-eave',
                  d: straight(left, eavesY, left + 16, eavesY - 6),
                  weight: 1.35,
                  delay: delay + 0.4,
                  opacity: 0.4,
                  dashed: true,
                  dashPattern: '3 6',
                },
              ]
            : [
                {
                  id: 'bent-roof-l',
                  d: straight(left, eavesY, peakX, peakY),
                  weight: 2.1,
                  delay: delay + 0.38,
                },
              ]),
          {
            id: 'the-one',
            d: bentChord(peakX, peakY, right, eavesY, 0.12),
            color: 'bent',
            weight: 2.7,
            delay: delay + 0.42,
            duration: 1.2,
          },
        ])
        continue
      }

      parts.push(
        ...house(hx, hy, hw, hh, `town-${bi}-${i}`, {
          lit: rand() > 0.45,
          delay: delay + bi * 0.08 + i * 0.035,
        }),
      )
    }
  })
  delay += 0.45

  // On the colored page: a few thin joins between nearby corners — trying things out
  if (colored) {
    const joins: LineSpec[] = [
      {
        id: 'join-a',
        d: straight(250, groundY - 175, 310, groundY - 160),
        weight: 1.1,
        delay: delay,
        opacity: 0.55,
        color: 'ochre',
      },
      {
        id: 'join-b',
        d: straight(480, groundY - 200, 530, groundY - 155),
        weight: 1.05,
        delay: delay + 0.04,
        opacity: 0.5,
        color: 'water',
      },
      {
        id: 'join-c',
        d: straight(640, groundY - 120, 700, groundY - 145),
        weight: 1.15,
        delay: delay + 0.08,
        opacity: 0.55,
        color: 'ochre',
      },
    ]
    pushLines(joins)
  }

  pushLines([
    ...tree(310, groundY, 1.15, 'tree-d', delay),
    ...tree(780, groundY - 2, 1.0, 'tree-e', delay + 0.06),
  ])

  ;[
    { cx: 160, cy: groundY - 22, r: 20 },
    { cx: 205, cy: groundY - 20, r: 16 },
    { cx: 620, cy: groundY - 24, r: 22 },
  ].forEach((w, i) => {
    pushLines([
      ...openCircle(w.cx, w.cy, w.r, 7, `wheel-${i}`, delay + 0.1 + i * 0.04),
      {
        id: `spoke-h-${i}`,
        d: straight(w.cx - w.r * 0.65, w.cy, w.cx + w.r * 0.65, w.cy),
        weight: 1.1,
        delay: delay + 0.15 + i * 0.04,
      },
      {
        id: `spoke-v-${i}`,
        d: straight(w.cx, w.cy - w.r * 0.65, w.cx, w.cy + w.r * 0.65),
        weight: 1.1,
        delay: delay + 0.17 + i * 0.04,
      },
    ])
  })

  // Boats — on page 7 they sit in the sea below the town
  if (colored) {
    const shoreY = 878
    // Layered sea from the bottom edge of the picture up to a clear shore
    parts.unshift(
      {
        kind: 'fill',
        d: `M 0 1000 L 0 ${shoreY + 55} Q 160 ${shoreY + 38} 320 ${shoreY + 58} T 640 ${shoreY + 42} T 1000 ${shoreY + 62} L 1000 1000 Z`,
        fill: 'var(--line-water)',
        opacity: 0.38,
      },
      {
        kind: 'fill',
        d: `M 0 1000 L 0 ${shoreY + 28} Q 120 ${shoreY + 12} 280 ${shoreY + 32} T 560 ${shoreY + 18} T 820 ${shoreY + 34} T 1000 ${shoreY + 22} L 1000 1000 Z`,
        fill: 'var(--line-water)',
        opacity: 0.22,
      },
      {
        kind: 'fill',
        d: `M 0 1000 L 0 ${shoreY + 6} Q 90 ${shoreY - 8} 220 ${shoreY + 10} T 480 ${shoreY - 2} T 740 ${shoreY + 12} T 1000 ${shoreY + 4} L 1000 1000 Z`,
        fill: 'var(--line-water)',
        opacity: 0.14,
      },
    )

    const seaLines: LineSpec[] = [
      // shore lip — separates city from sea
      {
        id: 'shore',
        d: `M 0 ${shoreY} Q 140 ${shoreY - 10} 300 ${shoreY + 4} T 620 ${shoreY - 6} T 1000 ${shoreY + 2}`,
        weight: 1.6,
        delay: delay + 0.15,
        color: 'water',
        opacity: 0.75,
      },
    ]
    const waveBands = [
      { y: shoreY + 22, amp: 7, step: 70, w: 1.15, o: 0.55 },
      { y: shoreY + 42, amp: 9, step: 85, w: 1.25, o: 0.5 },
      { y: shoreY + 64, amp: 11, step: 95, w: 1.35, o: 0.45 },
      { y: shoreY + 88, amp: 8, step: 110, w: 1.1, o: 0.4 },
      { y: shoreY + 112, amp: 10, step: 78, w: 1.2, o: 0.35 },
    ]
    waveBands.forEach((band, bi) => {
      let d = `M 0 ${band.y}`
      for (let x = 0; x <= 1000; x += band.step) {
        const peak = band.y - band.amp * (bi % 2 === 0 ? 1 : 0.7)
        const trough = band.y + band.amp * 0.55
        d += ` Q ${x + band.step * 0.35} ${peak} ${x + band.step * 0.55} ${band.y}`
        d += ` Q ${x + band.step * 0.75} ${trough} ${Math.min(1000, x + band.step)} ${band.y}`
      }
      seaLines.push({
        id: `wave-${bi}`,
        d,
        weight: band.w,
        delay: delay + 0.2 + bi * 0.04,
        color: 'water',
        opacity: band.o,
      })
    })
    // a few short chop marks for denser line-work near the bottom
    for (let i = 0; i < 9; i++) {
      const x = 40 + i * 110 + (i % 3) * 12
      const y = shoreY + 70 + (i % 4) * 18
      seaLines.push({
        id: `chop-${i}`,
        d: straight(x, y, x + 28 + (i % 2) * 10, y - 3 + (i % 3)),
        weight: 0.95,
        delay: delay + 0.35 + i * 0.02,
        color: 'water',
        opacity: 0.4,
      })
    }
    pushLines(seaLines)

    pushLines([
      ...littleBoat(70, shoreY + 28, 0.95, 'boat-a', delay + 0.25, 'water'),
      ...littleBoat(210, shoreY + 40, 0.7, 'boat-b', delay + 0.32, 'ochre'),
      ...littleBoat(820, shoreY + 34, 0.8, 'boat-c', delay + 0.38, 'water'),
    ])
  } else {
    pushLines([
      ...littleBoat(48, groundY - 6, 1, 'boat-a', delay + 0.2, 'ink'),
      ...littleBoat(155, groundY - 2, 0.72, 'boat-b', delay + 0.28, 'ink'),
    ])
  }

  pushLines(
    closedTriangle(820, 160, 848, 178, 828, 148, 'beak', delay + 0.35, 1.25, 0.55),
  )

  pushLines([
    {
      id: 'ground',
      d: straight(10, groundY, 990, groundY),
      weight: 2.8,
      delay: 0.04,
    },
    {
      id: 'road',
      d: straight(10, groundY + 18, 990, groundY + 18),
      weight: 1.4,
      delay: 0.08,
      opacity: 0.35,
    },
  ])

  for (let i = 0; i < 5; i++) {
    const wx = 130 + i * 155 + rand() * 20
    const wy = groundY - 250 - rand() * 40
    const ws = 16 + rand() * 8
    if (rand() > 0.5) {
      parts.push({
        kind: 'fill',
        d: `M ${wx + 2} ${wy + 2} H ${wx + ws - 2} V ${wy + ws - 2} H ${wx + 2} Z`,
        fill: colored ? 'var(--line-ochre)' : 'var(--window-glow)',
        opacity: colored ? 0.4 : 0.35,
      })
    }
    pushLines(
      openSquare(wx, wy, ws, 2, `stack-win-${i}`, delay + 0.4 + i * 0.03).map(
        (l) => ({
          ...l,
          weight: 1.05,
          opacity: 0.75,
          color: colored && i % 2 === 0 ? ('ochre' as const) : l.color,
        }),
      ),
    )
  }

  // Page 7: crooked little birds — same silhouette as ours, never red
  if (colored) {
    const birdColors: LineSpec['color'][] = ['ochre', 'water', 'ink', 'ochre', 'water']
    const flock: { x: number; y: number; scale: number; rot: number; cls: string }[] = [
      { x: 70, y: 210, scale: 0.42, rot: -8, cls: 'bird-fly bird-a' },
      { x: 200, y: 165, scale: 0.32, rot: 6, cls: 'bird-fly bird-b' },
      { x: 340, y: 195, scale: 0.38, rot: -14, cls: 'bird-fly bird-c' },
      { x: 720, y: 140, scale: 0.36, rot: 10, cls: 'bird-fly bird-d' },
      { x: 860, y: 200, scale: 0.3, rot: -4, cls: 'bird-fly bird-e' },
    ]
    flock.forEach((b, i) => {
      parts.push({
        kind: 'group',
        className: b.cls,
        transform: bentTransform(b.x, b.y, b.scale, b.rot),
        lines: [
          {
            id: `bird-${i}`,
            d: BENT_PATH,
            color: birdColors[i],
            weight: 2.1,
            delay: 0.55 + i * 0.08,
            duration: 0.9,
            opacity: 0.9,
          },
        ],
      })
    })
  }

  return parts
}

/**
 * Page 9 — the colored town, but lines remember they can choose.
 * Dashed ghosts + jitter: free will before the explosion.
 */
function unravelTown(seed: number): ScenePart[] {
  const rand = mulberry32(seed + 77)
  const base = stackingWorld(seed, 'colored', { roofNeighborGone: true })
  let jitterSlot = 0

  const soften = (line: LineSpec): LineSpec => {
    // Ours holds; roof-gap stubs stay readable as “missing neighbor”
    if (
      line.id === 'the-one' ||
      line.color === 'bent' ||
      line.id.startsWith('roof-gap-')
    ) {
      return line
    }
    if (rand() > 0.48) {
      return {
        ...line,
        dashed: true,
        dashPattern: rand() > 0.5 ? '3 7' : '2 5',
        opacity: Math.min(0.55, (line.opacity ?? 1) * (0.22 + rand() * 0.35)),
        weight: Math.max(0.8, (line.weight ?? 2) * 0.85),
      }
    }
    if (rand() > 0.7) {
      return {
        ...line,
        opacity: (line.opacity ?? 1) * (0.45 + rand() * 0.3),
      }
    }
    return line
  }

  const out: ScenePart[] = base.map((part) => {
    if (part.kind === 'fill') {
      return { ...part, opacity: (part.opacity ?? 1) * 0.82 }
    }
    if (part.kind === 'lines') {
      const slot = jitterSlot++ % 5
      return {
        kind: 'group' as const,
        className: `unravel-jitter unravel-${slot}`,
        lines: part.lines.map(soften),
      }
    }
    if (part.kind === 'group') {
      const slot = jitterSlot++ % 5
      const keepBird = part.className?.includes('bird-fly')
      return {
        ...part,
        className: keepBird
          ? part.className
          : `${part.className ?? ''} unravel-jitter unravel-${slot}`.trim(),
        lines: part.lines.map(soften),
      }
    }
    return part
  })

  const ghosts: LineSpec[] = []
  for (let i = 0; i < 14; i++) {
    const x = 40 + rand() * 900
    const y = 80 + rand() * 700
    const len = 30 + rand() * 90
    const a = rand() * Math.PI * 2
    ghosts.push({
      id: `ghost-${i}`,
      d: straight(x, y, x + Math.cos(a) * len, y + Math.sin(a) * len),
      weight: 1 + rand() * 1.2,
      delay: 0.2 + i * 0.03,
      dashed: true,
      dashPattern: '3 8',
      opacity: 0.2 + rand() * 0.25,
      animate: false,
    })
  }
  ghosts.push(
    {
      id: 'ghost-arc-a',
      d: 'M 100 300 Q 200 380 160 500',
      weight: 1.1,
      delay: 0.3,
      dashed: true,
      dashPattern: '3 7',
      opacity: 0.32,
      animate: false,
    },
    {
      id: 'ghost-arc-b',
      d: 'M 700 200 Q 820 280 880 420',
      weight: 1,
      delay: 0.35,
      dashed: true,
      dashPattern: '2 6',
      opacity: 0.28,
      animate: false,
    },
    {
      id: 'ghost-arc-c',
      d: 'M 350 650 Q 480 720 620 680',
      weight: 1.2,
      delay: 0.4,
      dashed: true,
      dashPattern: '4 6',
      opacity: 0.3,
      animate: false,
    },
  )

  out.push({
    kind: 'group',
    className: 'unravel-jitter unravel-ghost',
    lines: ghosts,
  })

  return out
}

export function sceneForSpread(id: number): ScenePart[] {
  switch (id) {
    case 1:
      return [
        {
          kind: 'bent',
          transform: bentTransform(620, 380, 1.1, -6),
          line: {
            id: 'the-one',
            d: BENT_PATH,
            color: 'bent',
            weight: 2.2,
            delay: 0.35,
            duration: 1.4,
          },
        },
      ]

    case 2:
      return [
        {
          kind: 'lines',
          lines: edgeEnteringLines(42, 22),
        },
        {
          kind: 'bent',
          transform: bentTransform(480, 520, 1.05, 4),
          line: {
            id: 'the-one',
            d: BENT_PATH,
            color: 'bent',
            weight: 2.4,
            delay: 0.05,
            duration: 1.2,
          },
        },
      ]

    case 3: {
      // Hero triangle: three corners meet. Bent red side is a full chord A→C.
      const ax = 378
      const ay = 655
      const bx = 622
      const by = 655
      const cx = 500
      const cy = 348

      // Bulge outward (away from B) so the kink reads clearly but the side stays whole
      const midX = (ax + cx) / 2
      const midY = (ay + cy) / 2
      const toBx = bx - midX
      const toBy = by - midY
      const dx = cx - ax
      const dy = cy - ay
      const len = Math.hypot(dx, dy) || 1
      const leftNx = -dy / len
      const leftNy = dx / len
      const towardB = leftNx * toBx + leftNy * toBy
      const bulge = towardB > 0 ? -0.09 : 0.09

      const ink: LineSpec[] = [
        // closed companions (stay on the page)
        ...closedTriangle(120, 220, 210, 220, 165, 150, 't1', 0.35, 1.3, 0.7),
        ...closedTriangle(780, 520, 900, 560, 820, 430, 't3', 0.45, 1.4, 0.7),
        ...closedTriangle(90, 520, 200, 580, 70, 620, 't4', 0.5, 1.2, 0.6),
        ...closedTriangle(560, 780, 680, 800, 620, 700, 't5', 0.55, 1.35, 0.65),
        // almost-triangles still on the paper
        ...almostTriangle(840, 300, 940, 320, 900, 220, 'a2', 0.42, 1, 1.3, 0.5),
        ...almostTriangle(40, 340, 140, 360, 90, 260, 'a3', 0.48, 2, 1.25, 0.55),
        ...almostTriangle(640, 600, 760, 640, 700, 520, 'a4', 0.52, 0, 1.2, 0.5),
        ...almostTriangle(200, 760, 320, 790, 240, 680, 'a5', 0.58, 1, 1.15, 0.45),
        // leftover company from earlier pages
        ...fieldOfLines(
          31,
          12,
          { x: 40, y: 80, w: 920, h: 860 },
          {
            lenMin: 28,
            lenMax: 75,
            delayBase: 0.65,
            delayStep: 0.025,
            idPrefix: 'watch',
            weightMin: 0.9,
            weightMax: 2.2,
          },
        ).map((l) => ({ ...l, opacity: (l.opacity ?? 1) * 0.55 })),
        // hero base + right — meet at A, B, C
        {
          id: 'main-base',
          d: straight(ax, ay, bx, by),
          weight: 2.5,
          delay: 0.2,
        },
        {
          id: 'main-right',
          d: straight(bx, by, cx, cy),
          weight: 2.3,
          delay: 0.28,
        },
        // full bent side — exact endpoints on A and C
        {
          id: 'the-one',
          d: bentChord(ax, ay, cx, cy, bulge),
          color: 'bent',
          weight: 2.8,
          delay: 0.1,
          duration: 1.35,
        },
        // one quiet square + one quiet circle (less visible)
        ...openSquare(70, 740, 55, 6, 'ghost-sq', 0.7).map((l) => ({
          ...l,
          opacity: 0.28,
          weight: 1.1,
        })),
        ...openCircle(880, 720, 38, 9, 'ghost-cir', 0.75).map((l) => ({
          ...l,
          opacity: 0.26,
          weight: 1,
        })),
      ]

      return [{ kind: 'lines', lines: ink }]
    }

    case 4: {
      const parts: ScenePart[] = [
        { kind: 'lines', lines: openSquare(120, 200, 90, 10, 'sq1', 0.2) },
        { kind: 'lines', lines: openSquare(700, 520, 110, 12, 'sq2', 0.35) },
        { kind: 'lines', lines: openSquare(280, 620, 70, 8, 'sq3', 0.45) },
        { kind: 'lines', lines: openCircle(780, 280, 55, 10, 'cir1', 0.25) },
        { kind: 'lines', lines: openCircle(180, 480, 40, 8, 'cir2', 0.4) },
        { kind: 'lines', lines: openHex(520, 700, 70, 'hex', 0.5) },
        {
          kind: 'lines',
          lines: openSquare(560, 200, 60, 7, 'sq4', 0.55),
        },
        // bent triangle upper third
        {
          kind: 'lines',
          lines: [
            {
              id: 'bt-base',
              d: straight(340, 300, 460, 300),
              weight: 1.8,
              delay: 0.3,
            },
            {
              id: 'bt-right',
              d: straight(460, 300, 410, 200),
              weight: 1.6,
              delay: 0.35,
            },
          ],
        },
        {
          kind: 'bent',
          transform: bentTransform(348, 295, 1.15, -52),
          line: {
            id: 'the-one',
            d: BENT_PATH,
            color: 'bent',
            weight: 2.4,
            delay: 0.2,
            duration: 1.1,
          },
        },
      ]

      // Shapes slipping out the top — toward the header, away from the words below
      const fleeFast: LineSpec[] = [
        ...openSquare(720, -40, 70, 8, 'flee-sq', 0.35).map((l) => ({
          ...l,
          opacity: 0.7,
        })),
        ...openCircle(480, -20, 42, 8, 'flee-cir', 0.4).map((l) => ({
          ...l,
          opacity: 0.65,
        })),
        ...almostTriangle(600, 25, 690, 35, 640, -55, 'flee-tri', 0.45, 1, 1.2, 0.6),
        // the header rule itself, absconding — same hairline as .top border
        {
          id: 'flee-header-rule',
          d: straight(-40, -50, 1040, -50),
          weight: 1,
          delay: 0.3,
          opacity: 1,
          animate: false,
          className: 'flee-header-rule',
        },
        {
          id: 'flee-seg-1',
          d: straight(560, -5, 605, -80),
          weight: 1.5,
          delay: 0.55,
          opacity: 0.55,
        },
      ]

      const fleeSlow: LineSpec[] = [
        ...openHex(160, -10, 48, 'flee-hex', 0.4).map((l) => ({
          ...l,
          opacity: 0.6,
        })),
        ...openSquare(40, -35, 55, 6, 'flee-sq2', 0.5).map((l) => ({
          ...l,
          opacity: 0.55,
        })),
        {
          id: 'flee-seg-2',
          d: straight(300, 10, 345, -65),
          weight: 1.35,
          delay: 0.6,
          opacity: 0.5,
        },
      ]

      return [
        ...parts,
        { kind: 'group', className: 'flee-up', lines: fleeFast },
        { kind: 'group', className: 'flee-up-slow', lines: fleeSlow },
      ]
    }

    case 5: {
      // Ground + square house. Roof = inverted V; bent red is one pitch.
      const groundY = 780
      const x = 360
      const w = 260
      const wallH = 200
      const eavesY = groundY - wallH
      const leftEaveX = x - 18
      const rightEaveX = x + w + 18
      const peakX = x + w * 0.48
      const peakY = eavesY - 150

      const leftRoof = straight(leftEaveX, eavesY, peakX, peakY)
      const rightRoof = bentChord(peakX, peakY, rightEaveX, eavesY, 0.14)

      const wx = x + w * 0.4
      const wy = eavesY + wallH * 0.26
      const ws = w * 0.26
      const doorW = w * 0.2
      const doorH = wallH * 0.4
      const doorX = x + w * 0.16
      const doorY = groundY - doorH

      const rain = (id: string, x0: number, y0: number, scale = 1): LineSpec => ({
        id,
        d: straight(x0, y0, x0 + 16 * scale, y0 + 36 * scale),
        weight: 1.05,
        opacity: 0.38,
        animate: false,
        className: 'rain-drop',
      })

      const rainField: LineSpec[] = []
      let n = 0
      for (let col = 0; col < 14; col++) {
        for (let row = 0; row < 5; row++) {
          const x0 = 40 + col * 70 + (row % 2) * 18
          const y0 = 30 + row * 55 + (col % 3) * 8
          rainField.push(rain(`rain-${n++}`, x0, y0, 0.85 + (n % 3) * 0.1))
        }
      }

      const hitT = [0.28, 0.45, 0.62, 0.78]
      const deflect: LineSpec[] = hitT.map((t, i) => {
        const hx = peakX + (rightEaveX - peakX) * t
        const hy = peakY + (eavesY - peakY) * t + Math.sin(t * Math.PI) * 18
        const aboveX = hx - 22
        const aboveY = hy - 70
        const slideX = hx + 55 + i * 8
        const slideY = hy + 70 + i * 6
        return {
          id: `deflect-${i}`,
          d: `M ${aboveX} ${aboveY} L ${hx} ${hy} L ${slideX} ${slideY}`,
          weight: 1.25,
          opacity: 0.55,
          animate: false,
          className: 'rain-deflect',
        }
      })

      return [
        {
          kind: 'fill',
          d: `M ${wx + 4} ${wy + 4} H ${wx + ws - 4} V ${wy + ws - 4} H ${wx + 4} Z`,
          fill: 'var(--window-glow)',
          opacity: 0.6,
        },
        { kind: 'group', className: 'rain-sheet', lines: rainField },
        {
          kind: 'group',
          className: 'rain-sheet rain-sheet-b',
          lines: rainField.map((l) => ({ ...l, id: `${l.id}-b`, opacity: 0.28 })),
        },
        {
          kind: 'lines',
          lines: [
            {
              id: 'ground',
              d: straight(100, groundY, 900, groundY),
              weight: 3,
              delay: 0.08,
            },
            {
              id: 'wall-l',
              d: straight(x, groundY, x, eavesY),
              weight: 2.4,
              delay: 0.18,
            },
            {
              id: 'wall-r',
              d: straight(x + w, groundY, x + w, eavesY),
              weight: 2.3,
              delay: 0.22,
            },
            {
              id: 'floor',
              d: straight(x, groundY, x + w, groundY),
              weight: 2.2,
              delay: 0.2,
              opacity: 0.35,
            },
            {
              id: 'door-l',
              d: straight(doorX, groundY, doorX, doorY),
              weight: 1.5,
              delay: 0.32,
            },
            {
              id: 'door-r',
              d: straight(doorX + doorW, groundY, doorX + doorW, doorY),
              weight: 1.45,
              delay: 0.35,
            },
            {
              id: 'door-t',
              d: straight(doorX, doorY, doorX + doorW, doorY),
              weight: 1.4,
              delay: 0.38,
            },
            ...openSquare(wx, wy, ws, 4, 'win', 0.4).map((l) => ({
              ...l,
              weight: 1.35,
            })),
            {
              id: 'roof-left',
              d: leftRoof,
              weight: 2.5,
              delay: 0.42,
            },
            {
              id: 'the-one',
              d: rightRoof,
              color: 'bent',
              weight: 3,
              delay: 0.48,
              duration: 1.35,
            },
          ],
        },
        // After the roof so drops read on top of the bent pitch
        { kind: 'group', className: 'rain-deflect-layer', lines: deflect },
      ]
    }

    case 6:
      return stackingWorld(99, 'plain')

    case 7:
      return stackingWorld(99, 'colored')

    case 8: {
      // Close-up on the house: ours still holds the roof; the straight neighbor has slipped away.
      const groundY = 790
      const x = 250
      const w = 460
      const wallH = 300
      const eavesY = groundY - wallH
      const leftEaveX = x - 28
      const rightEaveX = x + w + 28
      const peakX = x + w * 0.46
      const peakY = eavesY - 195

      const wx = x + w * 0.38
      const wy = eavesY + wallH * 0.28
      const ws = w * 0.22
      const doorW = w * 0.18
      const doorH = wallH * 0.38
      const doorX = x + w * 0.14
      const doorY = groundY - doorH

      // Stubs where the straight neighbor used to meet the roof
      const stubPeak = straight(peakX, peakY, peakX - 18, peakY + 22)
      const stubEave = straight(leftEaveX, eavesY, leftEaveX + 22, eavesY - 8)

      const grass: LineSpec[] = Array.from({ length: 28 }, (_, i) => {
        const r = mulberry32(810 + i)
        const gx = 60 + r() * 880
        const gh = 10 + r() * 26
        return {
          id: `grass-${i}`,
          d: straight(gx, groundY, gx + (r() - 0.5) * 8, groundY - gh),
          weight: 0.85 + r() * 0.7,
          delay: 0.7 + i * 0.012,
          opacity: 0.35 + r() * 0.35,
        }
      })

      return [
        {
          kind: 'fill',
          d: `M ${wx + 4} ${wy + 4} H ${wx + ws - 4} V ${wy + ws - 4} H ${wx + 4} Z`,
          fill: 'var(--window-glow)',
          opacity: 0.5,
        },
        {
          kind: 'lines',
          lines: [
            {
              id: 'ground',
              d: straight(40, groundY, 960, groundY),
              weight: 3,
              delay: 0.06,
            },
            {
              id: 'wall-l',
              d: straight(x, groundY, x, eavesY),
              weight: 2.6,
              delay: 0.12,
            },
            {
              id: 'wall-r',
              d: straight(x + w, groundY, x + w, eavesY),
              weight: 2.5,
              delay: 0.16,
            },
            {
              id: 'floor',
              d: straight(x, groundY, x + w, groundY),
              weight: 2.2,
              delay: 0.14,
              opacity: 0.35,
            },
            {
              id: 'door-l',
              d: straight(doorX, groundY, doorX, doorY),
              weight: 1.55,
              delay: 0.22,
            },
            {
              id: 'door-r',
              d: straight(doorX + doorW, groundY, doorX + doorW, doorY),
              weight: 1.5,
              delay: 0.25,
            },
            {
              id: 'door-t',
              d: straight(doorX, doorY, doorX + doorW, doorY),
              weight: 1.45,
              delay: 0.28,
            },
            ...openSquare(wx, wy, ws, 5, 'win', 0.32).map((l) => ({
              ...l,
              weight: 1.4,
            })),
            // gap markers — the neighbor used to live here
            {
              id: 'stub-peak',
              d: stubPeak,
              weight: 1.6,
              delay: 0.4,
              opacity: 0.4,
              dashed: true,
              dashPattern: '4 7',
            },
            {
              id: 'stub-eave',
              d: stubEave,
              weight: 1.5,
              delay: 0.42,
              opacity: 0.4,
              dashed: true,
              dashPattern: '4 7',
            },
            // ours — still holding its side of the roof
            {
              id: 'the-one',
              d: bentChord(peakX, peakY, rightEaveX, eavesY, 0.12),
              color: 'bent',
              weight: 3.2,
              delay: 0.35,
              duration: 1.25,
            },
            ...grass,
            // the straight neighbor, done running, flat in the grass
            {
              id: 'loose-neighbor',
              d: straight(200, groundY - 14, 560, groundY - 6),
              weight: 2.9,
              delay: 0.55,
              duration: 1.4,
              className: 'loose-settle',
            },
          ],
        },
      ]
    }

    case 9:
      return unravelTown(99)

    case 10: {
      // Culmination: house exploding outward toward the reader
      const rand = mulberry32(404)
      const cx = 500
      const cy = 470
      const shards: LineSpec[] = []

      for (let i = 0; i < 84; i++) {
        const angle = (i / 84) * Math.PI * 2 + (rand() - 0.5) * 0.12
        const inner = 18 + rand() * 70
        const outer = 260 + rand() * 340
        const x1 = cx + Math.cos(angle) * inner
        const y1 = cy + Math.sin(angle) * inner
        const x2 = cx + Math.cos(angle) * outer
        const y2 = cy + Math.sin(angle) * outer
        shards.push({
          id: `boom-${i}`,
          d: straight(x1, y1, x2, y2),
          weight: 1 + (outer / 700) * 2.6,
          delay: 0.02 + rand() * 0.22,
          duration: 0.4 + rand() * 0.25,
          opacity: 0.5 + rand() * 0.5,
          className: 'boom-shard',
        })
      }

      // Mid-flight house bits (still readable as house-stuff)
      shards.push(
        {
          id: 'ex-wall',
          d: straight(cx - 55, cy - 40, cx - 70, cy + 90),
          weight: 2.9,
          delay: 0.08,
          className: 'boom-shard',
        },
        {
          id: 'ex-wall2',
          d: straight(cx + 60, cy - 50, cx + 95, cy + 85),
          weight: 2.5,
          delay: 0.1,
          className: 'boom-shard',
        },
        {
          id: 'ex-floor',
          d: straight(cx - 80, cy + 70, cx + 75, cy + 95),
          weight: 2.6,
          delay: 0.12,
          className: 'boom-shard',
        },
        {
          id: 'ex-win',
          d: straight(cx - 20, cy - 10, cx + 25, cy + 5),
          weight: 1.6,
          delay: 0.14,
          className: 'boom-shard',
        },
        {
          id: 'ex-win2',
          d: straight(cx - 20, cy + 20, cx + 25, cy + 35),
          weight: 1.5,
          delay: 0.15,
          className: 'boom-shard',
        },
        {
          id: 'ex-roof-bit',
          d: straight(cx + 10, cy - 90, cx + 110, cy - 40),
          weight: 2.2,
          delay: 0.11,
          className: 'boom-shard',
        },
      )

      const decoys: LineSpec[] = [
        {
          id: 'decoy-1',
          d: straight(140, 160, 230, 210),
          color: 'decoy',
          weight: 2.1,
          delay: 0.18,
          className: 'boom-shard',
        },
        {
          id: 'decoy-2',
          d: straight(820, 680, 920, 620),
          color: 'decoy',
          weight: 2,
          delay: 0.2,
          className: 'boom-shard',
        },
      ]

      return [
        { kind: 'lines', lines: [...shards, ...decoys] },
        {
          kind: 'group',
          className: 'boom-bent',
          transform: bentTransform(455, 400, 1.45, 42),
          lines: [
            {
              id: 'the-one',
              d: BENT_PATH,
              color: 'bent',
              weight: 2.8,
              delay: 0.05,
              duration: 0.65,
            },
          ],
        },
      ]
    }

    case 11: {
      const field = fieldOfLines(
        777,
        180,
        { x: -40, y: -40, w: 1080, h: 1080 },
        {
          lenMin: 18,
          lenMax: 95,
          weightMin: 0.8,
          weightMax: 3.2,
          delayBase: 0.05,
          delayStep: 0.008,
          idPrefix: 'drift',
        },
      )
      return [
        { kind: 'drift', className: 'drift-field', lines: field },
        {
          kind: 'bent',
          transform: bentTransform(320, 480, 1.15, -12),
          line: {
            id: 'the-one',
            d: BENT_PATH,
            color: 'bent',
            weight: 2.6,
            delay: 0.02,
            duration: 1.2,
          },
        },
      ]
    }

    case 12: {
      // Quiet devastation: straight red among other straight reds
      return [
        {
          kind: 'lines',
          lines: [
            {
              id: 'was-ours',
              d: straight(420, 490, 580, 490),
              color: 'bent',
              weight: 2.4,
              delay: 0.4,
              duration: 1.5,
            },
            {
              id: 'red2',
              d: straight(300, 420, 400, 455),
              color: 'decoy',
              weight: 2,
              delay: 0.6,
            },
            {
              id: 'red3',
              d: straight(620, 530, 720, 510),
              color: 'decoy',
              weight: 2.1,
              delay: 0.7,
            },
            {
              id: 'red4',
              d: straight(480, 600, 560, 640),
              color: 'decoy',
              weight: 1.8,
              delay: 0.8,
            },
            {
              id: 'ink1',
              d: straight(200, 300, 280, 280),
              weight: 1.5,
              delay: 0.9,
              opacity: 0.5,
            },
            {
              id: 'ink2',
              d: straight(750, 350, 820, 400),
              weight: 1.4,
              delay: 0.95,
              opacity: 0.45,
            },
          ],
        },
      ]
    }

    case 13: {
      const rand = mulberry32(1313)
      const lines: LineSpec[] = []
      const dots: Dot[] = []
      // gradient left→right: long → short → dashes → dots
      for (let i = 0; i < 120; i++) {
        const t = i / 120
        const x = 40 + t * 920 + (rand() - 0.5) * 30
        const y = 80 + rand() * 840
        const len = Math.max(2, 70 * (1 - t) * (1 - t) + 4)
        const isRed = rand() > 0.88
        if (t > 0.72 || len < 8) {
          dots.push({
            id: `d-${i}`,
            cx: x,
            cy: y,
            r: 1.2 + rand() * 2.2,
            color: isRed ? 'decoy' : 'ink',
            delay: 0.2 + t * 0.8,
          })
        } else {
          const angle = rand() * Math.PI
          lines.push({
            id: `brk-${i}`,
            d: straight(
              x,
              y,
              x + Math.cos(angle) * len,
              y + Math.sin(angle) * len,
            ),
            color: isRed ? 'decoy' : 'ink',
            weight: 0.9 + rand() * 1.8,
            delay: 0.1 + t * 0.6,
            duration: 0.5,
          })
        }
      }
      // one red that "used to be ours" — a short segment mid-right then dots
      dots.push({
        id: 'maybe-ours',
        cx: 780,
        cy: 640,
        r: 2.4,
        color: 'bent',
        delay: 0.5,
      })
      return [
        { kind: 'lines', lines },
        { kind: 'dots', dots },
      ]
    }

    case 14: {
      const rand = mulberry32(1414)
      const dots: Dot[] = []
      for (let i = 0; i < 160; i++) {
        const isRed = rand() > 0.82
        dots.push({
          id: `field-${i}`,
          cx: 30 + rand() * 940,
          cy: 30 + rand() * 940,
          r: 1 + rand() * 2.5,
          color: isRed ? (rand() > 0.5 ? 'bent' : 'decoy') : 'ink',
          delay: rand() * 1.2,
        })
      }
      // three lonely dots low, far apart — final recto echo
      dots.push(
        {
          id: 'final-1',
          cx: 180,
          cy: 860,
          r: 2.2,
          color: 'ink',
          delay: 1.4,
        },
        {
          id: 'final-2',
          cx: 500,
          cy: 890,
          r: 1.8,
          color: 'decoy',
          delay: 1.55,
        },
        {
          id: 'final-3',
          cx: 820,
          cy: 870,
          r: 2,
          color: 'ink',
          delay: 1.7,
        },
      )
      return [{ kind: 'dots', dots, animate: true }]
    }

    default:
      return []
  }
}
