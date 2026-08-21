<script lang="ts">
  /** Viewport-wide warp streaks — explosion leaking past the paper. */
  const CX = 50
  const CY = 42
  const colors = [
    'var(--line-ink)',
    'var(--line-ochre)',
    'var(--line-water)',
  ] as const
  const streaks = Array.from({ length: 96 }, (_, i) => {
    const angle = (i / 96) * Math.PI * 2 + (i % 5) * 0.03
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
  })
</script>

<svg
  class="boom-field"
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
      style="--d: {s.delay}s"
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

  .streak {
    animation: warp-rush 1.05s linear infinite;
    animation-delay: var(--d, 0s);
    transform-origin: 50px 42px;
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

  @media (prefers-reduced-motion: reduce) {
    .streak {
      animation: none;
      opacity: 0.14;
    }
  }
</style>
