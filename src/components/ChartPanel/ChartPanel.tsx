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

export function ChartPanel({ woods }: Props) {
  const activeTab = useStore((s) => s.activeTab)
  const setActiveTab = useStore((s) => s.setActiveTab)

  const tabLabels = { radar: dict.radar, bar: dict.bar, scatter: dict.scatter }

  return (
    <section>
      <div role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>
      <div role="tabpanel">
        {activeTab === 'radar' && <WoodRadarChart woods={woods} />}
        {activeTab === 'bar' && <WoodBarChart woods={woods} />}
        {activeTab === 'scatter' && <WoodScatterChart woods={woods} />}
      </div>
    </section>
  )
}
