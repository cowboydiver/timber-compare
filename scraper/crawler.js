import { load } from 'cheerio'
import { slugify, parseValue, normalizeKey } from './lib.js'

export async function fetchHtmlSource(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.text()
}

export function mapHtmlSource(map) {
  return async (url) => {
    if (!map.has(url)) throw new Error(`fixture miss: ${url}`)
    return map.get(url)
  }
}

const INDEX = 'https://globaltimber.dk/produkter/savet-trae/'
const PATTERN = /\/produkter\/savet-trae\/(amerikansk|europaeisk|tropisk)-hardttrae\/.+\/$/
const CATEGORY_MAP = {
  'amerikansk-hardttrae': 'american',
  'europaeisk-hardttrae': 'european',
  'tropisk-hardttrae': 'tropical',
}

async function getLinks(htmlSource, indexUrl, linkPattern) {
  const html = await htmlSource(indexUrl)
  const $ = load(html)
  const links = new Set()
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href')
    if (href && linkPattern.test(href)) {
      links.add(href.startsWith('http') ? href : new URL(href, indexUrl).href)
    }
  })
  return [...links]
}

export async function crawlDk(htmlSource = fetchHtmlSource) {
  const links = await getLinks(htmlSource, INDEX, PATTERN)
  const woods = []

  for (const url of links) {
    try {
      const html = await htmlSource(url)
      const $ = load(html)

      const catSlug = url.match(/savet-trae\/([^/]+)\//)?.[1]
      const category = CATEGORY_MAP[catSlug] ?? 'tropical'
      const nameDa = $('h1').first().text().trim()
      const imageUrl = $('article img, .wp-post-image, .entry-content img').first().attr('src') ?? ''

      const rawProps = {}
      $('tr').each((_, row) => {
        const cells = $(row).find('td')
        if (cells.length >= 2) {
          const label = $(cells[0]).text().trim()
          const value = $(cells[1]).text().trim()
          if (label) rawProps[label] = value
        }
      })

      const properties = {}
      for (const [da, raw] of Object.entries(rawProps)) {
        if (da === '__lastKey') continue
        properties[normalizeKey(da)] = parseValue(raw)
      }

      woods.push({ id: slugify(nameDa), nameDa, nameEn: null, category, imageUrl, properties })
    } catch (e) {
      console.warn(`dk skip ${url}: ${e.message}`)
    }
  }

  return woods
}
