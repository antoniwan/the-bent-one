<script lang="ts">
  import { onMount } from 'svelte'
  import { BOOK, pages } from './spreads'
  import Spread from './Spread.svelte'
  import ReaderBar from './ReaderBar.svelte'
  import {
    liveLabel,
    locationToStep,
    pathForLocation,
    stepToLocation,
    type BookLocation,
  } from './paths'
  import {
    canResume,
    goRelative,
    navigateTo,
    readResumeStep,
    saveStep,
    syncLocationFromUrl,
  } from './storage'

  let location = $state<BookLocation>({ kind: 'cover' })
  let direction = $state<1 | -1>(1)
  let playKey = $state(0)
  let resumeStep = $state(0)

  const page = $derived(
    location.kind === 'page' ? pages[location.index] : null,
  )
  const announcement = $derived(liveLabel(location))
  const showContinue = $derived(canResume(resumeStep))

  function go(loc: BookLocation, dir?: 1 | -1, replace = false) {
    const result = navigateTo(loc, { direction: dir, replace })
    location = result.location
    direction = result.direction
    playKey += 1
    resumeStep = locationToStep(location)
  }

  function next() {
    if (location.kind === 'back') return
    go(goRelative(location, 1), 1)
  }

  function prev() {
    if (location.kind === 'cover') return
    go(goRelative(location, -1), -1)
  }

  function goFirst() {
    go({ kind: 'cover' }, -1)
  }

  function goLast() {
    go({ kind: 'back' }, 1)
  }

  function goPage(index: number) {
    const current = locationToStep(location)
    const nextStep = locationToStep({ kind: 'page', index })
    go({ kind: 'page', index }, nextStep >= current ? 1 : -1)
  }

  function openBook() {
    go({ kind: 'front' }, 1)
  }

  function continueReading() {
    go(stepToLocation(resumeStep), 1)
  }

  function startReading() {
    go({ kind: 'page', index: 0 }, 1)
  }

  function onKey(e: KeyboardEvent) {
    const tag = (e.target as HTMLElement | null)?.tagName
    if (
      tag === 'INPUT' ||
      tag === 'TEXTAREA' ||
      (e.target as HTMLElement | null)?.isContentEditable
    ) {
      return
    }

    if (
      e.key === 'ArrowRight' ||
      e.key === ' ' ||
      e.key === 'Enter' ||
      e.key === 'PageDown'
    ) {
      e.preventDefault()
      next()
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault()
      prev()
    } else if (e.key === 'Home') {
      e.preventDefault()
      goFirst()
    } else if (e.key === 'End') {
      e.preventDefault()
      goLast()
    }
  }

  onMount(() => {
    resumeStep = readResumeStep()
    const fromUrl = syncLocationFromUrl()
    location = fromUrl
    saveStep(locationToStep(fromUrl))
    playKey += 1

    const onPop = () => {
      const loc = syncLocationFromUrl()
      const nextStep = locationToStep(loc)
      const prevStep = locationToStep(location)
      direction = nextStep >= prevStep ? 1 : -1
      location = loc
      playKey += 1
      resumeStep = nextStep
      saveStep(nextStep)
    }

    let startX = 0
    let startY = 0

    const onTouchStart = (event: TouchEvent) => {
      startX = event.changedTouches[0].clientX
      startY = event.changedTouches[0].clientY
    }

    const onTouchEnd = (event: TouchEvent) => {
      const dx = event.changedTouches[0].clientX - startX
      const dy = event.changedTouches[0].clientY - startY
      if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return
      if (dx < 0) next()
      else prev()
    }

    window.addEventListener('popstate', onPop)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('popstate', onPop)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  })
</script>

<svelte:window onkeydown={onKey} />

