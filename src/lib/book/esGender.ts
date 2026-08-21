import type { EsGender } from './lang'

/**
 * Spanish templates use {{tokens}}.
 *
 * *línea* / *líneas* and words that agree with them stay feminine always.
 * DEV F/M only flips the title: La Doblada / El Doblado.
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
  /** Agrees with *línea* — always feminine in story sentences. */
  doblado: 'doblada',
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

/** Book title epithet only — flips with F/M. */
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
