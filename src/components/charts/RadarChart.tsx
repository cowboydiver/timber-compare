import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'
import { useStore } from '../../store/useStore'
import { getNumericProperties, propertyLabel } from '../../data/utils'
import { dict } from '../../i18n/dictionary'
import { COLORS } from './palette'
import type { Wood } from '../../data/types'

interface Props {
  woods: Wood[]
}

export function WoodRadarChart({ woods }: Props) {
  const selectedIds = useStore((s) => s.selectedIds)
  const hiddenIds   = useStore((s) => s.hiddenIds)
  const hoveredKey  = useStore((s) => s.hoveredKey)

  const numericKeys = getNumericProperties(woods)

  const selectedWoods = selectedIds
    .map((id) => woods.find((w) => w.id === id))
    .filter((w): w is Wood => w !== undefined)
    .filter((w) => !hiddenIds.includes(w.id))

  if (selectedIds.length === 0) {
    return <p className="chart-empty">{dict.chartPlaceholder}</p>
  }

  // Normalize per property to 0–100 across all woods
  const minMax: Record<string, { min: number; max: number }> = {}
  for (const key of numericKeys) {
    const vals = woods.flatMap((w) => {
      const pv = w.properties[key]
      return pv?.type === 'numeric' ? [pv.value] : []
    })
    if (vals.length === 0) { minMax[key] = { min: 0, max: 1 }; continue }
    minMax[key] = { min: Math.min(...vals), max: Math.max(...vals) }
  }

  function normalize(value: number, key: string): number {
    const { min, max } = minMax[key] ?? { min: 0, max: 1 }
    if (max === min) return 0
    return (value - min) / (max - min) * 100
  }

  const data = numericKeys.map((key) => {
    const entry: Record<string, string | number> = { property: propertyLabel(key) }
    for (const w of selectedWoods) {
      const pv = w.properties[key]
      entry[w.id] = pv?.type === 'numeric' ? normalize(pv.value, key) : 0
    }
    return entry
  })

  const anyHovered = hoveredKey !== null

  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={300}>
      <RadarChart data={data}>
        <PolarGrid stroke="var(--color-muted-decoration)" />
        <PolarAngleAxis dataKey="property" tick={{ fontSize: 11, fill: 'var(--color-text-muted)', fontFamily: 'Roboto Slab, serif' }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: 'var(--color-muted-decoration)' }} />
        {selectedWoods.map((w, i) => {
          const color = COLORS[i % COLORS.length]
          const isHov = hoveredKey === w.id
          const dim = anyHovered && !isHov
          return (
            <Radar
              key={w.id}
              name={w.nameDa ?? w.id}
              dataKey={w.id}
              stroke={dim ? color + '26' : color}
              fill={color}
              fillOpacity={dim ? 0.02 : isHov ? 0.3 : 0.15}
              strokeWidth={isHov ? 2.5 : 1.8}
            />
          )
        })}
      </RadarChart>
    </ResponsiveContainer>
  )
}
