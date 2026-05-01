import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { useStore } from '../../store/useStore'
import { getNumericProperties } from '../../data/utils'
import { dict } from '../../i18n/dictionary'
import type { Wood } from '../../data/types'

interface Props {
  woods: Wood[]
}

const COLORS = ['#8B6914', '#5C8A3C', '#2E6B8A', '#8A3C2E', '#6B2E8A', '#2E8A6B']

export function WoodRadarChart({ woods }: Props) {
  const radarWarning = useStore((s) => s.radarWarning)
  const selectedIds = useStore((s) => s.selectedIds)

  const numericKeys = getNumericProperties(woods)
  const selectedWoods = woods
    .filter((w) => selectedIds.includes(w.id))
    .slice(0, 6)

  const data = numericKeys.map((key) => {
    const entry: Record<string, string | number> = { property: key }
    for (const w of selectedWoods) {
      const pv = w.properties[key]
      entry[w.id] = pv?.type === 'numeric' ? pv.value : 0
    }
    return entry
  })

  return (
    <div>
      {radarWarning && <p role="alert">{dict.radarWarning}</p>}
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="property" />
          {selectedWoods.map((w, i) => (
            <Radar
              key={w.id}
              name={w.nameDa ?? w.id}
              dataKey={w.id}
              stroke={COLORS[i]}
              fill={COLORS[i]}
              fillOpacity={0.2}
            />
          ))}
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
