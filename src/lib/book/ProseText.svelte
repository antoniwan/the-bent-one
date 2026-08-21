<script lang="ts">
  import { tokenizeProse } from './prose'
  import type { Lang } from './lang'

  interface Props {
    text: string
    lang?: Lang
  }

  let { text, lang = 'en' }: Props = $props()
  const parts = $derived(tokenizeProse(text, lang))
</script>

{#each parts as part}
  {#if part.kind === 'geo'}
    <em class="geo">{part.value}</em>
  {:else if part.kind === 'red'}
    <strong class="ink-red">{part.value}</strong>
  {:else if part.kind === 'color'}
    <strong class="ink-color">{part.value}</strong>
  {:else}{part.value}{/if}
{/each}

<style>
  .geo {
    font-style: italic;
    font-synthesis: none;
  }

  .ink-red {
    color: var(--line-bent);
    font-weight: 600;
  }

  /* Illustration line colors on paper: bent, ochre, water, ink */
  .ink-color {
    font-weight: 600;
    animation: prose-color-cycle 3.6s steps(1, end) infinite;
  }

  @keyframes prose-color-cycle {
    0%,
    24.9% {
      color: var(--line-bent);
    }
    25%,
    49.9% {
      color: var(--line-ochre);
    }
    50%,
    74.9% {
      color: var(--line-water);
    }
    75%,
    100% {
      color: var(--line-ink);
    }
  }
</style>
