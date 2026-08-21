<script lang="ts">
  import SpreadArt from './SpreadArt.svelte'
  import ProseText from './ProseText.svelte'
  import type { SpreadMeta } from './spreads'

  interface Props {
    spread: SpreadMeta
    playKey: number
    direction?: 1 | -1
    onPrev?: () => void
    onNext?: () => void
  }

  let {
    spread,
    playKey,
    direction = 1,
    onPrev,
    onNext,
  }: Props = $props()
</script>

<article
  class="spread"
  class:from-next={direction < 0}
  class:from-prev={direction > 0}
  class:escape-top={spread.id === 4}
  data-spread={spread.id}
  style="--page-delta: {direction > 0 ? '18px' : '-18px'}"
>
  <div class="stage" class:escape={spread.id === 4}>
    <SpreadArt spreadId={spread.id} {playKey} />
    {#if onPrev}
      <button
        type="button"
        class="hotspot left"
        aria-label="Previous page"
        onclick={onPrev}
      ></button>
    {/if}
    {#if onNext}
      <button
        type="button"
        class="hotspot right"
        aria-label="Next page"
        onclick={onNext}
      ></button>
    {/if}
  </div>
  <div class="prose" class:pause-first={spread.id === 12}>
    {#each spread.text as line, i}
      <p class="line" class:lead={i === 0} style="--i: {i}">
        <ProseText text={line} />
      </p>
    {/each}
  </div>
</article>

<style>
  .spread {
    display: grid;
    grid-template-rows: minmax(0, 1fr) minmax(0, auto);
    height: 100%;
    min-height: 0;
    gap: clamp(0.4rem, 1.2vh, 0.85rem);
    animation: page-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .spread.escape-top {
    overflow: visible;
  }

  .stage {
    position: relative;
    min-height: 0;
    width: min(100%, 52vh, 620px);
    max-height: 100%;
    aspect-ratio: 1 / 1;
    margin-inline: auto;
    background:
      radial-gradient(ellipse at 50% 40%, var(--paper-glow) 0%, transparent 70%),
      var(--paper);
    border: 1px solid var(--rule);
    overflow: hidden;
  }

  .stage.escape {
    overflow: visible;
    z-index: 1;
  }

  .stage :global(.spread-art.bleed) {
    transform: scale(1.06);
  }

  .hotspot {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 25%;
    border: none;
    padding: 0;
    margin: 0;
    background: transparent;
    cursor: pointer;
    z-index: 2;
  }

  .hotspot.left {
    left: 0;
  }

  .hotspot.right {
    right: 0;
  }

  .hotspot:focus-visible {
    outline: none;
    background: color-mix(in srgb, var(--line-bent) 8%, transparent);
  }

  .prose {
    max-width: 34rem;
    width: 100%;
    margin-inline: auto;
    text-align: center;
    padding-inline: 1rem;
    min-height: 0;
    max-height: min(28vh, 11.5rem);
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
  }

  .escape-top .prose {
    position: relative;
    z-index: 2;
  }

  .line {
    margin: 0 0 0.55em;
    font-family: var(--font-body);
    font-size: clamp(0.98rem, 1.9vw, 1.15rem);
    line-height: 1.5;
    color: var(--ink);
    letter-spacing: 0.01em;
    opacity: 0;
    animation: prose-in 0.7s ease forwards;
    animation-delay: calc(0.35s + var(--i) * 0.18s);
  }

  .line.lead {
    font-size: clamp(1.05rem, 2.2vw, 1.28rem);
  }

  .pause-first .line:first-child {
    margin-bottom: 1.4em;
    animation-delay: 0.25s;
  }

  .pause-first .line:not(:first-child) {
    animation-delay: calc(1.1s + var(--i) * 0.22s);
  }

  @keyframes page-in {
    from {
      opacity: 0;
      transform: translateX(var(--page-delta, 18px));
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
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
    .spread {
      animation: none;
    }

    .line {
      opacity: 1;
      animation: none;
    }
  }

  @media (max-width: 720px) {
    .spread {
      grid-template-rows: minmax(0, 1fr) minmax(0, auto);
    }

    .stage {
      width: min(100%, 48vh);
    }

    .prose {
      max-height: min(32vh, 12rem);
    }
  }

  @media print {
    .hotspot {
      display: none !important;
    }

    .prose {
      max-height: none;
      overflow: visible;
    }
  }
</style>
