<script lang="ts">
  import type { Lang } from './lang'
  import { ui } from './ui'

  interface Props {
    language: Lang
    onChange: (lang: Lang) => void
    compact?: boolean
  }

  let { language, onChange, compact = true }: Props = $props()

  const options = $derived(
    [
      { id: 'en' as const, label: compact ? ui('english', language) : 'English' },
      { id: 'es' as const, label: compact ? ui('spanish', language) : 'Español' },
    ],
  )
</script>

<div class="lang-toggle" role="group" aria-label={ui('language', language)}>
  {#each options as option}
    <button
      type="button"
      class="opt"
      class:active={language === option.id}
      aria-pressed={language === option.id}
      onclick={() => onChange(option.id)}
    >
      {option.label}
    </button>
  {/each}
</div>

<style>
  .lang-toggle {
    display: inline-flex;
    gap: 0.15rem;
    padding: 0.15rem;
    border-radius: 999px;
    background: color-mix(in srgb, var(--ink) 8%, transparent);
  }

  .opt {
    font-family: var(--font-body);
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    border: none;
    border-radius: 999px;
    padding: 0.28rem 0.55rem;
    background: transparent;
    color: var(--ink-soft);
    cursor: pointer;
  }

  .opt.active {
    background: var(--paper);
    color: var(--ink);
    box-shadow: 0 1px 2px color-mix(in srgb, var(--ink) 12%, transparent);
  }

  .opt:hover:not(.active) {
    color: var(--ink);
  }
</style>
