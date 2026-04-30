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
  const language = useStore((s) => s.language)
  const activeTab = useStore((s) => s.activeTab)
  const setActiveTab = useStore((s) => s.setActiveTab)
  const t = dict[language]

  const tabLabels = { radar: t.radar, bar: t.bar, scatter: t.scatter }

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
