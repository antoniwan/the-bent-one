<script lang="ts">
  import { tick } from 'svelte'
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

  let proseEl: HTMLDivElement | undefined = $state()
  let moreBelow = $state(false)

  function updateScrollCue() {
    const el = proseEl
    if (!el) {
      moreBelow = false
      return
    }
    const leftover = el.scrollHeight - el.clientHeight - el.scrollTop
    moreBelow = leftover > 8
  }

  $effect(() => {
    // Re-measure when page or draw cycle changes
    void spread.id
    void playKey
    void tick().then(() => {
      updateScrollCue()
      requestAnimationFrame(updateScrollCue)
    })
  })
</script>

<article
  class="spread"
  class:from-next={direction < 0}
  class:from-prev={direction > 0}
  class:escape-top={spread.id === 4}
  data-spread={spread.id}
  style="--page-delta: {direction > 0 ? '18px' : '-18px'}"
>
  <div class="stage-slot">
    <div class="stage" class:escape={spread.id === 4} class:boom={spread.id === 10}>
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
  </div>
  <div class="prose-shell" class:has-more={moreBelow}>
    <div
      class="prose"
      class:pause-first={spread.id === 12}
      bind:this={proseEl}
      onscroll={updateScrollCue}
    >
      {#each spread.text as line, i}
        <p
          class="line"
          class:lead={i === 0}
          class:wiggle={spread.id === 9 && line.startsWith('What is even')}
          style="--i: {i}"
        >
          <ProseText text={line} />
        </p>
      {/each}
    </div>
    {#if moreBelow}
      <div class="scroll-cue" aria-hidden="true">
        <span class="scroll-cue-label">More ↓</span>
      </div>
    {/if}
    {#if spread.id === 14}
      <p class="the-end">The End</p>
    {/if}
  </div>
</article>

<style>
  .spread {
    --section-pad: clamp(0.5rem, 1.6vh, 1rem);
    --section-gap: clamp(0.65rem, 2vh, 1.15rem);
    display: grid;
    /* Picture and words share the page — neither eats the other */
    grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
    height: 100%;
    min-height: 0;
    gap: var(--section-gap);
    animation: page-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .spread.escape-top {
    overflow: visible;
  }

  .stage-slot {
    min-height: 0;
    width: 100%;
    box-sizing: border-box;
    padding: var(--section-pad);
    container-type: size;
    display: grid;
    justify-items: center;
    align-items: center;
  }

  .stage {
    position: relative;
    width: min(100cqw, 100cqh);
    height: min(100cqw, 100cqh);
    background:
      radial-gradient(ellipse at 50% 40%, var(--paper-glow) 0%, transparent 70%),
      var(--paper);
    border: 1px solid var(--rule);
    overflow: hidden;
  }

  .stage > :global(.spread-art) {
    width: 100%;
    height: 100%;
    display: block;
  }

  .stage.escape {
    overflow: visible;
    z-index: 1;
  }

  .stage > :global(.spread-art.bleed) {
    transform: scale(1.08);
    transform-origin: center center;
  }

  .stage.boom {
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--line-ink) 8%, transparent);
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

  .prose-shell {
    position: relative;
    width: 100%;
    max-width: none;
    margin-inline: 0;
    min-height: 0;
    box-sizing: border-box;
    padding: var(--section-pad);
    padding-top: calc(var(--section-pad) * 0.65);
    display: flex;
    flex-direction: column;
  }

  .escape-top .prose-shell {
    position: relative;
    z-index: 2;
  }

  .prose {
    flex: 1 1 auto;
    width: 100%;
    text-align: center;
    padding: 0.35rem 0.65rem 0.45rem;
    min-height: 0;
    max-height: none;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    scrollbar-gutter: stable both-edges;
    scrollbar-width: auto;
    scrollbar-color: var(--line-bent) #ddd4c8;
  }

  .prose::-webkit-scrollbar {
    width: 14px;
  }

  .prose::-webkit-scrollbar-track {
    background: #ddd4c8;
    border: 1px solid #b9aea0;
    border-radius: 999px;
    margin-block: 4px;
  }

  .prose::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #d42a3c, var(--line-bent) 55%, #8f0f1c);
    border: 2px solid #f7f4ef;
    border-radius: 999px;
    min-height: 2.25rem;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.18);
  }

  .prose::-webkit-scrollbar-thumb:hover {
    background: #a81222;
  }

  .prose-shell.has-more::after {
    content: '';
    pointer-events: none;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2.4rem;
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--page-bg) 0%, transparent),
      color-mix(in srgb, var(--page-bg) 92%, transparent)
    );
  }

  .scroll-cue {
    pointer-events: none;
    position: absolute;
    left: 50%;
    bottom: 0.15rem;
    transform: translateX(-50%);
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.2rem 0.65rem;
    border: 1.5px solid var(--line-bent);
    border-radius: 999px;
    background: color-mix(in srgb, var(--paper) 92%, white);
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
    animation: cue-bob 1.4s ease-in-out infinite;
  }

  .scroll-cue-label {
    font-family: var(--font-display);
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    color: var(--line-bent);
    line-height: 1;
  }

  @keyframes cue-bob {
    0%,
    100% {
      transform: translateX(-50%) translateY(0);
    }
    50% {
      transform: translateX(-50%) translateY(3px);
    }
  }

  .line {
    margin: 0 0 0.7em;
    font-family: var(--font-body);
    font-size: clamp(0.98rem, 1.9vw, 1.15rem);
    line-height: 1.55;
    color: var(--ink);
    letter-spacing: 0.01em;
    opacity: 0;
    animation: prose-in 0.7s ease forwards;
    animation-delay: calc(0.35s + var(--i) * 0.18s);
  }

  .line.lead {
    font-size: clamp(1.05rem, 2.2vw, 1.28rem);
  }

  .line.wiggle {
    display: inline-block;
    width: 100%;
    color: var(--line-bent);
    font-family: var(--font-display);
    font-weight: 600;
    animation:
      prose-in 0.7s ease forwards,
      text-wiggle 0.22s steps(2, end) infinite;
    animation-delay:
      calc(0.35s + var(--i) * 0.18s),
      calc(0.35s + var(--i) * 0.18s + 0.7s);
  }

  @keyframes text-wiggle {
    0% {
      transform: translate(0, 0) rotate(0deg);
    }
    25% {
      transform: translate(2px, -2px) rotate(1.2deg);
    }
    50% {
      transform: translate(-2px, 1px) rotate(-1deg);
    }
    75% {
      transform: translate(1px, 2px) rotate(0.6deg);
    }
    100% {
      transform: translate(-1px, -1px) rotate(-0.5deg);
    }
  }

  .the-end {
    margin: 1.25rem 0 0;
    padding-top: 0.85rem;
    border-top: 1px solid var(--rule);
    font-family: var(--font-display);
    font-size: clamp(1.15rem, 2.4vw, 1.45rem);
    font-weight: 600;
    letter-spacing: 0.06em;
    text-align: center;
    color: var(--ink);
    opacity: 0;
    animation: prose-in 0.7s ease forwards;
    animation-delay: 1.4s;
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

    .scroll-cue {
      animation: none;
    }
  }

  @media (max-width: 720px) {
    .spread {
      --section-pad: clamp(0.4rem, 1.4vh, 0.75rem);
      --section-gap: clamp(0.5rem, 1.6vh, 0.85rem);
      /* Slightly more room for art on short phones; copy still a real half */
      grid-template-rows: minmax(0, 1.05fr) minmax(0, 0.95fr);
    }
  }

  @media print {
    .hotspot,
    .scroll-cue {
      display: none !important;
    }

    .prose-shell.has-more::after {
      display: none;
    }

    .prose {
      max-height: none;
      overflow: visible;
    }
  }
</style>
