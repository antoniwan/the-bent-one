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
        <g transform={part.transform} class={part.className}>
          <LineLayer lines={part.lines} playKey={playKey} />
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

  @media (prefers-reduced-motion: reduce) {
    .drift-field {
      animation: none;
    }
    .spread-art :global(.flee-up),
    .spread-art :global(.flee-up-slow) {
      animation: none;
    }
    .dot {
      opacity: 0.85;
      animation: none;
    }
  }
</style>
