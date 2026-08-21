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
  <nav class="reader-bar" aria-label={ui('bookNav', lang)}>
    <div class="turn-row">
      <button
        type="button"
        class="turn"
        onclick={onPrev}
        aria-label={ui('previousPage', lang)}
      >
        {ui('back', lang)}
      </button>

      <p class="page-label">{pageLabel}</p>

      <button
        type="button"
        class="turn"
        onclick={onNext}
        disabled={isBack}
        aria-label={ui('nextPage', lang)}
      >
        {nextLabel}
      </button>
    </div>

    <div class="extras">
      <LanguageToggle language={lang} onChange={setLanguage} />

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

      <div class="jumps">
        <button
          type="button"
          class="jump"
          onclick={onFirst}
          aria-label={ui('goBeginning', lang)}
        >
          {ui('beginning', lang)}
        </button>
        <button
          type="button"
          class="jump"
          onclick={onLast}
          disabled={isBack}
          aria-label={ui('goEnd', lang)}
        >
          {ui('end', lang)}
        </button>
      </div>
    </div>
  </nav>
{/if}

<style>
  .reader-bar {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
    width: 100%;
    margin-top: var(--content-to-footer, 0.25rem);
    padding-top: 0.45rem;
    border-top: 1px solid var(--rule);
    flex-shrink: 0;
  }

  /* [Back] · page · [Next] — equal sides */
  .turn-row {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 0.5rem;
  }

  .page-label {
    margin: 0;
    text-align: center;
    font-family: var(--font-body);
    font-size: 0.78rem;
    color: var(--ink-soft);
    white-space: nowrap;
  }

  .turn {
    width: 100%;
    min-height: 2.75rem;
    padding: 0.55rem 0.85rem;
    border: 1.5px solid var(--ink);
    background: transparent;
    color: var(--ink);
    font-family: var(--font-body);
    font-size: 0.95rem;
    cursor: pointer;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    transition:
      background 0.2s ease,
      color 0.2s ease;
  }

  .turn-row .turn:first-child,
  .turn-row .turn:last-child {
    justify-self: stretch;
  }

  .turn:hover:not(:disabled) {
    background: var(--ink);
    color: var(--paper);
  }

  .turn:disabled {
    opacity: 0.35;
    cursor: default;
  }

  .extras {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.45rem;
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

  .jumps {
    display: flex;
    justify-content: center;
    gap: 1.25rem;
  }

  .jump {
    padding: 0.2rem 0.15rem;
    border: none;
    background: none;
    color: var(--ink-soft);
    font-family: var(--font-body);
    font-size: 0.72rem;
    letter-spacing: 0.02em;
    text-decoration: underline;
    text-underline-offset: 0.16em;
    text-decoration-color: color-mix(in srgb, var(--ink) 22%, transparent);
    cursor: pointer;
    touch-action: manipulation;
  }

  .jump:hover:not(:disabled) {
    color: var(--ink);
  }

  .jump:disabled {
    opacity: 0.35;
    cursor: default;
    text-decoration: none;
  }

  @media (min-width: 521px) {
    .reader-bar {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      grid-template-areas:
        'prev label next'
        'extras extras extras';
      align-items: center;
      gap: 0.45rem 0.75rem;
    }

    .turn-row {
      display: contents;
    }

    .turn-row .turn:first-child {
      grid-area: prev;
      justify-self: start;
      width: auto;
      min-width: 5.5rem;
    }

    .page-label {
      grid-area: label;
      font-size: 0.82rem;
    }

    .turn-row .turn:last-child {
      grid-area: next;
      justify-self: end;
      width: auto;
      min-width: 5.5rem;
    }

    .extras {
      grid-area: extras;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.85rem 1.25rem;
    }

    .dots {
      display: flex;
    }

    .turn {
      min-width: 5.5rem;
      min-height: 2.5rem;
      font-size: 0.92rem;
    }
  }
</style>
