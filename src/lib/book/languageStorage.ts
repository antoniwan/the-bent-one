import type { Lang } from './lang'

const LANGUAGE_KEY = 'the-bent-one:lang'

export function readSavedLanguage(): Lang {
  try {
    const raw = localStorage.getItem(LANGUAGE_KEY)
    if (raw === 'es' || raw === 'en') return raw
  } catch {
    /* ignore */
  }
  return 'en'
}

export function saveLanguage(language: Lang) {
  try {
    localStorage.setItem(LANGUAGE_KEY, language)
  } catch {
    /* ignore */
  }
}
