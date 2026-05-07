import { useRef } from 'react'
import { useStore } from '../../store/useStore'
import { WoodRadarChart } from '../charts/RadarChart'
import { WoodBarChart } from '../charts/BarChart'
import { WoodScatterChart } from '../charts/ScatterChart'
import { COLORS, groupColor, groupKey } from '../charts/palette'
import { getNumericProperties, propertyLabel } from '../../data/utils'
import { dict } from '../../i18n/dictionary'
import type { Application, Wood } from '../../data/types'

interface Props {
  woods: Wood[]
}

const TABS = ['radar', 'bar', 'scatter'] as const
type Tab = typeof TABS[number]
const TAB_LABELS: Record<Tab, string> = { radar: dict.radar, bar: dict.bar, scatter: dict.scatter }

const BAR_PROPS = [
  { key: 'weight',               label: 'Vægt (kg/m³)' },
  { key: 'janka_hardness',       label: 'Janka hårdhed' },
  { key: 'modulus_of_rupture',   label: 'Bøjningsmodul (MPa)' },
  { key: 'modulus_of_elasticity',label: 'Elasticitetsmodul (GPa)' },
  { key: 'shrinkage',            label: 'Svind' },
]

export function ChartPanel({ woods }: Props) {
  const activeTab          = useStore((s) => s.activeTab)
  const setActiveTab       = useStore((s) => s.setActiveTab)
  const colorBy            = useStore((s) => s.colorBy)
  const setColorBy         = useStore((s) => s.setColorBy)
  const barProperty        = useStore((s) => s.barProperty)
  const setBarProperty     = useStore((s) => s.setBarProperty)
  const scatterX           = useStore((s) => s.scatterX)
  const scatterY           = useStore((s) => s.scatterY)
  const setScatterX        = useStore((s) => s.setScatterX)
  const setScatterY        = useStore((s) => s.setScatterY)
  const selectedIds        = useStore((s) => s.selectedIds)
  const hiddenIds          = useStore((s) => s.hiddenIds)
  const hoveredKey         = useStore((s) => s.hoveredKey)
  const toggleHidden       = useStore((s) => s.toggleHidden)
  const setHovered         = useStore((s) => s.setHovered)
  const chartApplication   = useStore((s) => s.chartApplication)
  const setChartApplication = useStore((s) => s.setChartApplication)

  const numericKeys = getNumericProperties(woods)

  const chartWoods = chartApplication === 'all'
    ? woods
    : woods.filter((w) => w.applications.includes(chartApplication))
  const effectiveBarProp = barProperty || 'janka_hardness'
  const effectiveX = scatterX || numericKeys[0] || ''
  const effectiveY = scatterY || numericKeys[1] || numericKeys[0] || ''

  const tabRefs = useRef<Partial<Record<Tab, HTMLButtonElement>>>({})

  function handleKeyDown(e: React.KeyboardEvent, tab: Tab) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    const idx = TABS.indexOf(tab)
    const dir = e.key === 'ArrowRight' ? 1 : -1
    const next = TABS[(idx + dir + TABS.length) % TABS.length]
    setActiveTab(next)
    tabRefs.current[next]?.focus()
  }

  // Derive selected woods in order for radar legend (series colors), respecting application filter
  const selectedWoods = selectedIds
    .map((id) => chartWoods.find((w) => w.id === id))
    .filter((w): w is Wood => w !== undefined)

  // Visible woods (excluding hidden) for bar/scatter group legend
  const visibleWoods = selectedWoods.filter((w) => !hiddenIds.includes(w.id))

  // Unique groups for bar/scatter legend
  type LegendGroup = { label: string; color: string }
  function uniqueGroups(): LegendGroup[] {
    const seen = new Map<string, string>()
    for (const w of visibleWoods) {
      const origin = w.properties['origin']?.type === 'nominal' ? w.properties['origin'].value : ''
      const key = groupKey(w.category, origin, colorBy)
      const color = groupColor(w.category, origin, colorBy)
      if (!seen.has(key)) seen.set(key, color)
    }
    return [...seen.entries()].map(([label, color]) => ({ label, color }))
  }

  // Status counts
  const visibleCount = visibleWoods.length
  const hiddenCount  = hiddenIds.filter((id) => selectedIds.includes(id)).length

  return (
    <section className="wb-main">
      {/* fixed 56px toolbar */}
      <div className="wb-toolbar">
        <div className="wb-segments" role="tablist">
          {TABS.map((tab, idx) => (
            <button
              key={tab}
              id={`tab-${tab}`}
              role="tab"
              aria-selected={activeTab === tab}
              tabIndex={activeTab === tab ? 0 : -1}
              className={`wb-seg${activeTab === tab ? ' is-on' : ''}`}
              onClick={() => setActiveTab(tab)}
              onKeyDown={(e) => handleKeyDown(e, tab)}
              ref={(el) => { if (el) tabRefs.current[tab] = el }}
            >
              <span className="wb-seg-num">0{idx + 1}</span>
              <span className="wb-seg-l">{TAB_LABELS[tab]}</span>
            </button>
          ))}
        </div>

        <div className="wb-tools">
          <div className="wb-tool">
            <label htmlFor="chart-app">{dict.application}</label>
            <select
              id="chart-app"
              value={chartApplication}
              onChange={(e) => setChartApplication(e.target.value as Application | 'all')}
            >
              <option value="all">Alle</option>
              <option value="sawn_lumber">{dict.sawn_lumber}</option>
              <option value="deck_planks">{dict.deck_planks}</option>
              <option value="cladding">{dict.cladding}</option>
            </select>
          </div>
          {activeTab === 'radar' && (
            <div className="wb-tool wb-tool-info">
              <span className="wb-tool-dot" />
              Normaliseret 0–100 over alle træsorter
            </div>
          )}
          {activeTab === 'bar' && (
            <>
              <div className="wb-tool">
                <label htmlFor="bar-prop">Egenskab</label>
                <select
                  id="bar-prop"
                  value={effectiveBarProp}
                  onChange={(e) => setBarProperty(e.target.value)}
                >
                  {BAR_PROPS.map(({ key, label }) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="wb-tool">
                <label htmlFor="bar-color">Farve</label>
                <select
                  id="bar-color"
                  value={colorBy}
                  onChange={(e) => setColorBy(e.target.value as 'category' | 'origin')}
                >
                  <option value="category">Kategori</option>
                  <option value="origin">Oprindelse</option>
                </select>
              </div>
            </>
          )}
          {activeTab === 'scatter' && (
            <>
              <div className="wb-tool">
                <label htmlFor="scatter-x">{dict.axisX}</label>
                <select
                  id="scatter-x"
                  value={effectiveX}
                  onChange={(e) => setScatterX(e.target.value)}
                >
                  {numericKeys.map((key) => (
                    <option key={key} value={key}>{propertyLabel(key)}</option>
                  ))}
                </select>
              </div>
              <div className="wb-tool">
                <label htmlFor="scatter-y">{dict.axisY}</label>
                <select
                  id="scatter-y"
                  value={effectiveY}
                  onChange={(e) => setScatterY(e.target.value)}
                >
                  {numericKeys.map((key) => (
                    <option key={key} value={key}>{propertyLabel(key)}</option>
                  ))}
                </select>
              </div>
              <div className="wb-tool">
                <label htmlFor="scatter-color">Farve</label>
                <select
                  id="scatter-color"
                  value={colorBy}
                  onChange={(e) => setColorBy(e.target.value as 'category' | 'origin')}
                >
                  <option value="category">Kategori</option>
                  <option value="origin">Oprindelse</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* chart canvas */}
      <div className="wb-canvas" role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
        <span className="wb-corner wb-corner-tl" />
        <span className="wb-corner wb-corner-tr" />
        <span className="wb-corner wb-corner-bl" />
        <span className="wb-corner wb-corner-br" />

        {activeTab === 'radar'   && <WoodRadarChart   woods={chartWoods} />}
        {activeTab === 'bar'     && <WoodBarChart     woods={chartWoods} />}
        {activeTab === 'scatter' && <WoodScatterChart woods={chartWoods} />}

        {/* legend */}
        <div className="wb-legend">
          {activeTab === 'radar' && selectedWoods.map((w, i) => {
            const isHidden = hiddenIds.includes(w.id)
            const isHov = hoveredKey === w.id
            const color = COLORS[i % COLORS.length]
            return (
              <button
                key={w.id}
                className={`wb-leg-item${isHidden ? ' is-hidden' : ''}${isHov ? ' is-hovered' : ''}`}
                onClick={() => toggleHidden(w.id)}
                onMouseEnter={() => !isHidden && setHovered(w.id)}
                onMouseLeave={() => setHovered(null)}
                title={isHidden ? 'Vis' : 'Skjul'}
              >
                <span
                  className="wb-leg-sw"
                  style={{
                    background: isHidden ? 'transparent' : color,
                    borderColor: color,
                  }}
                />
                {w.nameDa ?? w.id}
              </button>
            )
          })}
          {(activeTab === 'bar' || activeTab === 'scatter') && uniqueGroups().map(({ label, color }) => {
            const isHov = hoveredKey === label
            return (
              <button
                key={label}
                className={`wb-leg-item${isHov ? ' is-hovered' : ''}`}
                onMouseEnter={() => setHovered(label)}
                onMouseLeave={() => setHovered(null)}
              >
                <span className="wb-leg-sw" style={{ background: color, borderColor: color }} />
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* status footer */}
      <div className="wb-status">
        <span>
          <strong>{visibleCount}</strong>{' '}
          træsorter sammenlignes
          {hiddenCount > 0 ? ` (${hiddenCount} skjult)` : ''}
        </span>
        <span className="wb-status-sep" />
        <span>{numericKeys.length} numeriske egenskaber</span>
        <span className="wb-status-sep" />
        <span>Kilde: Global Timber datablade · 2026</span>
      </div>
    </section>
  )
}
