<script lang="ts">
  import { REPO_URL } from './seo'

  interface Props {
    class?: string
  }

  let { class: className = '' }: Props = $props()
</script>

<a
  class="version-stamp {className}"
  href={REPO_URL}
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Version {__APP_VERSION__} — source on GitHub"
>
  v{__APP_VERSION__}
</a>

<style>
  .version-stamp {
    font-family: var(--font-body);
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-decoration: none;
    color: color-mix(in srgb, var(--ink) 15%, transparent);
    user-select: none;
    transition: color 0.2s ease;
  }

  .version-stamp:hover,
  .version-stamp:focus-visible {
    color: color-mix(in srgb, var(--ink) 45%, transparent);
  }

  .version-stamp:focus-visible {
    outline: 2px solid var(--line-bent);
    outline-offset: 2px;
  }
</style>
