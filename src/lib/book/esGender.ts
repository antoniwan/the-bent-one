/**
 * Spanish story templates use {{tokens}} filled with feminine agreement
 * around *línea* / *líneas* (never *trazo*).
 */
const FORMS: Record<string, string> = {
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
  doblado: 'doblada',
  Doblado: 'Doblada',
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

const TOKEN = /\{\{(\w+)\}\}/g

/** Fill `{{token}}` placeholders with feminine Spanish agreement. */
export function fillEs(template: string): string {
  return template.replace(TOKEN, (_, key: string) => {
    const value = FORMS[key]
    if (value == null) {
      console.warn(`[es] missing token {{${key}}}`)
      return `{{${key}}}`
    }
    return value
  })
}
