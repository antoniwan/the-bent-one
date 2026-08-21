<script lang="ts">
  interface Props {
    /** boom = explosion rays; after = residual haze (lower strength to fade) */
    mode?: 'boom' | 'after'
    /**
     * 1 = soft dust (page 11). Toward 0 = gone (page 14 should be ~0.03).
     * Ignored for boom.
     */
    strength?: number
  }

  let { mode = 'boom', strength = 1 }: Props = $props()

  const CX = 50
  const CY = 42
  const colors = [
    'var(--line-ink)',
    'var(--line-ochre)',
    'var(--line-water)',
  ] as const

  const streaks = $derived.by(() => {
    const s = Math.max(0, Math.min(1, strength))
    const count =
      mode === 'boom' ? 96 : Math.max(12, Math.round(68 * s + 8 * (1 - s)))

    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + (i % 5) * 0.03
      if (mode === 'boom') {
        const inner = 4 + (i % 7) * 0.35
        const outer = 58 + (i % 11) * 2.2
        return {
          id: i,
          x1: CX + Math.cos(angle) * inner,
          y1: CY + Math.sin(angle) * inner,
          x2: CX + Math.cos(angle) * outer,
          y2: CY + Math.sin(angle) * outer,
          delay: (i % 12) * 0.07,
          opacity: 0.1 + (i % 5) * 0.04,
          width: 0.12 + (i % 4) * 0.06,
          stroke: colors[i % 3],
        }
      }

      // Leftover boom rays — opacity scales hard with strength
      const inner = 8 + (i % 9) * 1.2
      const outer = 28 + (i % 13) * 3.5
      const drift = ((i * 17) % 20) - 10
      const base = 0.12 + (i % 4) * 0.028
      return {
        id: i,
        x1: CX + Math.cos(angle) * inner + drift * 0.15,
        y1: CY + Math.sin(angle) * inner + drift * 0.1,
        x2: CX + Math.cos(angle) * outer + drift * 0.35,
        y2: CY + Math.sin(angle) * outer + drift * 0.25,
        delay: (i % 12) * 0.07,
        opacity: base * s, // wean with page strength; page 14 ~ invisible
        width: 0.06 + (i % 4) * 0.035 * Math.max(s, 0.2),
        stroke: colors[i % 3],
      }
    })
  })

  const afterClass = $derived(
    mode === 'after'
      ? strength > 0.55
        ? 'dust'
        : strength > 0.15
          ? 'ash'
          : 'gone'
      : '',
  )
</script>

<svg
  class="boom-field"
  class:boom={mode === 'boom'}
  class:dust={afterClass === 'dust'}
  class:ash={afterClass === 'ash'}
  class:gone={afterClass === 'gone'}
  viewBox="0 0 100 100"
  preserveAspectRatio="xMidYMid slice"
  aria-hidden="true"
>
  {#each streaks as s (s.id)}
    <line
      class="streak"
      x1={s.x1}
      y1={s.y1}
      x2={s.x2}
      y2={s.y2}
      stroke={s.stroke}
      stroke-width={s.width}
      stroke-linecap="round"
      opacity={s.opacity}
      style="--d: {s.delay}s; --o: {s.opacity}"
    />
  {/each}
</svg>

<style>
  .boom-field {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    z-index: 0;
    pointer-events: none;
  }

  .boom .streak {
    animation: warp-rush 1.05s linear infinite;
    animation-delay: var(--d, 0s);
    transform-origin: 50px 42px;
  }

  .dust .streak,
  .ash .streak {
    animation: dust-drift 28s ease-in-out infinite alternate;
    animation-delay: var(--d, 0s);
  }

  .gone .streak {
    animation: none;
  }

  @keyframes warp-rush {
    0% {
      stroke-dasharray: 4 80;
      stroke-dashoffset: 0;
      opacity: 0.05;
    }
    35% {
      opacity: 0.28;
    }
    100% {
      stroke-dasharray: 18 40;
      stroke-dashoffset: -70;
      opacity: 0.06;
    }
  }

  @keyframes dust-drift {
    from {
      transform: translate(0, 0);
      opacity: var(--o, 0.1);
    }
    to {
      transform: translate(1.2px, -0.8px);
      opacity: calc(var(--o, 0.1) * 0.7);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .streak {
      animation: none !important;
    }
  }
</style>
