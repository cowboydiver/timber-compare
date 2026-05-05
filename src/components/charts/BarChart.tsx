import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { useStore } from '../../store/useStore'
import { getNumericProperties, propertyLabel } from '../../data/utils'
import { dict } from '../../i18n/dictionary'
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

  const allData = selectedWoods.map((w) => {
    const pv = w.properties[effectiveProperty]
    return {
      name: w.nameDa ?? w.id,
      value: pv?.type === 'numeric' ? pv.value : null,
      unit: pv?.type === 'numeric' ? pv.unit : '',
    }
  })

  const data = allData.filter((d) => d.value !== null)
  const dropped = allData.filter((d) => d.value === null).map((d) => d.name)
  const unit = data[0]?.unit ?? ''

  return (
    <div>
      <div className="chart-controls">
        <label htmlFor="bar-property">{dict.property}</label>
        <select
          id="bar-property"
          value={effectiveProperty}
          onChange={(e) => setBarProperty(e.target.value)}
        >
          {numericKeys.map((key) => (
            <option key={key} value={key}>{propertyLabel(key)}</option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-muted-decoration)" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} angle={-35} textAnchor="end" interval={0} />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
            tickFormatter={(v) => unit ? `${v} ${unit}` : `${v}`}
          />
          <Tooltip
            contentStyle={{ fontSize: '12px', borderColor: 'var(--color-border)' }}
            formatter={(v) => [`${v}${unit ? ` ${unit}` : ''}`, propertyLabel(effectiveProperty)]}
          />
          <Bar dataKey="value" radius={[2, 2, 0, 0]} fill="#987f67" />
        </BarChart>
      </ResponsiveContainer>
      {dropped.length > 0 && (
        <p className="chart-footnote">
          Ikke vist (ingen data): {dropped.join(', ')}
        </p>
      )}
    </div>
  )
}
