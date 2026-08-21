<script lang="ts">
  import SpreadArt from './SpreadArt.svelte'
  import type { SpreadMeta } from './spreads'

  interface Props {
    spread: SpreadMeta
    playKey: number
    isCover?: boolean
  }

  let { spread, playKey, isCover = false }: Props = $props()
</script>

<article class="spread" class:cover={isCover} data-spread={spread.id}>
  <div class="stage">
    <SpreadArt spreadId={spread.id} {playKey} />
  </div>
  <div class="prose" class:pause-first={spread.id === 12}>
    {#each spread.text as line, i}
      <p
        class="line"
        class:lead={i === 0}
        style="--i: {i}"
      >
        {line}
      </p>
    {/each}
  </div>
</article>

<style>
  .spread {
    display: grid;
    grid-template-rows: minmax(0, 1.15fr) auto;
    height: 100%;
    min-height: 0;
    gap: clamp(0.75rem, 2vh, 1.5rem);
  }

  .stage {
    position: relative;
    min-height: 0;
    aspect-ratio: 1 / 1;
    max-height: min(62vh, 100%);
    margin-inline: auto;
    width: min(100%, 62vh, 720px);
    background:
      radial-gradient(ellipse at 50% 40%, var(--paper-glow) 0%, transparent 70%),
      var(--paper);
    border: 1px solid var(--rule);
    overflow: hidden;
  }

  .stage :global(.spread-art.bleed) {
    transform: scale(1.06);
  }

  .prose {
    max-width: 34rem;
    margin-inline: auto;
    text-align: center;
    padding-inline: 1rem;
  }

  .line {
    margin: 0 0 0.65em;
    font-family: var(--font-body);
    font-size: clamp(1.05rem, 2.2vw, 1.25rem);
    line-height: 1.55;
    color: var(--ink);
    letter-spacing: 0.01em;
    opacity: 0;
    animation: prose-in 0.7s ease forwards;
    animation-delay: calc(0.35s + var(--i) * 0.18s);
  }

  .line.lead {
    font-size: clamp(1.15rem, 2.5vw, 1.4rem);
  }

  .pause-first .line:first-child {
    margin-bottom: 1.75em;
    animation-delay: 0.25s;
  }

  .pause-first .line:not(:first-child) {
    animation-delay: calc(1.1s + var(--i) * 0.22s);
  }

  @keyframes prose-in {
    from {
      opacity: 0;
      transform: translateY(0.4em);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .line {
      opacity: 1;
      animation: none;
    }
  }

  @media (max-width: 720px) {
    .spread {
      grid-template-rows: auto auto;
    }

    .stage {
      max-height: none;
      width: 100%;
      aspect-ratio: 1 / 1;
    }
  }
</style>
