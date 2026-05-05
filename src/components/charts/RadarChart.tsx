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

const COLORS = ['#3c453b', '#987f67', '#86968f', '#3f342f', '#c6a882', '#5a6e5a']

export function WoodRadarChart({ woods }: Props) {
  const radarWarning = useStore((s) => s.radarWarning)
  const selectedIds = useStore((s) => s.selectedIds)

  const numericKeys = getNumericProperties(woods)
  const selectedWoods = woods
    .filter((w) => selectedIds.includes(w.id))
    .slice(0, 6)

  if (selectedIds.length === 0) {
    return <p className="chart-empty">{dict.chartPlaceholder}</p>
  }

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
      <ResponsiveContainer width="100%" height={420}>
        <RadarChart data={data}>
          <PolarGrid stroke="#c6c4b3" />
          <PolarAngleAxis dataKey="property" tick={{ fontSize: 11, fill: '#86968f' }} />
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
