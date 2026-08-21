<script lang="ts">
  import type { EsGender } from './lang'
  import { langState, setEsGender } from './language.svelte'

  const gender = $derived(langState.esGender)
  const lang = $derived(langState.current)

  const options: { id: EsGender; label: string; hint: string }[] = [
    { id: 'f', label: 'F', hint: 'línea' },
    { id: 'm', label: 'M', hint: 'trazo' },
  ]
</script>

{#if import.meta.env.DEV}
  <div
    class="dev-es-gender"
    class:dim={lang !== 'es'}
    role="group"
    aria-label="DEV Spanish gender"
    title="DEV only: Spanish agreement (F = línea, M = trazo)"
  >
    <span class="tag">DEV ES</span>
    {#each options as option}
      <button
        type="button"
        class="opt"
        class:active={gender === option.id}
        aria-pressed={gender === option.id}
        aria-label="Spanish {option.hint}"
        onclick={() => setEsGender(option.id)}
      >
        {option.label}
      </button>
    {/each}
  </div>
{/if}

<style>
  .dev-es-gender {
    position: fixed;
    z-index: 1000;
    right: 0.75rem;
    top: 0.75rem;
    display: inline-flex;
    align-items: center;
    gap: 0.15rem;
    padding: 0.2rem 0.25rem 0.2rem 0.45rem;
    border-radius: 999px;
    background: color-mix(in srgb, #1a1a1a 88%, transparent);
    color: #f5f5f5;
    box-shadow: 0 2px 10px color-mix(in srgb, #000 28%, transparent);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  }

  .dev-es-gender.dim {
    opacity: 0.55;
  }

  .tag {
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    opacity: 0.75;
    margin-right: 0.15rem;
  }

  .opt {
    font: inherit;
    font-size: 0.7rem;
    font-weight: 700;
    border: none;
    border-radius: 999px;
    padding: 0.28rem 0.5rem;
    background: transparent;
    color: inherit;
    opacity: 0.65;
    cursor: pointer;
  }

  .opt.active {
    background: #f5f5f5;
    color: #1a1a1a;
    opacity: 1;
  }

  .opt:hover:not(.active) {
    opacity: 1;
  }
</style>
