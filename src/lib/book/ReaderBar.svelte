<script lang="ts">
  import { pages } from './spreads'
  import type { BookLocation } from './paths'
  import { langState, setLanguage } from './language.svelte'
  import { resolveString } from './resolve'
  import { pageProgressLabel, ui } from './ui'
  import LanguageToggle from './LanguageToggle.svelte'

  interface Props {
    location: BookLocation
    onPrev: () => void
    onNext: () => void
    onFirst: () => void
    onLast: () => void
    onGoPage: (index: number) => void
  }

  let { location, onPrev, onNext, onFirst, onLast, onGoPage }: Props = $props()

  const lang = $derived(langState.current)
  const gender = $derived(langState.esGender)
  const isCover = $derived(location.kind === 'cover')
  const isBack = $derived(location.kind === 'back')
  const storyNumber = $derived(
    location.kind === 'page' ? location.index + 1 : null,
  )
  const pageLabel = $derived.by(() => {
    if (location.kind === 'cover') return ui('cover', lang)
    if (location.kind === 'front') return ui('beforeWeBegin', lang)
    if (location.kind === 'back') return ui('theEndLabel', lang)
    return pageProgressLabel(lang, location.index, pages.length)
  })
  const nextLabel = $derived.by(() => {
    if (location.kind === 'page' && location.index === pages.length - 1)
      return ui('close', lang)
    return ui('next', lang)
  })
</script>

