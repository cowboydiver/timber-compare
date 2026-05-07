import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { filterWoods } from '../../data/utils'
import { dict } from '../../i18n/dictionary'
import type { Application, Category, Wood } from '../../data/types'

interface Props {
  woods: Wood[]
}

const CATEGORIES: Array<{ key: Category | 'all'; label: string }> = [
  { key: 'all',      label: 'Alle' },
  { key: 'american', label: 'Amerikansk' },
  { key: 'european', label: 'Europæisk' },
  { key: 'tropical', label: 'Tropisk' },
]

const APPLICATIONS: Array<{ key: Application | 'all'; label: string }> = [
  { key: 'all',         label: 'Alle' },
  { key: 'sawn_lumber', label: dict.sawn_lumber },
  { key: 'deck_planks', label: dict.deck_planks },
  { key: 'cladding',    label: dict.cladding },
]

const CAT_CLASS: Record<string, string> = {
  american: 'wb-cat-american',
  european: 'wb-cat-european',
  tropical: 'wb-cat-tropical',
}

const APP_CLASS: Record<string, string> = {
  sawn_lumber: 'wb-app-sawn-lumber',
  deck_planks: 'wb-app-deck-planks',
  cladding:    'wb-app-cladding',
}

export function Drawer({ woods }: Props) {
  const selectedIds    = useStore((s) => s.selectedIds)
  const select         = useStore((s) => s.select)
  const deselect       = useStore((s) => s.deselect)
  const selectAll      = useStore((s) => s.selectAll)
  const clearSelection = useStore((s) => s.clearSelection)
  const drawerOpen     = useStore((s) => s.drawerOpen)
  const setDrawerOpen  = useStore((s) => s.setDrawerOpen)

  const [search, setSearch] = useState('')
  const [cat, setCat]       = useState<Category | 'all'>('all')
  const [app, setApp]       = useState<Application | 'all'>('all')

  const maxJanka = Math.max(
    ...woods.flatMap((w) => {
      const pv = w.properties['janka_hardness']
      return pv?.type === 'numeric' ? [pv.value] : []
    }),
    1,
  )

  const filtered = filterWoods(woods, {
    search: search || undefined,
    category: cat === 'all' ? undefined : cat,
    application: app === 'all' ? undefined : app,
  })

  const appCounts: Record<string, number> = { all: woods.length }
  for (const { key } of APPLICATIONS.slice(1)) {
    appCounts[key] = woods.filter((w) => w.applications.includes(key as Application)).length
  }

  function toggleWood(w: Wood) {
    if (selectedIds.includes(w.id)) deselect(w.id)
    else select(w.id)
  }

  function getJanka(w: Wood): number | null {
    const pv = w.properties['janka_hardness']
    return pv?.type === 'numeric' ? pv.value : null
  }

  return (
    <aside className="wb-drawer">
      <button
        className="wb-drawer-tab"
        onClick={() => setDrawerOpen(!drawerOpen)}
        aria-label={drawerOpen ? 'Luk bibliotek' : 'Åbn bibliotek'}
        title={drawerOpen ? 'Luk bibliotek' : 'Åbn bibliotek'}
      >
        {drawerOpen ? '◀' : '▶'}
      </button>

      <div className="wb-drawer-inner">
      <div className="wb-drawer-head">
        <h2>Træbibliotek</h2>
      </div>

      <div className="wb-search">
        <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
          <circle cx="7" cy="7" r="4.5" fill="none" stroke="#5e6f68" strokeWidth="1.2" />
          <path d="M10.5 10.5l3 3" stroke="#5e6f68" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          placeholder={`Søg blandt ${woods.length} træsorter…`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Søg træsorter"
        />
      </div>

      <div className="wb-tabs-cat">
        {CATEGORIES.map(({ key, label }) => (
          <button
            key={key}
            className={`wb-tab-cat${cat === key ? ' is-on' : ''}`}
            onClick={() => setCat(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="wb-tabs-cat wb-tabs-app">
        {APPLICATIONS.map(({ key, label }) => (
          <button
            key={key}
            className={`wb-tab-cat${app === key ? ' is-on' : ''}${key !== 'all' ? ` wb-tab-app-${key}` : ''}`}
            onClick={() => setApp(key)}
          >
            {label} <span>{appCounts[key]}</span>
          </button>
        ))}
      </div>

      <div className="wb-drawer-actions">
        <button className="wb-drawer-action" onClick={() => selectAll(woods.map((w) => w.id))}>
          Vælg alle
        </button>
        <button className="wb-drawer-action" onClick={clearSelection}>
          Fravælg alle
        </button>
      </div>

      <div className="wb-lib-head">
        <span>Træsort</span>
        <span>Janka</span>
      </div>

      <ul className="wb-lib">
        {filtered.length === 0 && (
          <li className="wb-lib-empty">Ingen træsorter matcher din søgning.</li>
        )}
        {filtered.map((w) => {
          const janka = getJanka(w)
          const isSel = selectedIds.includes(w.id)
          return (
            <li
              key={w.id}
              className={isSel ? 'is-sel' : ''}
              onClick={() => toggleWood(w)}
              role="option"
              aria-selected={isSel}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  toggleWood(w)
                }
              }}
            >
              <span className={`wb-cat-tag ${CAT_CLASS[w.category] ?? ''}`} />
              <span className="wb-lib-name">{w.nameDa ?? w.id}</span>
              <span className="wb-lib-janka">
                <span className="wb-lib-bar">
                  <span style={{ width: janka ? `${janka / maxJanka * 100}%` : '0%' }} />
                </span>
                {janka ?? '—'}
              </span>
              <span className="wb-lib-check">{isSel ? '●' : '○'}</span>
            </li>
          )
        })}
      </ul>
      </div>
    </aside>
  )
}
