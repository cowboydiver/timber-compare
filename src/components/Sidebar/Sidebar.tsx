import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { filterWoods } from '../../data/utils'
import { dict } from '../../i18n/dictionary'
import type { Category, Wood } from '../../data/types'

interface Props {
  woods: Wood[]
}

const CATEGORIES: Array<{ key: Category | 'all'; label: keyof typeof dict }> = [
  { key: 'all', label: 'all' },
  { key: 'american', label: 'american' },
  { key: 'european', label: 'european' },
  { key: 'tropical', label: 'tropical' },
]

export function Sidebar({ woods }: Props) {
  const selectedIds = useStore((s) => s.selectedIds)
  const activeTab = useStore((s) => s.activeTab)
  const select = useStore((s) => s.select)
  const deselect = useStore((s) => s.deselect)
  const clearSelection = useStore((s) => s.clearSelection)

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<Category | undefined>(undefined)

  const filtered = filterWoods(woods, {
    search: search || undefined,
    category,
  })

  function toggleWood(w: Wood) {
    if (selectedIds.includes(w.id)) deselect(w.id)
    else select(w.id)
  }

  const radarOverflowStart = activeTab === 'radar' ? 6 : Infinity

  return (
    <aside>
      {selectedIds.length > 0 && (
        <div className="selection-count">
          <span>{selectedIds.length} valgt</span>
          <button onClick={clearSelection} className="clear-btn">Ryd</button>
        </div>
      )}
      <input
        role="searchbox"
        type="search"
        placeholder={dict.searchPlaceholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="category-filters">
        {CATEGORIES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setCategory(key === 'all' ? undefined : key)}
            aria-pressed={key === 'all' ? !category : category === key}
          >
            {dict[label]}
          </button>
        ))}
      </div>
      <ul role="listbox" aria-multiselectable="true" aria-label={dict.woodList}>
        {filtered.length === 0 && (
          <li className="no-results">{dict.noResults}</li>
        )}
        {filtered.map((w) => {
          const isSelected = selectedIds.includes(w.id)
          const selectedRank = selectedIds.indexOf(w.id)
          const isHiddenByRadarCap = isSelected && selectedRank >= radarOverflowStart
          return (
            <li
              key={w.id}
              role="option"
              aria-selected={isSelected}
              tabIndex={0}
              onClick={() => toggleWood(w)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  toggleWood(w)
                }
              }}
            >
              {w.imageUrl && <img src={w.imageUrl} alt="" />}
              <span>{w.nameDa ?? w.id}</span>
              {isHiddenByRadarCap && <span className="radar-overflow-badge">ikke vist</span>}
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
