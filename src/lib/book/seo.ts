import type { Lang } from './lang'
import { fillEs } from './esGender'

/** Set at build/deploy time; falls back for local preview. */
export const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/+$/, '') ||
  'https://the-bent-one.vercel.app'

export const SITE_IMAGE = `${SITE_URL}/og.svg`

export const REPO_URL = 'https://github.com/antoniwan/the-bent-one'

/** Titles and descriptions for document / Open Graph meta. */
export const SEO = {
  defaultTitle: 'The Bent One',
  /** Spanish title (feminine: La Doblada). */
  titleEs: fillEs('{{TitleArt}} {{Doblado}}', 'f'),
  description: {
    en: 'A little book in English and Spanish for one small line with a bend in it — and everything a line might become.',
    es: 'Un cuentito en inglés y español para una pequeña línea con un doblez — y todo lo que una línea puede llegar a ser.',
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

export function applyDocumentMeta(language: Lang) {
  if (typeof document === 'undefined') return

  const title = language === 'es' ? SEO.titleEs : SEO.defaultTitle
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
