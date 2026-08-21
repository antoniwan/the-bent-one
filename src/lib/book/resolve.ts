import type { Lang, LocalizedLines, LocalizedString } from './lang'
import { fillEs } from './esGender'

export function resolveString(value: LocalizedString, lang: Lang): string {
  const raw = value[lang]
  return lang === 'es' ? fillEs(raw) : raw
}

export function resolveLines(value: LocalizedLines, lang: Lang): string[] {
  const raw = value[lang]
  return lang === 'es' ? raw.map((line) => fillEs(line)) : [...raw]
}
