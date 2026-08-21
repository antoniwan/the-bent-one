<script lang="ts">
  import { tokenizeProse } from './prose'

  interface Props {
    text: string
  }

  let { text }: Props = $props()
  const parts = $derived(tokenizeProse(text))
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
