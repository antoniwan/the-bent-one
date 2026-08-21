import { readSavedLanguage, saveLanguage } from './languageStorage'
import type { EsGender, Lang } from './lang'
import { applyDocumentMeta } from './seo'

function initialLang(): Lang {
  if (typeof window === 'undefined') return 'en'
  return readSavedLanguage()
}

/**
 * Active language and Spanish agreement gender.
 * Gender defaults to feminine; DEV UI can override for local preview.
 * Document / OG titles stay feminine (see seo.ts).
 */
export const langState = $state({
  current: initialLang() as Lang,
  esGender: 'f' as EsGender,
})

export function setLanguage(next: Lang) {
  if (langState.current === next) return
  langState.current = next
  saveLanguage(next)
  applyDocumentMeta(next)
}

export function setEsGender(next: EsGender) {
  if (langState.esGender === next) return
  langState.esGender = next
}

export function initLanguage() {
  const saved = readSavedLanguage()
  langState.current = saved
  langState.esGender = 'f'
  applyDocumentMeta(saved)
}
