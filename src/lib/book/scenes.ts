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

function townParts(
  seed: number,
  density: 'busy' | 'peak',
  includeBentRoof: boolean,
  bentPos: { x: number; y: number; scale: number },
): ScenePart[] {
  const rand = mulberry32(seed)
  const parts: ScenePart[] = []
  const groundY = 780

  parts.push({
    kind: 'lines',
    lines: [
      {
        id: 'ground',
        d: straight(20, groundY, 980, groundY),
        weight: 2.5,
        delay: 0.05,
      },
    ],
  })

  // houses — bent roof placed once at bentPos so seek stays intentional
  const houseCount = density === 'peak' ? 7 : 5
  for (let i = 0; i < houseCount; i++) {
    const hx = 60 + i * (density === 'peak' ? 130 : 150) + rand() * 20
    const hw = 55 + rand() * 35
    const hh = 45 + rand() * 40
    const hy = groundY - hh
    // Skip slot that would overlap the bent house
    if (includeBentRoof && Math.abs(hx - bentPos.x) < hw) continue
    parts.push(
      ...house(hx, hy, hw, hh, `h${i}`, {
        roofBent: false,
        lit: rand() > 0.4,
        delay: 0.15 + i * 0.08,
      }),
    )
  }

  if (includeBentRoof) {
    const hw = 70
    const hh = 55
    parts.push(
      ...house(bentPos.x, groundY - hh, hw, hh, 'bent-house', {
        roofBent: true,
        lit: true,
        delay: 0.35,
      }),
    )
  }

  // wheels
  for (let i = 0; i < (density === 'peak' ? 5 : 3); i++) {
    const cx = 100 + rand() * 800
    const cy = groundY - 30 - rand() * 20
    const r = 18 + rand() * 14
    parts.push({
      kind: 'lines',
      lines: [
        ...openCircle(cx, cy, r, 8, `wheel-${i}`, 0.5 + i * 0.05),
        {
          id: `spoke-${i}`,
          d: straight(cx - r * 0.7, cy, cx + r * 0.7, cy),
          weight: 1.2,
          delay: 0.6 + i * 0.05,
        },
        {
          id: `spoke2-${i}`,
          d: straight(cx, cy - r * 0.7, cx, cy + r * 0.7),
          weight: 1.2,
          delay: 0.62 + i * 0.05,
        },
      ],
    })
  }

  // sails / mountains / beaks
  for (let i = 0; i < 4; i++) {
    const bx = 80 + rand() * 850
    const by = groundY - 100 - rand() * 200
    const s = 40 + rand() * 50
    parts.push({
      kind: 'lines',
      lines: [
        {
          id: `sail-a-${i}`,
          d: straight(bx, by + s, bx + s * 0.5, by),
          weight: 1.8,
          delay: 0.7 + i * 0.04,
        },
        {
          id: `sail-b-${i}`,
          d: straight(bx + s, by + s, bx + s * 0.5, by),
          weight: 1.5,
          delay: 0.72 + i * 0.04,
        },
        {
          id: `sail-c-${i}`,
          d: straight(bx + 4, by + s, bx + s - 4, by + s),
          weight: 1.3,
          delay: 0.74 + i * 0.04,
        },
      ],
    })
  }

  // windows floating (somebody behind them)
  for (let i = 0; i < 6; i++) {
    parts.push({
      kind: 'lines',
      lines: openSquare(
        50 + rand() * 880,
        80 + rand() * 400,
        22 + rand() * 18,
        4,
        `float-win-${i}`,
        0.8 + i * 0.03,
      ),
    })
  }

  // fence segments
  for (let i = 0; i < 8; i++) {
    const fx = 40 + i * 30
    parts.push({
      kind: 'lines',
      lines: [
        {
          id: `fence-${i}`,
          d: straight(fx, groundY, fx, groundY - 28 - rand() * 10),
          weight: 1.4,
          delay: 0.9 + i * 0.02,
        },
      ],
    })
  }

  return parts
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
        // closed companions
        ...closedTriangle(120, 200, 210, 200, 165, 120, 't1', 0.35, 1.3, 0.7),
        ...closedTriangle(720, 160, 820, 175, 760, 90, 't2', 0.4, 1.25, 0.65),
        ...closedTriangle(780, 520, 900, 560, 820, 430, 't3', 0.45, 1.4, 0.7),
        ...closedTriangle(90, 520, 200, 580, 70, 620, 't4', 0.5, 1.2, 0.6),
        ...closedTriangle(560, 780, 680, 800, 620, 700, 't5', 0.55, 1.35, 0.65),
        // almost-triangles (watching, not quite)
        ...almostTriangle(280, 140, 360, 160, 300, 70, 'a1', 0.38, 0, 1.2, 0.55),
        ...almostTriangle(840, 300, 940, 320, 900, 220, 'a2', 0.42, 1, 1.3, 0.5),
        ...almostTriangle(40, 340, 140, 360, 90, 260, 'a3', 0.48, 2, 1.25, 0.55),
        ...almostTriangle(640, 600, 760, 640, 700, 520, 'a4', 0.52, 0, 1.2, 0.5),
        ...almostTriangle(200, 760, 320, 790, 240, 680, 'a5', 0.58, 1, 1.15, 0.45),
        ...almostTriangle(400, 100, 480, 90, 450, 40, 'a6', 0.62, 2, 1.1, 0.45),
        // leftover company from earlier pages
        ...fieldOfLines(
          31,
          14,
          { x: 40, y: 40, w: 920, h: 920 },
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
        // full bent side — exact endpoints on A and C (no scaled transform)
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
        { kind: 'lines', lines: openSquare(120, 180, 90, 10, 'sq1', 0.2) },
        { kind: 'lines', lines: openSquare(700, 520, 110, 12, 'sq2', 0.35) },
        { kind: 'lines', lines: openSquare(280, 620, 70, 8, 'sq3', 0.45) },
        { kind: 'lines', lines: openCircle(780, 220, 55, 10, 'cir1', 0.25) },
        { kind: 'lines', lines: openCircle(180, 480, 40, 8, 'cir2', 0.4) },
        { kind: 'lines', lines: openHex(520, 700, 70, 'hex', 0.5) },
        {
          kind: 'lines',
          lines: openSquare(560, 140, 60, 7, 'sq4', 0.55),
        },
        // bent triangle upper third
        {
          kind: 'lines',
          lines: [
            {
              id: 'bt-base',
              d: straight(340, 280, 460, 280),
              weight: 1.8,
              delay: 0.3,
            },
            {
              id: 'bt-right',
              d: straight(460, 280, 410, 180),
              weight: 1.6,
              delay: 0.35,
            },
          ],
        },
        {
          kind: 'bent',
          transform: bentTransform(348, 275, 1.15, -52),
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
      return parts
    }

    case 5: {
      const groundY = 720
      return [
        {
          kind: 'lines',
          lines: [
            {
              id: 'ground',
              d: straight(120, groundY, 880, groundY),
              weight: 2.8,
              delay: 0.1,
            },
            // rain lines sliding off crooked
            {
              id: 'rain1',
              d: straight(470, 310, 490, 380),
              weight: 1,
              delay: 0.9,
              opacity: 0.45,
            },
            {
              id: 'rain2',
              d: straight(510, 300, 545, 390),
              weight: 1,
              delay: 0.95,
              opacity: 0.4,
            },
            {
              id: 'rain3',
              d: straight(550, 320, 580, 400),
              weight: 0.9,
              delay: 1.0,
              opacity: 0.35,
            },
          ],
        },
        ...house(400, 520, 200, 160, 'home', {
          roofBent: true,
          lit: true,
          delay: 0.25,
        }),
      ]
    }

    case 6:
      return townParts(99, 'busy', true, { x: 680, y: 680, scale: 1 })

    case 7: {
      const parts = townParts(101, 'peak', true, { x: 620, y: 690, scale: 1 })
      // ochre market stall fills + blue water — only this spread
      parts.unshift(
        {
          kind: 'fill',
          d: 'M 40 760 Q 200 740 380 755 T 700 750 T 980 760 L 980 820 L 40 820 Z',
          fill: 'var(--line-water)',
          opacity: 0.22,
        },
        {
          kind: 'fill',
          d: 'M 200 640 H 320 V 760 H 200 Z',
          fill: 'var(--line-ochre)',
          opacity: 0.35,
        },
        {
          kind: 'fill',
          d: 'M 340 600 H 420 V 760 H 340 Z',
          fill: 'var(--line-ochre)',
          opacity: 0.28,
        },
      )
      // boat
      parts.push({
        kind: 'lines',
        lines: [
          {
            id: 'boat-hull',
            d: straight(60, 770, 200, 770),
            weight: 2.5,
            delay: 0.3,
          },
          {
            id: 'boat-bow',
            d: straight(200, 770, 230, 755),
            weight: 2,
            delay: 0.35,
          },
          {
            id: 'mast',
            d: straight(120, 770, 120, 640),
            weight: 1.8,
            delay: 0.4,
          },
          {
            id: 'sail',
            d: straight(120, 650, 180, 720),
            weight: 1.5,
            delay: 0.45,
          },
        ],
      })
      return parts
    }

    case 8: {
      const groundY = 820
      return [
        {
          kind: 'lines',
          lines: [
            // distant tiny town silhouette at top
            {
              id: 'horiz',
              d: straight(200, 120, 800, 120),
              weight: 1,
              delay: 0.2,
              opacity: 0.5,
            },
            ...[0, 1, 2, 3, 4, 5].flatMap((i) => {
              const x = 280 + i * 70
              return [
                {
                  id: `tiny-h-${i}`,
                  d: straight(x, 120, x, 120 - (20 + (i % 3) * 12)),
                  weight: 1.2,
                  delay: 0.25 + i * 0.03,
                  opacity: 0.55,
                } satisfies LineSpec,
              ]
            }),
            // tiny bent roof
            {
              id: 'tiny-roof-l',
              d: straight(520, 95, 545, 70),
              weight: 1,
              delay: 0.4,
              opacity: 0.6,
            },
            {
              id: 'tiny-roof-r',
              d: straight(570, 95, 545, 70),
              weight: 1,
              delay: 0.42,
              opacity: 0.6,
            },
            // grass suggestions
            ...Array.from({ length: 40 }, (_, i) => {
              const rand = mulberry32(200 + i)
              const x = 40 + rand() * 920
              const h = 8 + rand() * 22
              return {
                id: `grass-${i}`,
                d: straight(x, groundY, x + (rand() - 0.5) * 6, groundY - h),
                weight: 0.8 + rand(),
                delay: 0.5 + i * 0.015,
                opacity: 0.4 + rand() * 0.3,
              } satisfies LineSpec
            }),
            // the loose fence line lying in grass
            {
              id: 'loose',
              d: straight(280, groundY - 18, 520, groundY - 8),
              weight: 2.8,
              delay: 0.15,
              duration: 1.3,
            },
          ],
        },
        {
          kind: 'bent',
          transform: bentTransform(530, 82, 0.35, -8),
          line: {
            id: 'the-one',
            d: BENT_PATH,
            color: 'bent',
            weight: 1.4,
            delay: 0.45,
            duration: 1,
            opacity: 0.85,
          },
        },
      ]
    }

    case 9: {
      const parts: ScenePart[] = [
        {
          kind: 'lines',
          lines: [
            {
              id: 'ground',
              d: straight(40, 780, 960, 780),
              weight: 2,
              delay: 0.1,
            },
            // shutter falling
            {
              id: 'shutter',
              d: straight(120, 280, 180, 340),
              weight: 2.4,
              delay: 0.2,
            },
            {
              id: 'shutter2',
              d: straight(180, 340, 160, 400),
              weight: 2,
              delay: 0.25,
            },
            {
              id: 'arc1',
              d: 'M 140 240 Q 200 300 170 420',
              weight: 1,
              delay: 0.3,
              dashed: true,
              dashPattern: '3 7',
              opacity: 0.35,
            },
            // wheel rolling
            ...openCircle(400, 520, 45, 8, 'fall-wheel', 0.35),
            {
              id: 'arc2',
              d: 'M 320 400 Q 380 480 460 560',
              weight: 1,
              delay: 0.4,
              dashed: true,
              dashPattern: '3 7',
              opacity: 0.35,
            },
            // boat sagging
            {
              id: 'boat1',
              d: straight(560, 600, 720, 640),
              weight: 2.5,
              delay: 0.45,
            },
            {
              id: 'boat2',
              d: straight(720, 640, 760, 620),
              weight: 2,
              delay: 0.5,
            },
            {
              id: 'mast-fall',
              d: straight(620, 610, 680, 520),
              weight: 1.6,
              delay: 0.52,
            },
            {
              id: 'arc3',
              d: 'M 600 520 Q 680 580 740 660',
              weight: 1,
              delay: 0.55,
              dashed: true,
              dashPattern: '3 7',
              opacity: 0.35,
            },
          ],
        },
        // house at far right, intact
        ...house(820, 680, 90, 70, 'still', {
          roofBent: true,
          lit: false,
          delay: 0.6,
        }),
      ]
      return parts
    }

    case 10: {
      // Frozen explosion — house parts flying, 2–3 decoy reds
      const rand = mulberry32(404)
      const shards: LineSpec[] = []
      for (let i = 0; i < 48; i++) {
        const angle = rand() * Math.PI * 2
        const dist = 40 + rand() * 480
        const cx = 500 + Math.cos(angle) * dist
        const cy = 480 + Math.sin(angle) * dist
        const len = 25 + rand() * 90
        const a2 = angle + (rand() - 0.5) * 0.8
        shards.push({
          id: `shard-${i}`,
          d: straight(
            cx,
            cy,
            cx + Math.cos(a2) * len,
            cy + Math.sin(a2) * len,
          ),
          weight: 1.2 + rand() * 2.5,
          delay: 0.05 + rand() * 0.25,
          duration: 0.5,
        })
      }
      // recognizable house-ish cluster near center
      shards.push(
        {
          id: 'ex-wall',
          d: straight(420, 400, 420, 560),
          weight: 2.8,
          delay: 0.1,
        },
        {
          id: 'ex-wall2',
          d: straight(580, 390, 600, 570),
          weight: 2.4,
          delay: 0.12,
        },
        {
          id: 'ex-floor',
          d: straight(400, 550, 620, 540),
          weight: 2.6,
          delay: 0.14,
        },
      )
      // decoy reds
      const decoys: LineSpec[] = [
        {
          id: 'decoy-1',
          d: straight(180, 200, 260, 240),
          color: 'decoy',
          weight: 2.2,
          delay: 0.2,
        },
        {
          id: 'decoy-2',
          d: straight(780, 620, 860, 580),
          color: 'decoy',
          weight: 2,
          delay: 0.22,
        },
        {
          id: 'decoy-3',
          d: straight(700, 180, 760, 260),
          color: 'decoy',
          weight: 1.8,
          delay: 0.24,
        },
      ]
      return [
        { kind: 'lines', lines: [...shards, ...decoys] },
        {
          kind: 'bent',
          transform: bentTransform(470, 440, 1.2, 38),
          line: {
            id: 'the-one',
            d: BENT_PATH,
            color: 'bent',
            weight: 2.5,
            delay: 0.08,
            duration: 0.7,
          },
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
