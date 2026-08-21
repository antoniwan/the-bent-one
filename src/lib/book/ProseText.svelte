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
</style>
