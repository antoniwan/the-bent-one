import type { Lang } from './lang'
import { fillEs } from './esGender'

/** Set at build/deploy time; falls back for local preview. */
export const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/+$/, '') ||
  'https://the-bent-one.vercel.app'

/** Raster social card (PNG). SVG also ships at /og.svg. */
export const SITE_IMAGE = `${SITE_URL}/og.png`
export const SITE_IMAGE_WIDTH = 1200
export const SITE_IMAGE_HEIGHT = 630

export const REPO_URL = 'https://github.com/antoniwan/the-bent-one'
export const AUTHOR_URL = 'https://antonio.builds.software'
export const AUTHOR_NAME = 'Antonio Rodriguez Martinez'
export const AUTHOR_NAME_ES = 'Antonio Rodríguez Martínez'

/** ELI6 copy for crawlers and social cards. */
export const SEO = {
  defaultTitle: 'The Bent One',
  titleEs: fillEs('{{TitleArt}} {{Doblado}}', 'f'),
  description: {
    en: 'A little book about a red line with a bend. You can read it in English or Spanish.',
    es: 'Un cuentito sobre una línea roja con un doblez. Lo puedes leer en inglés o en español.',
  },
  locale: {
    en: 'en_US',
    es: 'es_419',
  },
  imageAlt: {
    en: 'A red line with a little bend.',
    es: 'Una línea roja con un doblez.',
  },
  /** Story pages in the book (not counting cover / front / back). */
  pageCount: 14,
} as const

function setMetaBySelector(
  selector: string,
  attribute: string,
  value: string,
) {
  const el = document.querySelector(selector)
  if (el) el.setAttribute(attribute, value)
}

function setMetaName(name: string, value: string) {
  setMetaBySelector(`meta[name="${name}"]`, 'content', value)
}

function setMetaProperty(property: string, value: string) {
  setMetaBySelector(`meta[property="${property}"]`, 'content', value)
}

/** Keep JSON-LD Book/WebPage names in sync when the reader switches language. */
function updateJsonLd(language: Lang) {
  const script = document.querySelector('script[type="application/ld+json"]')
  if (!script?.textContent) return

  try {
    const data = JSON.parse(script.textContent) as {
      '@graph'?: Array<Record<string, unknown>>
    }
    const title = language === 'es' ? SEO.titleEs : SEO.defaultTitle
    const description = SEO.description[language]
    const langCode = language === 'es' ? 'es' : 'en'

    for (const node of data['@graph'] ?? []) {
      const type = node['@type']
      if (type === 'Book' || type === 'WebPage' || type === 'WebSite') {
        node.name = title
        node.description = description
      }
      if (type === 'WebPage' || type === 'WebSite') {
        node.inLanguage = langCode
      }
      if (type === 'Book') {
        node.inLanguage = ['en', 'es']
      }
    }
    script.textContent = JSON.stringify(data)
  } catch {
    /* ignore malformed ld+json */
  }
}

export function applyDocumentMeta(language: Lang) {
  if (typeof document === 'undefined') return

  const title = language === 'es' ? SEO.titleEs : SEO.defaultTitle
  const description = SEO.description[language]
  const locale = SEO.locale[language]
  const imageAlt = SEO.imageAlt[language]
  const htmlLang = language === 'es' ? 'es' : 'en'

  document.title = title
  document.documentElement.lang = htmlLang

  setMetaName('description', description)
  setMetaName('application-name', title)
  setMetaName('apple-mobile-web-app-title', title)

  setMetaProperty('og:title', title)
  setMetaProperty('og:description', description)
  setMetaProperty('og:locale', locale)
  setMetaProperty('og:url', `${SITE_URL}/`)
  setMetaProperty('og:image', SITE_IMAGE)
  setMetaProperty('og:image:alt', imageAlt)
  setMetaProperty('og:image:type', 'image/png')
  setMetaProperty('og:image:width', String(SITE_IMAGE_WIDTH))
  setMetaProperty('og:image:height', String(SITE_IMAGE_HEIGHT))

  setMetaName('twitter:title', title)
  setMetaName('twitter:description', description)
  setMetaName('twitter:image', SITE_IMAGE)
  setMetaName('twitter:image:alt', imageAlt)

  const canonical = document.querySelector('link[rel="canonical"]')
  if (canonical) canonical.setAttribute('href', `${SITE_URL}/`)

  updateJsonLd(language)
}
