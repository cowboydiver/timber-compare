import { useStore } from '../../store/useStore'
import { dict } from '../../i18n/dictionary'

const TABS = ['radar', 'bar', 'scatter'] as const

export function ChartPanel() {
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
        <p>{t.chartPlaceholder}</p>
      </div>
    </section>
  )
}
