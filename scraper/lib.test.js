import { describe, it, expect } from 'vitest'
import { slugify, parseValue, normalizeKey, mergeWoods } from './lib.js'

describe('slugify', () => {
  it('lowercases and hyphenates a simple name', () => {
    expect(slugify('European Oak')).toBe('european-oak')
  })

  it('strips punctuation and normalises accented characters', () => {
    expect(slugify('Mahogany, Sapele')).toBe('mahogany-sapele')
    expect(slugify('Ipé')).toBe('ipe')
    expect(slugify('Wengé')).toBe('wenge')
  })

  it('maps Danish special characters', () => {
    expect(slugify('Eg, Europæisk')).toBe('eg-europaeisk')
    expect(slugify('Bøg')).toBe('boeg')
    expect(slugify('Rød')).toBe('roed')
  })
})


describe('parseValue', () => {
  it('returns unavailable for empty or missing string', () => {
    expect(parseValue('')).toEqual({ type: 'unavailable' })
    expect(parseValue(null)).toEqual({ type: 'unavailable' })
  })

  it('parses a numeric value with unit', () => {
    expect(parseValue('Ca. 650 kg/m3')).toEqual({ type: 'numeric', value: 650, unit: 'kg/m3' })
    expect(parseValue('97.1 MPa')).toEqual({ type: 'numeric', value: 97.1, unit: 'MPa' })
    expect(parseValue('650')).toEqual({ type: 'numeric', value: 650, unit: '' })
  })

  it('handles Danish decimal comma', () => {
    expect(parseValue('12,2')).toEqual({ type: 'numeric', value: 12.2, unit: '' })
    expect(parseValue('10,6 GPa')).toEqual({ type: 'numeric', value: 10.6, unit: 'GPa' })
  })

  it('returns nominal for non-numeric text', () => {
    expect(parseValue('Quercus robur')).toEqual({ type: 'nominal', value: 'Quercus robur' })
    expect(parseValue('8-10%')).toEqual({ type: 'nominal', value: '8-10%' })
  })
})

describe('normalizeKey', () => {
  it('maps known Danish property labels to English keys', () => {
    expect(normalizeKey('Botanisk navn')).toBe('botanical_name')
    expect(normalizeKey('Vægt')).toBe('weight')
    expect(normalizeKey('Janka hårdhed')).toBe('janka_hardness')
    expect(normalizeKey('Brudstyrke')).toBe('modulus_of_rupture')
    expect(normalizeKey('Bøjningsstyrke')).toBe('bending_strength')
    expect(normalizeKey('Elastisk styrke/Elasticitet')).toBe('modulus_of_elasticity')
    expect(normalizeKey('Svind')).toBe('shrinkage')
    expect(normalizeKey('Ovntørret')).toBe('moisture_content')
    expect(normalizeKey('Oprindelse')).toBe('origin')
  })

  it('passes through unknown keys unchanged', () => {
    expect(normalizeKey('Some unknown property')).toBe('Some unknown property')
  })
})

describe('mergeWoods', () => {
  const dkOak = { nameDa: 'Eg', nameEn: 'Oak', category: 'european', imageUrl: 'dk.jpg', properties: { weight: { type: 'numeric', value: 650, unit: 'kg/m3' } } }
  const asiaOak = { nameDa: null, nameEn: 'Oak', category: 'european', imageUrl: 'asia.jpg', properties: { weight: { type: 'numeric', value: 770, unit: 'kg/m3' } } }
  const asiaTeak = { nameDa: null, nameEn: 'Teak', category: 'tropical', imageUrl: 'teak.jpg', properties: {} }

  it('merges woods present on both sites by English name', () => {
    const result = mergeWoods([dkOak], [asiaOak])
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({ id: 'oak', nameDa: 'Eg', nameEn: 'Oak', category: 'european' })
  })

  it('includes wood only on dk with nameEn: null', () => {
    const dkOnly = { nameDa: 'Birk', nameEn: null, category: 'european', imageUrl: '', properties: {} }
    const result = mergeWoods([dkOnly], [])
    expect(result[0]).toMatchObject({ nameEn: null, nameDa: 'Birk' })
  })

  it('includes wood only on asia with nameDa: null', () => {
    const result = mergeWoods([], [asiaTeak])
    expect(result[0]).toMatchObject({ nameDa: null, nameEn: 'Teak' })
  })
})
