import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { useStore } from '../../store/useStore'
import { getNumericProperties } from '../../data/utils'
import { dict } from '../../i18n/dictionary'
import { COLORS } from './palette'
import type { Wood } from '../../data/types'

interface Props {
  woods: Wood[]
}

export function WoodBarChart({ woods }: Props) {
  const selectedIds = useStore((s) => s.selectedIds)
  const barProperty = useStore((s) => s.barProperty)
  const setBarProperty = useStore((s) => s.setBarProperty)

  const numericKeys = getNumericProperties(woods)
  const effectiveProperty = barProperty || numericKeys[0] || ''
  const selectedWoods = woods.filter((w) => selectedIds.includes(w.id))

  if (selectedIds.length === 0) {
    return <p className="chart-empty">{dict.chartPlaceholder}</p>
  }

  const data = selectedWoods.map((w) => {
    const pv = w.properties[effectiveProperty]
    return {
      name: w.nameDa ?? w.id,
      value: pv?.type === 'numeric' ? pv.value : null,
      unit: pv?.type === 'numeric' ? pv.unit : '',
    }
  })

  return (
    <div>
      <div className="chart-controls">
        <label htmlFor="bar-property">Egenskab</label>
        <select
          id="bar-property"
          value={effectiveProperty}
          onChange={(e) => setBarProperty(e.target.value)}
        >
          {numericKeys.map((key) => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 60 }}>
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} angle={-35} textAnchor="end" interval={0} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} />
          <Tooltip
            contentStyle={{ fontSize: '12px', borderColor: 'var(--color-border)' }}
            formatter={(v, _n, entry) => [`${v} ${entry.payload.unit ?? ''}`.trim(), effectiveProperty]}
          />
          <Bar dataKey="value" radius={[2, 2, 0, 0]}>
            {data.map((_entry, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
