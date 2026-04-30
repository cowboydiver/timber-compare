const DA_TO_EN = {
  'Botanisk navn': 'botanical_name',
  'Oprindelse': 'origin',
  'Vægt': 'weight',
  'Ovntørret': 'moisture_content',
  'Janka hårdhed': 'janka_hardness',
  'Brudstyrke': 'modulus_of_rupture',
  'Bøjningsstyrke': 'bending_strength',
  'Elastisk styrke/Elasticitet': 'modulus_of_elasticity',
  'Svind': 'shrinkage',
}

export function mergeWoods(dkWoods, asiaWoods) {
  const byEn = new Map()

  for (const w of dkWoods) {
    const key = w.nameEn ?? `__dk__${w.nameDa}`
    byEn.set(key, { ...w, id: w.nameEn ? slugify(w.nameEn) : slugify(w.nameDa) })
  }

  for (const w of asiaWoods) {
    const key = w.nameEn
    if (byEn.has(key)) {
      const existing = byEn.get(key)
      byEn.set(key, {
        ...existing,
        nameEn: w.nameEn,
        imageUrl: existing.imageUrl || w.imageUrl,
        properties: { ...w.properties, ...existing.properties },
      })
    } else {
      byEn.set(key, { ...w, id: slugify(w.nameEn), nameDa: null })
    }
  }

  return [...byEn.values()]
}

export function normalizeKey(label) {
  return DA_TO_EN[label] ?? label
}

export function parseValue(raw) {
  if (!raw) return { type: 'unavailable' }
  const s = raw.trim()
  if (!s) return { type: 'unavailable' }
  // Match optional prefix (Ca.), a number, optional unit
  // Must start with an optional prefix then a standalone number (not part of a range like 8-10%)
  const normalized = s.replace(/^(\d+),(\d+)/, '$1.$2')
  const m = normalized.match(/^(?:ca\.\s*)?(\d+(?:\.\d+)?)\s+([^-\d].*)$/i) ||
            normalized.match(/^(?:ca\.\s*)?(\d+(?:\.\d+)?)\s*([a-zA-Z].*)$/) ||
            normalized.match(/^(?:ca\.\s*)?(\d+(?:\.\d+)?)$/)

  if (m) return { type: 'numeric', value: parseFloat(m[1]), unit: (m[2] ?? '').trim() }
  return { type: 'nominal', value: s }
}

const DA_CHARS = { 'æ': 'ae', 'ø': 'oe', 'å': 'aa', 'Æ': 'ae', 'Ø': 'oe', 'Å': 'aa' }

export function slugify(name) {
  return name
    .replace(/[æøåÆØÅ]/g, c => DA_CHARS[c])
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
