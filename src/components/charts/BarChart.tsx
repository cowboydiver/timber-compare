import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { useStore } from '../../store/useStore'
import { getNumericProperties, propertyLabel } from '../../data/utils'
import { dict } from '../../i18n/dictionary'
import { groupColor, groupKey } from './palette'
import type { Wood } from '../../data/types'

interface Props {
  woods: Wood[]
}

export function WoodBarChart({ woods }: Props) {
  const selectedIds = useStore((s) => s.selectedIds)
  const hiddenIds   = useStore((s) => s.hiddenIds)
  const hoveredKey  = useStore((s) => s.hoveredKey)
  const barProperty = useStore((s) => s.barProperty)
  const colorBy     = useStore((s) => s.colorBy)

  const numericKeys = getNumericProperties(woods)
  const effectiveProperty = barProperty || numericKeys[0] || ''

  const selectedWoods = selectedIds
    .map((id) => woods.find((w) => w.id === id))
    .filter((w): w is Wood => w !== undefined)
    .filter((w) => !hiddenIds.includes(w.id))

  if (selectedIds.length === 0) {
    return <p className="chart-empty">{dict.chartPlaceholder}</p>
  }

  const allData = selectedWoods.map((w) => {
    const pv = w.properties[effectiveProperty]
    const origin = w.properties['origin']?.type === 'nominal' ? w.properties['origin'].value : ''
    return {
      name: w.nameDa ?? w.id,
      value: pv?.type === 'numeric' ? pv.value : null,
      unit: pv?.type === 'numeric' ? pv.unit : '',
      category: w.category,
      origin,
    }
  })

  const data = allData.filter((d) => d.value !== null)
  const dropped = allData.filter((d) => d.value === null).map((d) => d.name)
  const unit = data[0]?.unit ?? ''
  const anyHovered = hoveredKey !== null

  return (
    <div style={{ width: '100%', flex: '1 1 0', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <ResponsiveContainer width="100%" height="100%" minHeight={260}>
        <BarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-muted-decoration)" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
            angle={-35}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
            tickFormatter={(v) => unit ? `${v} ${unit}` : `${v}`}
          />
          <Tooltip
            contentStyle={{ fontSize: '12px', borderColor: 'var(--color-border)' }}
            formatter={(v) => [`${v}${unit ? ` ${unit}` : ''}`, propertyLabel(effectiveProperty)]}
          />
          <Bar dataKey="value" radius={[2, 2, 0, 0]}>
            {data.map((entry, index) => {
              const grp = groupKey(entry.category, entry.origin, colorBy)
              const color = groupColor(entry.category, entry.origin, colorBy)
              const dim = anyHovered && hoveredKey !== grp
              return (
                <Cell
                  key={index}
                  fill={color}
                  opacity={dim ? 0.15 : 1}
                />
              )
            })}
          </Bar>
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
