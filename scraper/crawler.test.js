// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { crawlDk, mapHtmlSource } from './crawler.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

function fixture(name) {
  return readFileSync(join(__dirname, '__fixtures__/dk', name), 'utf8')
}

const INDEX_URL = 'https://globaltimber.dk/produkter/savet-trae/'
const EG_URL = 'https://globaltimber.dk/produkter/savet-trae/europaeisk-hardttrae/eg-europaeisk/'

describe('crawlDk', () => {
  it('returns Wood with expected shape from dk fixtures', async () => {
    const source = mapHtmlSource(new Map([
      [INDEX_URL, fixture('index.html')],
      [EG_URL, fixture('eg.html')],
    ]))

    const woods = await crawlDk(source)

    expect(woods).toHaveLength(1)
    expect(woods[0]).toMatchObject({
      id: 'eg-europaeisk',
      nameDa: 'Eg, Europæisk',
      nameEn: null,
      category: 'european',
      imageUrl: 'https://globaltimber.dk/wp-content/uploads/2026/04/Eg-euro-moerkere-600px-300px-webp.webp',
    })
    expect(woods[0].properties.botanical_name).toEqual({ type: 'nominal', value: 'Quercus robur' })
    expect(woods[0].properties.weight).toEqual({ type: 'numeric', value: 650, unit: 'kg/m3' })
  })

  it('skips a detail URL whose fetch throws and continues with the rest', async () => {
    const source = mapHtmlSource(new Map([
      [INDEX_URL, fixture('index.html')],
      // EG_URL absent — mapHtmlSource throws "fixture miss"
    ]))

    const woods = await crawlDk(source)
    expect(woods).toHaveLength(0)
  })

  it('maps tropisk-hardttrae slug to category tropical', async () => {
    const TROP_URL = 'https://globaltimber.dk/produkter/savet-trae/tropisk-hardttrae/teak/'
    const source = mapHtmlSource(new Map([
      [INDEX_URL, `<html><body><a href="${TROP_URL}">Teak</a></body></html>`],
      [TROP_URL, '<html><body><h1>Teak</h1></body></html>'],
    ]))

    const woods = await crawlDk(source)
    expect(woods).toHaveLength(1)
    expect(woods[0].category).toBe('tropical')
  })
})
