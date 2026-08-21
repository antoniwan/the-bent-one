export type Lang = 'en' | 'es'

/** Spanish protagonist gender — random each visit; drives línea/trazo agreement. */
export type EsGender = 'm' | 'f'

export type Localized<T> = { en: T; es: T }

export type LocalizedString = Localized<string>
export type LocalizedLines = Localized<string[]>

export function pick<T>(value: Localized<T>, lang: Lang): T {
  return value[lang]
}
