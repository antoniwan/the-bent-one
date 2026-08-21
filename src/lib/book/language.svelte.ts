import { readSavedLanguage, saveLanguage } from './languageStorage'
import type { Lang } from './lang'
import { applyDocumentMeta } from './seo'

function initialLang(): Lang {
  if (typeof window === 'undefined') return 'en'
  return readSavedLanguage()
}

/** Active reader language. */
export const langState = $state({
  current: initialLang() as Lang,
})

export function setLanguage(next: Lang) {
  if (langState.current === next) return
  langState.current = next
  saveLanguage(next)
  applyDocumentMeta(next)
}

export function initLanguage() {
  const saved = readSavedLanguage()
  langState.current = saved
  applyDocumentMeta(saved)
}
