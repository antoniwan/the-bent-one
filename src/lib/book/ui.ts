import type { Lang, LocalizedString } from './lang'
import { pick } from './lang'

const UI = {
  beforeWeBegin: { en: 'Before we begin', es: 'Antes de empezar' },
  begin: { en: 'Begin', es: 'Empezar' },
  continueReading: { en: 'Continue reading', es: 'Seguir leyendo' },
  startAgain: { en: 'Start again', es: 'Empezar de nuevo' },
  theEnd: { en: 'The End', es: 'Fin' },
  cover: { en: 'Cover', es: 'Portada' },
  theEndLabel: { en: 'The end', es: 'El final' },
  by: { en: 'by', es: 'por' },
  back: { en: 'Back', es: 'Atrás' },
  next: { en: 'Next', es: 'Siguiente' },
  close: { en: 'Close', es: 'Cerrar' },
  more: { en: 'More ↓', es: 'Más ↓' },
  language: { en: 'Language', es: 'Idioma' },
  goBeginning: { en: 'Go to the beginning', es: 'Ir al principio' },
  goEnd: { en: 'Go to the end', es: 'Ir al final' },
  previousPage: { en: 'Previous page', es: 'Página anterior' },
  nextPage: { en: 'Next page', es: 'Página siguiente' },
  pagesNav: { en: 'Pages', es: 'Páginas' },
  bookNav: { en: 'Book navigation', es: 'Navegación del libro' },
  beginning: { en: 'Beginning', es: 'Principio' },
  end: { en: 'End', es: 'Final' },
  english: { en: 'EN', es: 'EN' },
  spanish: { en: 'ES', es: 'ES' },
} as const satisfies Record<string, LocalizedString>

export type UiKey = keyof typeof UI

export function ui(key: UiKey, lang: Lang): string {
  return pick(UI[key], lang)
}

export function pageOfLabel(
  lang: Lang,
  pageId: number,
  total: number,
  title: string,
): string {
  if (lang === 'es') return `Página ${pageId} de ${total}: ${title}`
  return `Page ${pageId} of ${total}: ${title}`
}

export function pageProgressLabel(
  lang: Lang,
  index: number,
  total: number,
): string {
  if (lang === 'es') return `Página ${index + 1} de ${total}`
  return `Page ${index + 1} of ${total}`
}
