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

    <div class="turn">
      <button
        type="button"
        class="turn-btn prev"
        onclick={onPrev}
        aria-label={ui('previousPage', lang)}
      >
        <span class="chev" aria-hidden="true">‹</span>
        <span class="turn-label">{ui('back', lang)}</span>
      </button>
      <button
        type="button"
        class="turn-btn next"
        onclick={onNext}
        disabled={isBack}
        aria-label={ui('nextPage', lang)}
      >
        <span class="turn-label">{nextLabel}</span>
        <span class="chev" aria-hidden="true">›</span>
      </button>
    </div>

    <div class="jumps">
      <button
        type="button"
        class="jump-btn"
        onclick={onFirst}
        aria-label={ui('goBeginning', lang)}
      >
        {ui('beginning', lang)}
      </button>
      <button
        type="button"
        class="jump-btn"
        onclick={onLast}
        disabled={isBack}
        aria-label={ui('goEnd', lang)}
      >
        {ui('end', lang)}
      </button>
    </div>
  </nav>
{/if}

<style>
  .reader-bar {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 0.55rem;
    align-items: center;
    width: 100%;
    margin-top: var(--content-to-footer, 0.25rem);
    padding-top: 0.45rem;
    border-top: 1px solid var(--rule);
    flex-shrink: 0;
  }

  .meta {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
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
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.55rem;
    width: 100%;
  }

  .turn-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    min-height: 3rem;
    padding: 0.65rem 0.85rem;
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

  .turn-btn.next {
    border-color: color-mix(in srgb, var(--line-bent) 45%, var(--rule));
    background: color-mix(in srgb, var(--line-bent) 10%, var(--paper));
  }

  .turn-btn:hover:not(:disabled) {
    background: color-mix(in srgb, var(--ink) 6%, var(--paper));
  }

  .turn-btn.next:hover:not(:disabled) {
    background: color-mix(in srgb, var(--line-bent) 16%, var(--paper));
  }

  .turn-btn:active:not(:disabled) {
    transform: translateY(1px);
  }

  .turn-btn:disabled {
    opacity: 0.35;
    cursor: default;
  }

  .chev {
    font-size: 1.45rem;
    line-height: 1;
    font-weight: 500;
  }

  .jumps {
    display: flex;
    justify-content: space-between;
    gap: 0.75rem;
    padding-inline: 0.15rem;
  }

  .jump-btn {
    min-height: 2rem;
    padding: 0.25rem 0.4rem;
    border: none;
    border-radius: 0.35rem;
    background: none;
    color: var(--ink-soft);
    font-family: var(--font-body);
    font-size: 0.72rem;
    letter-spacing: 0.02em;
    text-decoration: underline;
    text-underline-offset: 0.18em;
    text-decoration-color: color-mix(in srgb, var(--ink) 22%, transparent);
    cursor: pointer;
    touch-action: manipulation;
  }

  .jump-btn:hover:not(:disabled) {
    color: var(--ink);
  }

  .jump-btn:disabled {
    opacity: 0.35;
    cursor: default;
    text-decoration: none;
  }

  @media (min-width: 521px) {
    .reader-bar {
      grid-template-columns: auto minmax(0, 1fr) auto;
      grid-template-areas: 'prev meta next' 'jump jump jump';
      gap: 0.65rem 0.75rem;
      align-items: center;
    }

    .meta {
      grid-area: meta;
    }

    .dots {
      display: flex;
    }

    .turn {
      display: contents;
    }

    .turn-btn.prev {
      grid-area: prev;
      min-width: 7.5rem;
    }

    .turn-btn.next {
      grid-area: next;
      min-width: 7.5rem;
    }

    .jumps {
      grid-area: jump;
      justify-content: center;
      gap: 1.25rem;
    }

    .turn-btn {
      min-height: 2.65rem;
      font-size: 0.98rem;
    }
  }
</style>
