export const COLORS = ['#3c453b', '#987f67', '#86968f', '#3f342f', '#5a6e5a', '#b89e87']

export const CAT_COLORS: Record<string, string> = {
  american: '#987f67',
  european: '#3c453b',
  tropical: '#5a6e5a',
}

const ORIGIN_COLORS: Record<string, string> = {
  'Nordamerika':                   '#987f67',
  'Østlige Nordamerika':           '#3c453b',
  'Nordlige og Østlige Amerika':   '#5a6e5a',
  'Vestlige USA og Canada':        '#b89e87',
  'Nordøstlig Amerika':            '#3f342f',
  'Nordamerika, Canada':           '#86968f',
  'Europa':                        '#3c453b',
  'Nord- og Centraleuropa':        '#5a6e5a',
  'Vestafrika':                    '#7a5b39',
}

export function groupColor(category: string, origin: string, colorBy: 'category' | 'origin'): string {
  if (colorBy === 'category') return CAT_COLORS[category] ?? '#86968f'
  return ORIGIN_COLORS[origin] ?? '#c6a882'
}

const CAT_LABELS: Record<string, string> = {
  american: 'Amerikansk',
  european: 'Europæisk',
  tropical: 'Tropisk',
}

export function groupKey(category: string, origin: string, colorBy: 'category' | 'origin'): string {
  if (colorBy === 'category') return CAT_LABELS[category] ?? category
  return origin
}
