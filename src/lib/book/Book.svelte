<script lang="ts">
  import { spreads } from './spreads'
  import Spread from './Spread.svelte'

  type Screen = 'cover' | 'endpapers' | 'spread' | 'back'

  let screen = $state<Screen>('cover')
  let index = $state(0)
  let playKey = $state(0)

  const spread = $derived(spreads[index])
  const progress = $derived.by(() => {
    if (screen === 'spread') return (index + 1) / spreads.length
    if (screen === 'back') return 1
    return 0
  })

  function goCover() {
    screen = 'cover'
  }

  function openBook() {
    screen = 'endpapers'
    playKey += 1
  }

  function startReading() {
    screen = 'spread'
    index = 0
    playKey += 1
  }

  function next() {
    if (screen === 'cover') {
      openBook()
      return
    }
    if (screen === 'endpapers') {
      startReading()
      return
    }
    if (screen === 'spread') {
      if (index < spreads.length - 1) {
        index += 1
        playKey += 1
      } else {
        screen = 'back'
        playKey += 1
      }
    }
  }

  function prev() {
    if (screen === 'back') {
      screen = 'spread'
      index = spreads.length - 1
      playKey += 1
      return
    }
    if (screen === 'spread') {
      if (index > 0) {
        index -= 1
        playKey += 1
      } else {
        screen = 'endpapers'
        playKey += 1
      }
      return
    }
    if (screen === 'endpapers') {
      goCover()
    }
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      next()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      prev()
    } else if (e.key === 'Home') {
      goCover()
    }
  }
</script>

<svelte:window onkeydown={onKey} />

<div class="book" style="--progress: {progress}">
  <header class="top">
    <p class="brand">The Bent One</p>
    {#if screen === 'spread'}
      <p class="meta" aria-live="polite">
        <span class="num">{String(spread.id).padStart(2, '0')}</span>
        <span class="title">{spread.title}</span>
      </p>
    {:else}
      <p class="meta quiet">
        {#if screen === 'cover'}A picture book
        {:else if screen === 'endpapers'}Keep in view
        {:else}The end
        {/if}
      </p>
    {/if}
  </header>

  <main class="page">
    {#if screen === 'cover'}
      <section class="cover-screen">
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
        <h1>The Bent One</h1>
        <p class="deck">
          Find the line with the bend in it. It is red. Everything else is black.
        </p>
        <button type="button" class="cta" onclick={openBook}>Open the book</button>
      </section>
    {:else if screen === 'endpapers'}
      <section class="endpaper">
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
        <p class="rule-label">The rule of the world</p>
        <p class="rule">
          Everything is made of visible, separable line segments, and you can always
          see the joints.
        </p>
        <button type="button" class="cta" onclick={startReading}>Begin</button>
      </section>
    {:else if screen === 'spread'}
      <Spread {spread} {playKey} />
    {:else}
      <section class="back-screen">
        <div class="back-dots" aria-hidden="true">
          <span></span><span></span><span></span>
        </div>
        <p class="last">We don’t know which one it was.</p>
        <button type="button" class="cta ghost" onclick={goCover}>Start again</button>
      </section>
    {/if}
  </main>

  <nav class="nav" aria-label="Book navigation">
    <button type="button" class="nav-btn" onclick={prev} disabled={screen === 'cover'}>
      Back
    </button>
    <div class="progress" aria-hidden="true">
      <div class="bar"></div>
    </div>
    <button
      type="button"
      class="nav-btn"
      onclick={next}
      disabled={screen === 'back'}
    >
      {screen === 'cover' || screen === 'endpapers' ? 'Next' : index === spreads.length - 1 ? 'Close' : 'Next'}
    </button>
  </nav>
</div>

<style>
  .book {
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
    margin-bottom: 0.75rem;
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

  .meta {
    margin: 0;
    font-family: var(--font-body);
    font-size: 0.85rem;
    color: var(--ink-soft);
    display: flex;
    gap: 0.65rem;
    align-items: baseline;
  }

  .meta.quiet {
    font-style: italic;
  }

  .num {
    font-variant-numeric: tabular-nums;
    color: var(--line-bent);
    font-weight: 600;
  }

  .page {
    min-height: 0;
    display: flex;
    flex-direction: column;
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

  .cta {
    margin-top: 0.75rem;
    font-family: var(--font-body);
    font-size: 1rem;
    padding: 0.7rem 1.4rem;
    border: 1.5px solid var(--ink);
    background: var(--ink);
    color: var(--paper);
    cursor: pointer;
    transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease;
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

  .rule-label {
    margin: 0;
    font-family: var(--font-display);
    font-size: 0.8rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--line-bent);
  }

  .rule {
    margin: 0;
    max-width: 28rem;
    font-family: var(--font-body);
    font-size: 1.15rem;
    line-height: 1.55;
    color: var(--ink);
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

  .nav {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 1rem;
    align-items: center;
    margin-top: 1rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--rule);
  }

  .nav-btn {
    font-family: var(--font-body);
    font-size: 0.9rem;
    background: none;
    border: none;
    color: var(--ink);
    cursor: pointer;
    padding: 0.4rem 0.2rem;
    min-width: 4rem;
  }

  .nav-btn:disabled {
    opacity: 0.3;
    cursor: default;
  }

  .nav-btn:not(:disabled):hover {
    color: var(--line-bent);
  }

  .progress {
    height: 2px;
    background: var(--rule);
    overflow: hidden;
  }

  .bar {
    height: 100%;
    width: calc(var(--progress) * 100%);
    background: var(--line-bent);
    transition: width 0.4s ease;
  }
</style>
