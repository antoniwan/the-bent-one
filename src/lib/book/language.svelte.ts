import { readSavedLanguage, saveLanguage } from './languageStorage'
import type { EsGender, Lang } from './lang'
import { randomEsGender } from './esGender'
import { applyDocumentMeta } from './seo'

function initialLang(): Lang {
  if (typeof window === 'undefined') return 'en'
  return readSavedLanguage()
}

/** Shared language + Spanish gender (new gender each full load). */
export const langState = $state({
  current: initialLang() as Lang,
  esGender: 'f' as EsGender,
})

export function setLanguage(next: Lang) {
  if (langState.current === next) return
  langState.current = next
  saveLanguage(next)
  applyDocumentMeta(next, langState.esGender)
}

export function initLanguage() {
  const saved = readSavedLanguage()
  langState.current = saved
  langState.esGender = randomEsGender()
  applyDocumentMeta(saved, langState.esGender)
}
