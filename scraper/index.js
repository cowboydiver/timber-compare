import { load } from 'cheerio'
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'
import { slugify, parseValue, normalizeKey, mergeWoods } from './lib.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function fetchHtml(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.text()
}

async function getLinks(indexUrl, linkPattern) {
  const html = await fetchHtml(indexUrl)
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

function parseProperties($, selector) {
  const props = {}
  $(selector).each((_, el) => {
    const label = $(el).find('dt, strong').first().text().trim()
    const value = $(el).find('dd').first().text().trim() ||
                  $(el).text().replace(label, '').trim()
    if (label) props[label] = value
  })
  return props
}

async function crawlDk() {
  const INDEX = 'https://globaltimber.dk/produkter/savet-trae/'
  const PATTERN = /\/produkter\/savet-trae\/(amerikansk|europaeisk|tropisk)-hardttrae\/.+\/$/

  const categoryMap = {
    'amerikansk-hardttrae': 'american',
    'europaeisk-hardttrae': 'european',
    'tropisk-hardttrae': 'tropical',
  }

  const links = await getLinks(INDEX, PATTERN)
  const woods = []

  for (const url of links) {
    try {
      const html = await fetchHtml(url)
      const $ = load(html)

      const catSlug = url.match(/savet-trae\/([^/]+)\//)?.[1]
      const category = categoryMap[catSlug] ?? 'tropical'
      const nameDa = $('h1').first().text().trim()
      const imageUrl = $('article img, .wp-post-image, .entry-content img').first().attr('src') ?? ''

      // dk uses a two-column table: <td><strong>label</strong></td><td>value</td>
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

      woods.push({ nameDa, nameEn: null, category, imageUrl, properties })
    } catch (e) {
      console.warn(`dk skip ${url}: ${e.message}`)
    }
  }

  return woods
}

async function crawlAsia() {
  const INDEX = 'https://globaltimber.asia/products/sawn-wood/'
  const PATTERN = /\/products\/sawn-wood\/(american|european|tropical)-hardwood\/.+\//

  const categoryMap = {
    'american-hardwood': 'american',
    'european-hardwood': 'european',
    'tropical-hardwood': 'tropical',
  }

  const links = await getLinks(INDEX, PATTERN)
  const woods = []

  for (const url of links) {
    try {
      const html = await fetchHtml(url)
      const $ = load(html)

      const catSlug = url.match(/sawn-wood\/([^/]+)\//)?.[1]
      const category = categoryMap[catSlug] ?? 'tropical'
      const nameEn = $('h1').first().text().trim()
      const imageUrl = $('article img, .wp-post-image, .entry-content img').first().attr('src') ?? ''

      const rawProps = {}
      $('dl dt').each((_, el) => {
        const label = $(el).text().trim()
        const value = $(el).next('dd').text().trim()
        if (label) rawProps[label] = value
      })

      const properties = {}
      for (const [en, raw] of Object.entries(rawProps)) {
        const key = en.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
        properties[key] = parseValue(raw)
      }

      woods.push({ nameDa: null, nameEn, category, imageUrl, properties })
    } catch (e) {
      console.warn(`asia skip ${url}: ${e.message}`)
    }
  }

  return woods
}

async function main() {
  console.log('Crawling globaltimber.dk…')
  const dkWoods = await crawlDk()
  console.log(`  ${dkWoods.length} species found`)

  console.log('Crawling globaltimber.asia…')
  const asiaWoods = await crawlAsia()
  console.log(`  ${asiaWoods.length} species found`)

  const merged = mergeWoods(dkWoods, asiaWoods)
  console.log(`Merged: ${merged.length} species`)

  const out = join(__dirname, '..', 'src', 'data', 'woods.json')
  writeFileSync(out, JSON.stringify(merged, null, 2))
  console.log(`Written to ${out}`)
  console.log('\nPlease review the output before committing — verify property alignment and image URLs.')
}

main().catch(e => { console.error(e); process.exit(1) })
