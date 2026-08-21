<script lang="ts">
  import { onMount } from 'svelte'
  import type { LineColor } from './types'

  interface Props {
    d: string
    color?: LineColor
    weight?: number
    delay?: number
    duration?: number
    opacity?: number
    dashed?: boolean
    dashPattern?: string
    className?: string
    animate?: boolean
    transform?: string
  }

  let {
    d,
    color = 'ink',
    weight = 2,
    delay = 0,
    duration = 0.9,
    opacity = 1,
    dashed = false,
    dashPattern = '6 8',
    className = '',
    animate = true,
    transform,
  }: Props = $props()

  let pathEl: SVGPathElement | undefined = $state()
  let ready = $state(false)

  const stroke = $derived(
    color === 'bent' || color === 'decoy'
      ? 'var(--line-bent)'
      : color === 'ochre'
        ? 'var(--line-ochre)'
        : color === 'water'
          ? 'var(--line-water)'
          : 'var(--line-ink)',
  )

  onMount(() => {
    if (!pathEl || !animate) {
      ready = true
      return
    }
    const length = pathEl.getTotalLength()
    pathEl.style.strokeDasharray = dashed ? dashPattern : `${length}`
    pathEl.style.strokeDashoffset = dashed ? '0' : `${length}`
    // Force layout, then draw
    pathEl.getBoundingClientRect()
    requestAnimationFrame(() => {
      ready = true
      if (!dashed && pathEl) {
        pathEl.style.transition = `stroke-dashoffset ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, opacity ${duration * 0.6}s ease ${delay}s`
        pathEl.style.strokeDashoffset = '0'
        pathEl.style.opacity = String(opacity)
      }
    })
  })
</script>

{#if transform}
  <g {transform}>
    <path
      bind:this={pathEl}
      class="drawn-line {className}"
      class:is-bent={color === 'bent'}
      class:is-ready={ready}
      {d}
      fill="none"
      stroke={stroke}
      stroke-width={weight}
      stroke-linecap="round"
      stroke-linejoin="round"
      opacity={animate && !dashed ? 0 : opacity}
      style={dashed
        ? `stroke-dasharray: ${dashPattern}; opacity: ${opacity}`
        : undefined}
    />
  </g>
{:else}
  <path
    bind:this={pathEl}
    class="drawn-line {className}"
    class:is-bent={color === 'bent'}
    class:is-ready={ready}
    {d}
    fill="none"
    stroke={stroke}
    stroke-width={weight}
    stroke-linecap="round"
    stroke-linejoin="round"
    opacity={animate && !dashed ? 0 : opacity}
    style={dashed
      ? `stroke-dasharray: ${dashPattern}; opacity: ${opacity}`
      : undefined}
  />
{/if}

<style>
  .drawn-line.is-bent {
    /* Keep stroke scaling with the path so long bent sides don’t look cut off */
    vector-effect: none;
    filter: drop-shadow(0 0 0.5px var(--line-bent));
  }

  .drawn-line:not(.is-bent) {
    vector-effect: non-scaling-stroke;
  }
</style>
