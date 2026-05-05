import { describe, it, expect } from 'vitest'
import { isUnavailable, filterWoods, getNumericProperties, getNominalProperties } from './utils'
import type { Wood } from './types'

const oak: Wood = {
  id: 'oak',
  nameDa: 'Eg',
  nameEn: 'Oak',
  category: 'european',
  imageUrl: '',
  properties: { density: { type: 'numeric', value: 720, unit: 'kg/m³' } },
}

const teak: Wood = {
  id: 'teak',
  nameDa: 'Teak',
  nameEn: 'Teak',
  category: 'tropical',
  imageUrl: '',
  properties: { density: { type: 'numeric', value: 630, unit: 'kg/m³' } },
}

const walnut: Wood = {
  id: 'walnut',
  nameDa: 'Valnød',
  nameEn: 'Walnut',
  category: 'american',
  imageUrl: '',
  properties: { density: { type: 'unavailable' } },
}

describe('isUnavailable', () => {
  it('returns true for unavailable value', () => {
    expect(isUnavailable({ type: 'unavailable' })).toBe(true)
  })

  it('returns false for numeric value', () => {
    expect(isUnavailable({ type: 'numeric', value: 700, unit: 'kg/m³' })).toBe(false)
  })

  it('returns false for nominal value', () => {
    expect(isUnavailable({ type: 'nominal', value: 'tropical' })).toBe(false)
  })
})

describe('filterWoods', () => {
  it('returns all woods when no filter is applied', () => {
    expect(filterWoods([oak, teak, walnut], {})).toEqual([oak, teak, walnut])
  })

  it('filters by category', () => {
    expect(filterWoods([oak, teak, walnut], { category: 'tropical' })).toEqual([teak])
  })

  it('filters by search matching nameDa (case-insensitive)', () => {
    expect(filterWoods([oak, teak, walnut], { search: 'eg' })).toEqual([oak])
  })

  it('applies search and category together', () => {
    expect(filterWoods([oak, teak, walnut], { search: 'teak', category: 'tropical' })).toEqual([teak])
  })

  it('returns empty array when nothing matches', () => {
    expect(filterWoods([oak, teak, walnut], { search: 'pine' })).toEqual([])
  })
})

describe('getNumericProperties', () => {
  it('returns keys that have at least one numeric value', () => {
    expect(getNumericProperties([oak, teak])).toContain('density')
  })

  it('excludes keys that are fully unavailable', () => {
    const woods = [
      { ...oak, properties: { density: { type: 'numeric' as const, value: 700, unit: 'kg/m³' }, color: { type: 'unavailable' as const } } },
    ]
    expect(getNumericProperties(woods)).not.toContain('color')
  })

  it('excludes nominal-only keys', () => {
    const woods = [
      { ...oak, properties: { origin: { type: 'nominal' as const, value: 'Europe' } } },
    ]
    expect(getNumericProperties(woods)).not.toContain('origin')
  })
})

describe('getNominalProperties', () => {
  it('returns keys with nominal values', () => {
    const woods = [
      { ...oak, properties: { origin: { type: 'nominal' as const, value: 'Europe' } } },
    ]
    expect(getNominalProperties(woods)).toContain('origin')
  })

  it('excludes numeric and unavailable keys', () => {
    const woods = [
      {
        ...oak,
        properties: {
          density: { type: 'numeric' as const, value: 700, unit: 'kg/m³' },
          color: { type: 'unavailable' as const },
          origin: { type: 'nominal' as const, value: 'Europe' },
        },
      },
    ]
    const result = getNominalProperties(woods)
    expect(result).toContain('origin')
    expect(result).not.toContain('density')
    expect(result).not.toContain('color')
  })
})
