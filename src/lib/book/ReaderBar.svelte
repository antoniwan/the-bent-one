<script lang="ts">
  import { pages } from './spreads'
  import type { BookLocation } from './paths'

  interface Props {
    location: BookLocation
    onPrev: () => void
    onNext: () => void
    onFirst: () => void
    onLast: () => void
    onGoPage: (index: number) => void
  }

  let { location, onPrev, onNext, onFirst, onLast, onGoPage }: Props = $props()

  const isCover = $derived(location.kind === 'cover')
  const isBack = $derived(location.kind === 'back')
  const storyNumber = $derived(
    location.kind === 'page' ? location.index + 1 : null,
  )
  const pageLabel = $derived.by(() => {
    if (location.kind === 'cover') return 'Cover'
    if (location.kind === 'front') return 'Before we begin'
    if (location.kind === 'back') return 'The end'
    return `Page ${location.index + 1} of ${pages.length}`
  })
  const nextLabel = $derived.by(() => {
    if (location.kind === 'cover' || location.kind === 'front') return 'Next'
    if (location.kind === 'page' && location.index === pages.length - 1)
      return 'Close'
    if (location.kind === 'back') return 'Next'
    return 'Next'
  })
</script>

{#if !isCover}
  <nav class="reader-bar" aria-label="Book navigation">
    <div class="cluster">
      <button
        type="button"
        class="icon-btn"
        onclick={onFirst}
        aria-label="Go to the beginning"
        title="Beginning"
      >
        ⇤
      </button>
      <button
        type="button"
        class="text-btn"
        onclick={onPrev}
        aria-label="Previous page"
      >
        Back
      </button>
    </div>

    <div class="center">
      <p class="page-label">{pageLabel}</p>
      <div class="dots" role="tablist" aria-label="Pages">
        {#each pages as page, i}
          <button
            type="button"
            role="tab"
            class="dot"
            class:active={storyNumber === i + 1}
            class:passed={
              location.kind === 'back' ||
              (location.kind === 'page' && location.index > i)
            }
            aria-label="Page {page.id}: {page.title}"
            aria-current={storyNumber === i + 1 ? 'page' : undefined}
            onclick={() => onGoPage(i)}
          ></button>
        {/each}
      </div>
    </div>

    <div class="cluster end">
      <button
        type="button"
        class="text-btn"
        onclick={onNext}
        disabled={isBack}
        aria-label="Next page"
      >
        {nextLabel}
      </button>
      <button
        type="button"
        class="icon-btn"
        onclick={onLast}
        disabled={isBack}
        aria-label="Go to the end"
        title="End"
      >
        ⇥
      </button>
    </div>
  </nav>
{/if}

<style>
  .reader-bar {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 0.75rem;
    align-items: center;
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--rule);
    flex-shrink: 0;
  }

  .cluster {
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  .cluster.end {
    justify-content: flex-end;
  }

  .center {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.45rem;
    min-width: 0;
  }

  .page-label {
    margin: 0;
    font-family: var(--font-body);
    font-size: 0.78rem;
    color: var(--ink-soft);
  }

  .dots {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.35rem;
  }

  .dot {
    width: 0.55rem;
    height: 0.55rem;
    padding: 0;
    border: none;
    border-radius: 999px;
    background: color-mix(in srgb, var(--ink) 22%, transparent);
    cursor: pointer;
    transition: width 0.2s ease, background 0.2s ease;
  }

  .dot.passed:not(.active) {
    background: color-mix(in srgb, var(--line-bent) 35%, transparent);
  }

  .dot.active {
    width: 1.15rem;
    background: var(--line-bent);
  }

  .dot:hover {
    background: color-mix(in srgb, var(--line-bent) 70%, transparent);
  }

  .text-btn,
  .icon-btn {
    font-family: var(--font-body);
    font-size: 0.9rem;
    background: none;
    border: none;
    color: var(--ink);
    cursor: pointer;
    padding: 0.4rem 0.35rem;
  }

  .icon-btn {
    font-size: 1rem;
    line-height: 1;
    opacity: 0.7;
  }

  .text-btn:disabled,
  .icon-btn:disabled {
    opacity: 0.3;
    cursor: default;
  }

  .text-btn:not(:disabled):hover,
  .icon-btn:not(:disabled):hover {
    color: var(--line-bent);
    opacity: 1;
  }

  @media (max-width: 520px) {
    .reader-bar {
      grid-template-columns: 1fr 1fr;
      grid-template-areas:
        'center center'
        'prev next';
    }

    .center {
      grid-area: center;
    }

    .cluster:first-child {
      grid-area: prev;
    }

    .cluster.end {
      grid-area: next;
    }
  }
</style>
