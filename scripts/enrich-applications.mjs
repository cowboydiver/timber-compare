import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const filePath = resolve(__dirname, '../src/data/woods.json')
const woods = JSON.parse(readFileSync(filePath, 'utf8'))

const DECK_PLANKS = new Set([
  'bilinga', 'cumaru', 'eg-europaeisk', 'ipe', 'jatoba',
  'mahogni-sapele', 'tali', 'thermo-ask',
])

const CLADDING = new Set([
  'ceder-western-red', 'cumaru', 'eg-europaeisk', 'ipe',
  'mahogni-sapele', 'thermo-ask',
])

// Add applications to all existing woods (all are sawn lumber)
for (const wood of woods) {
  const apps = ['sawn_lumber']
  if (DECK_PLANKS.has(wood.id)) apps.push('deck_planks')
  if (CLADDING.has(wood.id)) apps.push('cladding')
  wood.applications = apps
}

// New woods that are not sawn lumber
const newWoods = [
  {
    id: 'bangkirai',
    nameDa: 'Bangkirai',
    nameEn: null,
    category: 'tropical',
    applications: ['deck_planks'],
    imageUrl: 'https://globaltimber.dk/wp-content/uploads/2025/11/Bangkirai_ny.png',
    properties: {
      botanical_name: { type: 'nominal', value: 'Shorea laevifolia' },
      origin:         { type: 'nominal', value: 'Asien' },
    },
  },
  {
    id: 'fava-amargosa',
    nameDa: 'Fava Amargosa',
    nameEn: null,
    category: 'tropical',
    applications: ['deck_planks'],
    imageUrl: 'https://globaltimber.dk/wp-content/uploads/2025/04/Fava-Amargosa-600px-300px.png',
    properties: {
      botanical_name: { type: 'nominal', value: 'Vatairea paranensis' },
      origin:         { type: 'nominal', value: 'Sydamerika' },
    },
  },
  {
    id: 'garapa',
    nameDa: 'Garapa',
    nameEn: null,
    category: 'tropical',
    applications: ['deck_planks', 'cladding'],
    imageUrl: 'https://globaltimber.dk/wp-content/uploads/2025/04/Garapa-600px-300px.png',
    properties: {
      botanical_name: { type: 'nominal', value: 'Apuleia leiocarpa' },
      origin:         { type: 'nominal', value: 'Sydamerika' },
    },
  },
  {
    id: 'massaranduba',
    nameDa: 'Massaranduba',
    nameEn: null,
    category: 'tropical',
    applications: ['deck_planks'],
    imageUrl: 'https://globaltimber.dk/wp-content/uploads/2025/04/Masseranduba-600px-300px.png',
    properties: {
      botanical_name: { type: 'nominal', value: 'Manilkara spp.' },
      origin:         { type: 'nominal', value: 'Sydamerika' },
    },
  },
]

woods.push(...newWoods)

writeFileSync(filePath, JSON.stringify(woods, null, 2) + '\n')
console.log(`Done. ${woods.length} woods total.`)
