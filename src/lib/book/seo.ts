import type { EsGender, Lang } from './lang'
import { BOOK } from './spreads'
import { resolveString } from './resolve'

/** Set at build/deploy time; falls back for local preview. */
export const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/+$/, '') ||
  'https://the-bent-one.vercel.app'

export const SITE_IMAGE = `${SITE_URL}/og.svg`

export const REPO_URL = 'https://github.com/antoniwan/the-bent-one'

export const SEO = {
  defaultTitle: BOOK.title.en,
  description: {
    en: 'A little book in English and Spanish for one small line with a bend in it — and everything a line might become.',
    es: 'Un cuentito en inglés y español para una pequeña línea — o un pequeño trazo — con un doblez, y todo lo que puede llegar a ser.',
  },
  locale: {
    en: 'en_US',
    es: 'es_419',
  },
  imageAlt: {
    en: 'A short red line with a bend in the middle on cream paper.',
    es: 'Una corta línea roja con un doblez en el medio sobre papel crema.',
  },
} as const

function setMetaBySelector(
  selector: string,
  attribute: string,
  value: string,
) {
  const el = document.querySelector(selector)
  if (el) el.setAttribute(attribute, value)
}

export function applyDocumentMeta(language: Lang, gender: EsGender = 'f') {
  if (typeof document === 'undefined') return

  const title =
    language === 'es'
      ? resolveString(BOOK.title, 'es', gender)
      : SEO.defaultTitle
  const description = SEO.description[language]
  const locale = SEO.locale[language]
  const imageAlt = SEO.imageAlt[language]

  document.title = title
  document.documentElement.lang = language === 'es' ? 'es' : 'en'

  setMetaBySelector('meta[name="description"]', 'content', description)
  setMetaBySelector('meta[property="og:title"]', 'content', title)
  setMetaBySelector('meta[property="og:description"]', 'content', description)
  setMetaBySelector('meta[property="og:locale"]', 'content', locale)
  setMetaBySelector('meta[property="og:image"]', 'content', SITE_IMAGE)
  setMetaBySelector('meta[property="og:image:alt"]', 'content', imageAlt)
  setMetaBySelector('meta[name="twitter:title"]', 'content', title)
  setMetaBySelector('meta[name="twitter:description"]', 'content', description)
  setMetaBySelector('meta[name="twitter:image"]', 'content', SITE_IMAGE)
  setMetaBySelector('meta[name="twitter:image:alt"]', 'content', imageAlt)
}
