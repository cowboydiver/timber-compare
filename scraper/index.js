import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'
import { crawlDk } from './crawler.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function main() {
  console.log('Crawling globaltimber.dk…')
  const woods = await crawlDk()
  console.log(`  ${woods.length} species found`)

  const out = join(__dirname, '..', 'src', 'data', 'woods.json')
  writeFileSync(out, JSON.stringify(woods, null, 2))
  console.log(`Written to ${out}`)
  console.log('\nPlease review the output before committing — verify property alignment and image URLs.')
}

main().catch(e => { console.error(e); process.exit(1) })