<div class="book">
  <header class="top">
    <p class="brand">
      <a href={pathForLocation({ kind: 'cover' })} onclick={(e) => { e.preventDefault(); goFirst() }}>
        {BOOK.title}
      </a>
    </p>
    <p class="meta">
      {#if location.kind === 'page' && page}
        <span class="num">{String(page.id).padStart(2, '0')}</span>
        <span class="title">{page.title}</span>
      {:else if location.kind === 'front'}
        <span class="quiet">Before we begin</span>
      {:else if location.kind === 'back'}
        <span class="quiet">The end</span>
      {/if}
    </p>
  </header>

  <p class="sr-only" aria-live="polite">{announcement}</p>

  <main
    class="stage-main"
    style="--page-delta: {direction > 0 ? '18px' : '-18px'}"
  >
    {#key playKey}
      {#if location.kind === 'cover'}
        <section class="cover-screen screen-in">
          <div class="cover-stage">
            <svg viewBox="0 0 1000 1000" class="cover-art" aria-hidden="true">
              <path
                class="cover-line"
                d="M 420 470 L 452 472 L 460 461 L 468 471 L 540 470"
                fill="none"
                stroke="var(--line-bent)"
                stroke-width="2.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <p class="eyebrow">{BOOK.kind}</p>
          <h1>{BOOK.title}</h1>
          <p class="deck">{BOOK.deck}</p>
          <p class="byline">by {BOOK.author}</p>
          <div class="cta-row">
            <button type="button" class="cta" onclick={openBook}>Before we begin</button>
            {#if showContinue}
              <button type="button" class="cta ghost" onclick={continueReading}>
                Continue reading
              </button>
            {/if}
          </div>
        </section>
      {:else if location.kind === 'front'}
        <section class="endpaper screen-in">
          <div class="end-visual" aria-hidden="true">
            <svg viewBox="0 0 400 200">
              <path
                d="M 40 100 L 120 100"
                fill="none"
                stroke="var(--line-ink)"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M 160 100 L 200 100 L 210 88 L 220 100 L 280 100"
                fill="none"
                stroke="var(--line-bent)"
                stroke-width="2.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M 320 100 L 360 100"
                fill="none"
                stroke="var(--line-ink)"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </div>
          <div class="rule">
            {#each BOOK.rule as para}
              <p>{para}</p>
            {/each}
          </div>
          <button type="button" class="cta" onclick={startReading}>Begin</button>
        </section>
      {:else if location.kind === 'page' && page}
        <Spread
          spread={page}
          {playKey}
          {direction}
          onPrev={prev}
          onNext={next}
        />
      {:else}
        <section class="back-screen screen-in">
          <div class="back-dots" aria-hidden="true">
            <span></span><span></span><span></span>
          </div>
          <p class="last">We don’t know which one it was.</p>
          <p class="credit">{BOOK.credit} · {BOOK.author}</p>
          <button type="button" class="cta ghost" onclick={goFirst}>Start again</button>
        </section>
      {/if}
    {/key}
  </main>

  <ReaderBar
    {location}
    onPrev={prev}
    onNext={next}
    onFirst={goFirst}
    onLast={goLast}
    onGoPage={goPage}
  />
</div>

<style>
  .book {
    position: relative;
    display: grid;
    grid-template-rows: auto 1fr auto;
    min-height: 100svh;
    max-width: 960px;
    margin-inline: auto;
    padding: clamp(0.75rem, 2vw, 1.5rem);
    box-sizing: border-box;
  }

  .top {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
    margin-bottom: 0.5rem;
    border-bottom: 1px solid var(--rule);
    padding-bottom: 0.65rem;
  }

  .brand {
    margin: 0;
    font-family: var(--font-display);
    font-size: 0.95rem;
    letter-spacing: 0.04em;
    color: var(--ink);
  }

  .brand a {
    color: inherit;
    text-decoration: none;
  }

  .brand a:hover {
    color: var(--line-bent);
  }

  .meta {
    margin: 0;
    font-family: var(--font-body);
    font-size: 0.85rem;
    color: var(--ink-soft);
    display: flex;
    gap: 0.65rem;
    align-items: baseline;
  }

  .quiet {
    font-style: italic;
  }

  .num {
    font-variant-numeric: tabular-nums;
    color: var(--line-bent);
    font-weight: 600;
  }

  .sr-only {
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

  .stage-main {
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  .screen-in {
    animation: page-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .cover-screen,
  .endpaper,
  .back-screen {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 1rem;
    padding: 1rem;
  }

  .cover-stage {
    width: min(280px, 55vw);
    aspect-ratio: 1;
    background: var(--paper);
    border: 1px solid var(--rule);
    margin-bottom: 0.5rem;
    display: grid;
    place-items: center;
  }

  .cover-art {
    width: 100%;
    height: 100%;
  }

  .cover-line {
    stroke-dasharray: 160;
    stroke-dashoffset: 160;
    animation: draw-cover 1.6s cubic-bezier(0.22, 1, 0.36, 1) 0.3s forwards;
  }

  @keyframes draw-cover {
    to {
      stroke-dashoffset: 0;
    }
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

  .eyebrow {
    margin: 0;
    font-family: var(--font-display);
    font-size: 0.8rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ink-soft);
  }

  h1 {
    margin: 0;
    font-family: var(--font-display);
    font-weight: 500;
    font-size: clamp(2.4rem, 8vw, 4rem);
    letter-spacing: -0.03em;
    line-height: 1.05;
    color: var(--ink);
  }

  .deck {
    margin: 0;
    max-width: 26rem;
    font-family: var(--font-body);
    font-size: 1.1rem;
    line-height: 1.5;
    color: var(--ink-soft);
  }

  .byline {
    margin: 0;
    font-family: var(--font-body);
    font-size: 0.95rem;
    color: var(--ink-soft);
  }

  .cta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: center;
    margin-top: 0.5rem;
  }

  .cta {
    font-family: var(--font-body);
    font-size: 1rem;
    padding: 0.7rem 1.4rem;
    border: 1.5px solid var(--ink);
    background: var(--ink);
    color: var(--paper);
    cursor: pointer;
    transition:
      transform 0.2s ease,
      background 0.2s ease,
      color 0.2s ease;
  }

  .cta:hover {
    transform: translateY(-1px);
  }

  .cta.ghost {
    background: transparent;
    color: var(--ink);
  }

  .cta.ghost:hover {
    background: var(--ink);
    color: var(--paper);
  }

  .end-visual {
    width: min(360px, 90vw);
    margin-bottom: 0.5rem;
  }

  .end-visual svg {
    width: 100%;
    height: auto;
  }

  .rule {
    margin: 0;
    max-width: 30rem;
    font-family: var(--font-body);
    font-size: clamp(1.05rem, 2.2vw, 1.2rem);
    line-height: 1.55;
    color: var(--ink);
    text-align: center;
  }

  .rule p {
    margin: 0 0 0.85em;
  }

  .rule p:last-child {
    margin-bottom: 0;
  }

  .back-dots {
    display: flex;
    gap: 4.5rem;
    margin-bottom: 1.5rem;
  }

  .back-dots span {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--line-ink);
    opacity: 0.55;
  }

  .back-dots span:nth-child(2) {
    background: var(--line-bent);
  }

  .last {
    margin: 0;
    font-family: var(--font-body);
    font-size: 1.25rem;
    color: var(--ink-soft);
    font-style: italic;
  }

  .credit {
    margin: 0;
    font-size: 0.9rem;
    color: var(--ink-soft);
  }

  @media (prefers-reduced-motion: reduce) {
    .screen-in {
      animation: none;
    }
  }

  @media print {
    .top,
    :global(.reader-bar),
    .cta-row,
    .cta {
      display: none !important;
    }
  }
</style>
