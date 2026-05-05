import { useRef } from 'react'
import { useStore } from '../../store/useStore'
import { dict } from '../../i18n/dictionary'
import { WoodRadarChart } from '../charts/RadarChart'
import { WoodBarChart } from '../charts/BarChart'
import { WoodScatterChart } from '../charts/ScatterChart'
import type { Wood } from '../../data/types'

interface Props {
  woods: Wood[]
}

const TABS = ['radar', 'bar', 'scatter'] as const
type Tab = typeof TABS[number]

export function ChartPanel({ woods }: Props) {
  const activeTab = useStore((s) => s.activeTab)
  const setActiveTab = useStore((s) => s.setActiveTab)
  const tabRefs = useRef<Partial<Record<Tab, HTMLButtonElement>>>({})

  const tabLabels: Record<Tab, string> = { radar: dict.radar, bar: dict.bar, scatter: dict.scatter }

  function handleKeyDown(e: React.KeyboardEvent, tab: Tab) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    const idx = TABS.indexOf(tab)
    const dir = e.key === 'ArrowRight' ? 1 : -1
    const next = TABS[(idx + dir + TABS.length) % TABS.length]
    setActiveTab(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <section>
      <div role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab}
            id={`tab-${tab}`}
            role="tab"
            aria-selected={activeTab === tab}
            tabIndex={activeTab === tab ? 0 : -1}
            onClick={() => setActiveTab(tab)}
            onKeyDown={(e) => handleKeyDown(e, tab)}
            ref={(el) => { if (el) tabRefs.current[tab] = el }}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>
      <div role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
        {activeTab === 'radar' && <WoodRadarChart woods={woods} />}
        {activeTab === 'bar' && <WoodBarChart woods={woods} />}
        {activeTab === 'scatter' && <WoodScatterChart woods={woods} />}
      </div>
    </section>
  )
}
