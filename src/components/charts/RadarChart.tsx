import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
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
  const radarWarning = selectedIds.length > 6

  const numericKeys = getNumericProperties(woods)
  const selectedWoods = woods
    .filter((w) => selectedIds.includes(w.id))
    .slice(0, 6)

  if (selectedIds.length === 0) {
    return <p className="chart-empty">{dict.chartPlaceholder}</p>
  }

  const data = numericKeys.map((key) => {
    const entry: Record<string, string | number> = { property: propertyLabel(key) }
    for (const w of selectedWoods) {
      const pv = w.properties[key]
      entry[w.id] = pv?.type === 'numeric' ? pv.value : 0
    }
    return entry
  })

  return (
    <div>
      {radarWarning && <p role="status">{dict.radarWarning}</p>}
      <ResponsiveContainer width="100%" height={420}>
        <RadarChart data={data}>
          <PolarGrid stroke="var(--color-muted-decoration)" />
          <PolarAngleAxis dataKey="property" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} />
          <PolarRadiusAxis angle={30} tick={{ fontSize: 10, fill: 'var(--color-muted-decoration)' }} />
          {selectedWoods.map((w, i) => (
            <Radar
              key={w.id}
              name={w.nameDa ?? w.id}
              dataKey={w.id}
              stroke={COLORS[i]}
              fill={COLORS[i]}
              fillOpacity={0.15}
            />
          ))}
          <Legend wrapperStyle={{ fontSize: '12px' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
