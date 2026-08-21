<script lang="ts">
  import { pages } from './spreads'
  import type { BookLocation } from './paths'
  import { langState, setLanguage } from './language.svelte'
  import { pick } from './lang'
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
    <div class="cluster">
      <button
        type="button"
        class="icon-btn"
        onclick={onFirst}
        aria-label={ui('goBeginning', lang)}
        title={ui('beginning', lang)}
      >
        ⇤
      </button>
      <button
        type="button"
        class="text-btn"
        onclick={onPrev}
        aria-label={ui('previousPage', lang)}
      >
        {ui('back', lang)}
      </button>
    </div>

    <div class="center">
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
            aria-label="{page.id}: {pick(page.title, lang)}"
            aria-current={storyNumber === i + 1 ? 'page' : undefined}
            onclick={() => onGoPage(i)}
          ></button>
        {/each}
      </div>
      <LanguageToggle language={lang} onChange={setLanguage} />
    </div>

    <div class="cluster end">
      <button
        type="button"
        class="text-btn"
        onclick={onNext}
        disabled={isBack}
        aria-label={ui('nextPage', lang)}
      >
        {nextLabel}
      </button>
      <button
        type="button"
        class="icon-btn"
        onclick={onLast}
        disabled={isBack}
        aria-label={ui('goEnd', lang)}
        title={ui('end', lang)}
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
    width: 100%;
    margin-top: var(--content-to-footer, 0.25rem);
    padding-top: 0.4rem;
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
    border-radius: 0.35rem;
  }

  .text-btn:hover,
  .icon-btn:hover {
    background: color-mix(in srgb, var(--ink) 6%, transparent);
  }

  .text-btn:disabled,
  .icon-btn:disabled {
    opacity: 0.35;
    cursor: default;
  }

  .text-btn:disabled:hover,
  .icon-btn:disabled:hover {
    background: none;
  }

  @media (max-width: 520px) {
    .reader-bar {
      grid-template-columns: 1fr;
      gap: 0.55rem;
    }

    .cluster,
    .cluster.end {
      justify-content: center;
    }
  }
</style>
