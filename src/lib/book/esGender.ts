import type { EsGender } from './lang'

/**
 * Spanish templates use {{tokens}}.
 *
 * *línea* / *líneas* and the words that go with them stay feminine in every
 * mode — that is normal speech, not a gender choice.
 *
 * Only the character epithet flips with DEV gender:
 * La Doblada / El Doblado, and doblada / doblado.
 */
const LINE: Record<string, string> = {
  el: 'la',
  El: 'La',
  los: 'las',
  Los: 'Las',
  un: 'una',
  Un: 'Una',
  linea: 'línea',
  Linea: 'Línea',
  lineas: 'líneas',
  Lineas: 'Líneas',
  rojo: 'roja',
  nuestro: 'nuestra',
  Nuestro: 'Nuestra',
  esta: 'esta',
  Esta: 'Esta',
  ella: 'ella',
  mismo: 'misma',
  pequeno: 'pequeña',
  Pequeno: 'Pequeña',
  largo: 'larga',
  largos: 'largas',
  Largos: 'Largas',
  cortos: 'cortas',
  curioso: 'curiosa',
  solo: 'sola',
  delgado: 'delgada',
  delgados: 'delgadas',
  recto: 'recta',
  rectos: 'rectas',
  plano: 'plana',
  planos: 'planas',
  otro: 'otra',
  otros: 'otras',
  Otros: 'Otras',
  todo: 'toda',
  todos: 'todas',
  Todos: 'Todas',
  alguno: 'alguna',
  algunos: 'algunas',
  Algunos: 'Algunas',
  uno: 'una',
  Uno: 'Una',
  ellos: 'ellas',
  demas: 'demás',
  vecino: 'vecina',
  blanditos: 'blanditas',
  chiquito: 'chiquita',
  chiquitos: 'chiquitas',
  rojito: 'rojita',
  ese: 'esa',
  la: 'la',
  lo: 'la',
}

/** Character epithet only — flips with F/M. */
const EPITHET: Record<EsGender, Record<string, string>> = {
  f: {
    TitleArt: 'La',
    doblado: 'doblada',
    Doblado: 'Doblada',
  },
  m: {
    TitleArt: 'El',
    doblado: 'doblado',
    Doblado: 'Doblado',
  },
}

const TOKEN = /\{\{(\w+)\}\}/g

/** Fill `{{token}}` placeholders. Line vocabulary is always feminine. */
export function fillEs(template: string, gender: EsGender = 'f'): string {
  const epithet = EPITHET[gender]
  return template.replace(TOKEN, (_, key: string) => {
    const value = epithet[key] ?? LINE[key]
    if (value == null) {
      console.warn(`[es] missing token {{${key}}}`)
      return `{{${key}}}`
    }
    return value
  })
}
