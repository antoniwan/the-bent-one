<script lang="ts">
  import DrawnLine from '../lines/DrawnLine.svelte'
  import LineLayer from '../lines/LineLayer.svelte'
  import { sceneForSpread, type Dot, type ScenePart } from './scenes'

  interface Props {
    spreadId: number
    playKey: number
  }

  let { spreadId, playKey }: Props = $props()

  const parts = $derived(sceneForSpread(spreadId))

  function dotFill(color: Dot['color']) {
    if (color === 'bent' || color === 'decoy') return 'var(--line-bent)'
    if (color === 'ochre') return 'var(--line-ochre)'
    if (color === 'water') return 'var(--line-water)'
    return 'var(--line-ink)'
  }
</script>

{#key playKey}
  <svg
    class="spread-art"
    class:bleed={spreadId === 10}
    class:peak={spreadId === 7}
    class:escape={spreadId === 4}
    viewBox="0 0 1000 1000"
    role="img"
    aria-label="Illustration for page {spreadId}"
  >
    {#each parts as part, pi (pi)}
      {#if part.kind === 'fill'}
        <path
          class="scene-fill"
          d={part.d}
          fill={part.fill}
          opacity={part.opacity ?? 1}
        />
      {:else if part.kind === 'lines'}
        <LineLayer lines={part.lines} playKey={playKey} />
      {:else if part.kind === 'drift'}
        <g class={part.className}>
          <LineLayer lines={part.lines} playKey={playKey} />
        </g>
      {:else if part.kind === 'bent'}
        <DrawnLine
          d={part.line.d}
          color={part.line.color}
          weight={part.line.weight}
          delay={part.line.delay}
          duration={part.line.duration}
          opacity={part.line.opacity}
          transform={part.transform}
        />
      {:else if part.kind === 'group'}
        <g class={part.className}>
          <g transform={part.transform}>
            <LineLayer lines={part.lines} playKey={playKey} />
          </g>
        </g>
      {:else if part.kind === 'dots'}
        {#each part.dots as dot (dot.id)}
          <circle
            class="dot"
            class:animate={part.animate !== false}
            cx={dot.cx}
            cy={dot.cy}
            r={dot.r}
            fill={dotFill(dot.color)}
            style="--dot-delay: {dot.delay ?? 0}s"
          />
        {/each}
      {/if}
    {/each}
  </svg>
{/key}

<style>
  .spread-art {
    width: 100%;
    height: 100%;
    display: block;
    overflow: hidden;
  }

  .spread-art.escape {
    overflow: visible;
  }

  .spread-art.bleed {
    overflow: hidden;
  }

  .spread-art :global(.flee-up) {
    transform-origin: 500px 0;
    animation: flee-up 5.5s ease-in-out infinite alternate;
  }

  .spread-art :global(.flee-up-slow) {
    transform-origin: 200px 0;
    animation: flee-up 7s ease-in-out infinite alternate-reverse;
  }

  /* Match the real header border: 1px --rule hairline, very long */
  .spread-art :global(.flee-header-rule) {
    stroke: var(--rule) !important;
    stroke-width: 1px !important;
    vector-effect: non-scaling-stroke;
    opacity: 1 !important;
  }

  .spread-art :global(.bird-fly) {
    will-change: transform;
  }

  .spread-art :global(.bird-a) {
    animation: bird-path-a 14s ease-in-out infinite;
  }
  .spread-art :global(.bird-b) {
    animation: bird-path-b 11s ease-in-out infinite;
    animation-delay: -3s;
  }
  .spread-art :global(.bird-c) {
    animation: bird-path-c 16s ease-in-out infinite;
    animation-delay: -6s;
  }
  .spread-art :global(.bird-d) {
    animation: bird-path-d 13s ease-in-out infinite;
    animation-delay: -2s;
  }
  .spread-art :global(.bird-e) {
    animation: bird-path-e 15s ease-in-out infinite;
    animation-delay: -8s;
  }

  .spread-art :global(.loose-settle) {
    transform-origin: 380px 780px;
    animation: loose-settle 3.2s ease-in-out infinite alternate;
  }

  .spread-art :global(.unravel-jitter) {
    will-change: transform;
  }
  .spread-art :global(.unravel-0) {
    animation: unravel-j 0.18s steps(2, end) infinite;
  }
  .spread-art :global(.unravel-1) {
    animation: unravel-j2 0.22s steps(2, end) infinite;
    animation-delay: -0.05s;
  }
  .spread-art :global(.unravel-2) {
    animation: unravel-j3 0.16s steps(2, end) infinite;
    animation-delay: -0.1s;
  }
  .spread-art :global(.unravel-3) {
    animation: unravel-j 0.2s steps(2, end) infinite reverse;
    animation-delay: -0.07s;
  }
  .spread-art :global(.unravel-4) {
    animation: unravel-j2 0.14s steps(2, end) infinite;
    animation-delay: -0.12s;
  }
  .spread-art :global(.unravel-ghost) {
    animation: unravel-j3 0.28s steps(2, end) infinite alternate;
  }

  .spread-art :global(.boom-shard) {
    transform-origin: 500px 470px;
  }

  .spread-art :global(.bent-wiggle) {
    animation: bent-wiggle 0.2s steps(2, end) infinite;
    will-change: transform;
  }

  .spread-art.bleed :global(.boom-bent) {
    animation: boom-fly 2.4s ease-in-out infinite alternate;
  }

  .spread-art :global(.rain-sheet) {
    animation: rain-fall 1.35s linear infinite;
  }

  .spread-art :global(.rain-sheet-b) {
    animation-delay: -0.67s;
  }

  .spread-art :global(.rain-deflect) {
    stroke-dasharray: 14 120;
    animation: rain-run 1.7s linear infinite;
  }

  .spread-art :global(.rain-deflect-layer .rain-deflect:nth-child(2)) {
    animation-delay: -0.4s;
  }
  .spread-art :global(.rain-deflect-layer .rain-deflect:nth-child(3)) {
    animation-delay: -0.85s;
  }
  .spread-art :global(.rain-deflect-layer .rain-deflect:nth-child(4)) {
    animation-delay: -1.2s;
  }

  .scene-fill {
    animation: fill-in 1.2s ease both;
  }

  .dot {
    opacity: 0;
  }

  .dot.animate {
    animation: dot-in 0.8s ease forwards;
    animation-delay: var(--dot-delay, 0s);
  }

  .drift-field {
    animation: gentle-drift 28s linear infinite;
    transform-origin: 500px 500px;
  }

  @keyframes fill-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes dot-in {
    from {
      opacity: 0;
      transform: scale(0.4);
    }
    to {
      opacity: 0.85;
      transform: scale(1);
    }
  }

  @keyframes gentle-drift {
    from {
      transform: translate(0, 0) rotate(0deg);
    }
    to {
      transform: translate(-12px, 8px) rotate(0.4deg);
    }
  }

  @keyframes flee-up {
    from {
      transform: translate(0, 0);
    }
    to {
      transform: translate(4px, -28px);
    }
  }

  @keyframes bird-path-a {
    0%,
    100% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(120px, -36px);
    }
  }
  @keyframes bird-path-b {
    0%,
    100% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(90px, 28px);
    }
  }
  @keyframes bird-path-c {
    0%,
    100% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(-70px, -44px);
    }
  }
  @keyframes bird-path-d {
    0%,
    100% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(-110px, 22px);
    }
  }
  @keyframes bird-path-e {
    0%,
    100% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(60px, -50px);
    }
  }

  @keyframes loose-settle {
    from {
      transform: translate(0, 0) rotate(0deg);
    }
    to {
      transform: translate(6px, 2px) rotate(0.8deg);
    }
  }

  @keyframes unravel-j {
    0% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(2px, -2px);
    }
    100% {
      transform: translate(-1px, 1px);
    }
  }
  @keyframes unravel-j2 {
    0% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(-2px, 1px);
    }
    100% {
      transform: translate(2px, -1px);
    }
  }
  @keyframes unravel-j3 {
    0% {
      transform: translate(0, 0) rotate(0deg);
    }
    50% {
      transform: translate(1px, 2px) rotate(0.4deg);
    }
    100% {
      transform: translate(-2px, -1px) rotate(-0.3deg);
    }
  }

  @keyframes boom-fly {
    from {
      transform: translate(0, 0) scale(1);
    }
    to {
      transform: translate(18px, -22px) scale(1.08);
    }
  }

  @keyframes bent-wiggle {
    0% {
      transform: translate(0, 0) rotate(0deg);
    }
    50% {
      transform: translate(3px, -2px) rotate(1.2deg);
    }
    100% {
      transform: translate(-2px, 2px) rotate(-0.8deg);
    }
  }

  @keyframes rain-fall {
    from {
      transform: translate(-24px, -70px);
      opacity: 0.2;
    }
    12% {
      opacity: 1;
    }
    88% {
      opacity: 1;
    }
    to {
      transform: translate(48px, 150px);
      opacity: 0.15;
    }
  }

  @keyframes rain-run {
    from {
      stroke-dashoffset: 0;
    }
    to {
      stroke-dashoffset: -160;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .drift-field {
      animation: none;
    }
    .spread-art :global(.flee-up),
    .spread-art :global(.flee-up-slow),
    .spread-art :global(.rain-sheet),
    .spread-art :global(.rain-deflect),
    .spread-art :global(.bird-fly),
    .spread-art :global(.loose-settle),
    .spread-art :global(.unravel-jitter),
    .spread-art :global(.boom-bent),
    .spread-art :global(.bent-wiggle) {
      animation: none;
    }
    .dot {
      opacity: 0.85;
      animation: none;
    }
  }
</style>