{#if !isCover}
  <!--
    DOM + book order (also keyboard tab order):
    start → previous page → where you are → next page → end
  -->
  <nav class="reader-bar" aria-label={ui('bookNav', lang)}>
    <button
      type="button"
      class="jump start"
      onclick={onFirst}
      aria-label={ui('goBeginning', lang)}
      title={ui('beginning', lang)}
    >
      <span class="jump-mark" aria-hidden="true">«</span>
      <span class="jump-text">{ui('beginning', lang)}</span>
    </button>

    <button
      type="button"
      class="turn prev"
      onclick={onPrev}
      aria-label={ui('previousPage', lang)}
    >
      <span class="chev" aria-hidden="true">‹</span>
      <span class="turn-label">{ui('back', lang)}</span>
    </button>

    <div class="meta">
      <p class="page-label">{pageLabel}</p>
      <div class="dots" role="tablist" aria-label={ui('pagesNav', lang)}>
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
            aria-label="{page.id}: {resolveString(page.title, lang, gender)}"
            aria-current={storyNumber === i + 1 ? 'page' : undefined}
            onclick={() => onGoPage(i)}
          ></button>
        {/each}
      </div>
      <LanguageToggle language={lang} onChange={setLanguage} />
    </div>

    <button
      type="button"
      class="turn next"
      onclick={onNext}
      disabled={isBack}
      aria-label={ui('nextPage', lang)}
    >
      <span class="turn-label">{nextLabel}</span>
      <span class="chev" aria-hidden="true">›</span>
    </button>

    <button
      type="button"
      class="jump end"
      onclick={onLast}
      disabled={isBack}
      aria-label={ui('goEnd', lang)}
      title={ui('end', lang)}
    >
      <span class="jump-text">{ui('end', lang)}</span>
      <span class="jump-mark" aria-hidden="true">»</span>
    </button>
  </nav>
{/if}

<style>
  .reader-bar {
    display: grid;
    /*
      Mobile default: status strip with jumps as bookends,
      then equal Back | Next — the only chunky CTAs.
    */
    grid-template-columns: auto 1fr 1fr auto;
    grid-template-areas:
      'start meta meta end'
      'prev  prev  next next';
    gap: 0.5rem 0.4rem;
    align-items: center;
    width: 100%;
    margin-top: var(--content-to-footer, 0.25rem);
    padding-top: 0.45rem;
    border-top: 1px solid var(--rule);
    flex-shrink: 0;
  }

  .jump.start {
    grid-area: start;
    justify-self: start;
  }

  .jump.end {
    grid-area: end;
    justify-self: end;
  }

  .turn.prev {
    grid-area: prev;
  }

  .turn.next {
    grid-area: next;
  }

  .meta {
    grid-area: meta;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    min-width: 0;
  }

  .page-label {
    margin: 0;
    font-family: var(--font-body);
    font-size: 0.78rem;
    color: var(--ink-soft);
  }

  .dots {
    display: none;
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
    transition:
      width 0.2s ease,
      background 0.2s ease;
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

  .turn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.3rem;
    width: 100%;
    min-height: 3rem;
    padding: 0.65rem 0.75rem;
    border: 1.5px solid color-mix(in srgb, var(--ink) 18%, transparent);
    border-radius: 0.65rem;
    background: color-mix(in srgb, var(--paper) 88%, white);
    color: var(--ink);
    font-family: var(--font-body);
    font-size: 1.05rem;
    font-weight: 600;
    letter-spacing: 0.01em;
    cursor: pointer;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    transition:
      background 0.18s ease,
      border-color 0.18s ease,
      transform 0.18s ease;
  }

  .turn.next {
    border-color: color-mix(in srgb, var(--line-bent) 45%, var(--rule));
    background: color-mix(in srgb, var(--line-bent) 10%, var(--paper));
  }

  .turn:hover:not(:disabled) {
    background: color-mix(in srgb, var(--ink) 6%, var(--paper));
  }

  .turn.next:hover:not(:disabled) {
    background: color-mix(in srgb, var(--line-bent) 16%, var(--paper));
  }

  .turn:active:not(:disabled) {
    transform: translateY(1px);
  }

  .turn:disabled {
    opacity: 0.35;
    cursor: default;
  }

  .chev {
    font-size: 1.45rem;
    line-height: 1;
    font-weight: 500;
  }

  .jump {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.2rem;
    min-width: 2.25rem;
    min-height: 2.25rem;
    padding: 0.35rem;
    border: none;
    border-radius: 0.35rem;
    background: none;
    color: var(--ink-soft);
    font-family: var(--font-body);
    font-size: 0.7rem;
    letter-spacing: 0.01em;
    cursor: pointer;
    touch-action: manipulation;
  }

  .jump-mark {
    font-size: 1.15rem;
    line-height: 1;
    opacity: 0.8;
  }

  .jump:hover:not(:disabled) {
    color: var(--ink);
  }

  .jump:disabled {
    opacity: 0.35;
    cursor: default;
  }

  @media (max-width: 520px) {
    /*
      Phones: Back/Next only as real CTAs. Keep a single quiet jump (End)
      — Beginning is redundant with stepping back / “Start again”.
    */
    .jump.start {
      display: none;
    }

    .reader-bar {
      grid-template-columns: minmax(0, 1fr) auto;
      grid-template-areas:
        'meta end'
        'prev next';
    }

    .jump-text {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  }

  /*
    Desktop: one rail in book order
    [« Beginning] [‹ Back] | status | [Next ›] [End »]
  */
  @media (min-width: 521px) {
    .reader-bar {
      grid-template-columns: auto auto minmax(0, 1fr) auto auto;
      grid-template-areas: 'start prev meta next end';
      gap: 0.45rem 0.4rem;
    }

    .dots {
      display: flex;
    }

    .turn {
      width: auto;
      min-width: 6.75rem;
      min-height: 2.65rem;
      font-size: 0.98rem;
    }

    .jump {
      min-width: 0;
      min-height: 2.4rem;
      padding: 0.35rem 0.45rem;
      font-size: 0.72rem;
    }

    .jump-mark {
      font-size: 0.95rem;
    }

    .jump-text {
      text-decoration: underline;
      text-underline-offset: 0.16em;
      text-decoration-color: color-mix(in srgb, var(--ink) 20%, transparent);
    }
  }
</style>
