<script lang="ts">
  import DrawnLine from './DrawnLine.svelte'
  import type { LineSpec } from './types'

  interface Props {
    lines: LineSpec[]
    animate?: boolean
    /** Re-key to restart draw animations when spread changes */
    playKey?: string | number
  }

  let { lines, animate = true, playKey = 0 }: Props = $props()
</script>

{#key playKey}
  {#each lines as line (line.id)}
    <DrawnLine
      d={line.d}
      color={line.color}
      weight={line.weight}
      delay={line.delay}
      duration={line.duration}
      opacity={line.opacity}
      dashed={line.dashed}
      dashPattern={line.dashPattern}
      className={line.className}
      {animate}
    />
  {/each}
{/key}
