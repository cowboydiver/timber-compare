import { dict } from '../i18n/dictionary'
import type { Category, PropertyValue, Wood } from './types'

export function filterWoods(
  woods: Wood[],
  { search, category }: { search?: string; category?: Category },
): Wood[] {
  return woods.filter((w) => {
    if (category && w.category !== category) return false
    if (search) {
      const q = search.toLowerCase()
      if (!(w.nameDa?.toLowerCase().includes(q) ?? false)) return false
    }
    return true
  })
}

export function isUnavailable(value: PropertyValue): value is { type: 'unavailable' } {
  return value.type === 'unavailable'
}

export function getNumericProperties(woods: Wood[]): string[] {
  const keys = new Set(woods.flatMap((w) => Object.keys(w.properties)))
  return [...keys].filter((key) =>
    woods.some((w) => w.properties[key]?.type === 'numeric'),
  )
}

export function propertyLabel(key: string): string {
  return dict.propertyLabels[key] ?? key
}

export function getNominalProperties(woods: Wood[]): string[] {
  const keys = new Set(woods.flatMap((w) => Object.keys(w.properties)))
  return [...keys].filter((key) =>
    woods.some((w) => w.properties[key]?.type === 'nominal') &&
    !woods.some((w) => w.properties[key]?.type === 'numeric'),
  )
}
