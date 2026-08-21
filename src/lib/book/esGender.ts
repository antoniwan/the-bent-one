import type { EsGender } from './lang'

/**
 * Only the book title still uses {{tokens}}:
 * {{TitleArt}} {{Doblado}} → La Doblada / El Doblado (DEV F/M).
 * Story Spanish is plain text (*línea*, *doblada*, etc.).
 */
const EPITHET: Record<EsGender, Record<string, string>> = {
  f: {
    TitleArt: 'La',
    Doblado: 'Doblada',
  },
  m: {
    TitleArt: 'El',
    Doblado: 'Doblado',
  },
}

const TOKEN = /\{\{(\w+)\}\}/g

/** Fill remaining title tokens. Other Spanish copy is already plain text. */
export function fillEs(template: string, gender: EsGender = 'f'): string {
  if (!template.includes('{{')) return template
  const epithet = EPITHET[gender]
  return template.replace(TOKEN, (_, key: string) => {
    const value = epithet[key]
    if (value == null) {
      console.warn(`[es] missing title token {{${key}}}`)
      return `{{${key}}}`
    }
    return value
  })
}
