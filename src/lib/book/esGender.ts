import type { EsGender } from './lang'

/** Spanish story templates use {{tokens}} filled by protagonist gender.
 * Feminine → línea; masculine → trazo (keeps agreement grammatical).
 */
const FORMS: Record<
  EsGender,
  Record<string, string>
> = {
  f: {
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
  },
  m: {
    el: 'el',
    El: 'El',
    los: 'los',
    Los: 'Los',
    un: 'un',
    Un: 'Un',
    linea: 'trazo',
    Linea: 'Trazo',
    lineas: 'trazos',
    Lineas: 'Trazos',
    doblado: 'doblado',
    Doblado: 'Doblado',
    rojo: 'rojo',
    nuestro: 'nuestro',
    Nuestro: 'Nuestro',
    esta: 'este',
    Esta: 'Este',
    ella: 'él',
    mismo: 'mismo',
    pequeno: 'pequeño',
    Pequeno: 'Pequeño',
    largo: 'largo',
    largos: 'largos',
    Largos: 'Largos',
    cortos: 'cortos',
    curioso: 'curioso',
    solo: 'solo',
    delgado: 'delgado',
    delgados: 'delgados',
    recto: 'recto',
    rectos: 'rectos',
    plano: 'plano',
    planos: 'planos',
    otro: 'otro',
    otros: 'otros',
    Otros: 'Otros',
    todo: 'todo',
    todos: 'todos',
    Todos: 'Todos',
    alguno: 'alguno',
    algunos: 'algunos',
    Algunos: 'Algunos',
    uno: 'uno',
    Uno: 'Uno',
    ellos: 'ellos',
    demas: 'demás',
    vecino: 'vecino',
    blanditos: 'blanditos',
    chiquito: 'chiquito',
    chiquitos: 'chiquitos',
    rojito: 'rojito',
    ese: 'ese',
    la: 'lo',
    lo: 'lo',
  },
}

const TOKEN = /\{\{(\w+)\}\}/g

/** Fill `{{token}}` placeholders for the active Spanish gender. */
export function fillEs(template: string, gender: EsGender): string {
  const forms = FORMS[gender]
  return template.replace(TOKEN, (_, key: string) => {
    const value = forms[key]
    if (value == null) {
      console.warn(`[es] missing token {{${key}}} for gender ${gender}`)
      return `{{${key}}}`
    }
    return value
  })
}

export function randomEsGender(): EsGender {
  return Math.random() < 0.5 ? 'm' : 'f'
}
