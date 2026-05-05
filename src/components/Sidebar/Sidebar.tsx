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
  const select = useStore((s) => s.select)
  const deselect = useStore((s) => s.deselect)

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

  return (
    <aside>
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
      <ul>
        {filtered.map((w) => {
          const isSelected = selectedIds.includes(w.id)
          return (
            <li key={w.id} aria-selected={isSelected} onClick={() => toggleWood(w)}>
              {w.imageUrl && <img src={w.imageUrl} alt="" />}
              <span>{w.nameDa ?? w.id}</span>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
