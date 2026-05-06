import {
  ScatterChart,
  Scatter,
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

type DataPoint = {
  x: number
  y: number
  name: string
  imageUrl: string
}

type ScatterGroup = { name: string; color: string; data: DataPoint[] }

export function WoodScatterChart({ woods }: Props) {
  const selectedIds = useStore((s) => s.selectedIds)
  const hiddenIds   = useStore((s) => s.hiddenIds)
  const hoveredKey  = useStore((s) => s.hoveredKey)
  const colorBy     = useStore((s) => s.colorBy)
  const scatterX    = useStore((s) => s.scatterX)
  const scatterY    = useStore((s) => s.scatterY)

  const numericKeys = getNumericProperties(woods)
  const effectiveX  = scatterX || numericKeys[0] || ''
  const effectiveY  = scatterY || numericKeys[1] || numericKeys[0] || ''

  const selectedWoods = selectedIds
    .map((id) => woods.find((w) => w.id === id))
    .filter((w): w is Wood => w !== undefined)
    .filter((w) => !hiddenIds.includes(w.id))

  if (selectedIds.length === 0) {
    return <p className="chart-empty">{dict.chartPlaceholder}</p>
  }

  const groupMap = new Map<string, ScatterGroup>()
  for (const w of selectedWoods) {
    const xv = w.properties[effectiveX]
    const yv = w.properties[effectiveY]
    if (xv?.type !== 'numeric' || yv?.type !== 'numeric') continue

    const origin = w.properties['origin']?.type === 'nominal' ? w.properties['origin'].value : ''
    const key   = groupKey(w.category, origin, colorBy)
    const color = groupColor(w.category, origin, colorBy)

    if (!groupMap.has(key)) {
      groupMap.set(key, { name: key, color, data: [] })
    }
    groupMap.get(key)!.data.push({
      x: xv.value,
      y: yv.value,
      name: w.nameDa ?? w.id,
      imageUrl: w.imageUrl,
    })
  }

  const groups = [...groupMap.values()]
  const anyHovered = hoveredKey !== null

  return (
    <div style={{ width: '100%', flex: '1 1 0', minHeight: 0 }}>
      <ResponsiveContainer width="100%" height="100%" minHeight={260}>
        <ScatterChart margin={{ top: 4, right: 24, left: 24, bottom: 4 }}>
          <CartesianGrid stroke="var(--color-muted-decoration)" />
          <XAxis
            dataKey="x"
            name={effectiveX}
            tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
            label={{ value: propertyLabel(effectiveX), position: 'insideBottom', offset: -4, fontSize: 11, fill: 'var(--color-text-muted)' }}
          />
          <YAxis
            dataKey="y"
            name={effectiveY}
            tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
            label={{ value: propertyLabel(effectiveY), angle: -90, position: 'insideLeft', fontSize: 11, fill: 'var(--color-text-muted)' }}
          />
          <Tooltip
            content={({ payload }) => {
              if (!payload?.length) return null
              const d = payload[0]?.payload as DataPoint
              return (
                <div style={{ background: '#fff', border: '1px solid #c6c4b3', borderRadius: 3, padding: '8px 10px', fontSize: 12 }}>
                  {d.imageUrl && <img src={d.imageUrl} alt={d.name} width={56} style={{ display: 'block', marginBottom: 6, borderRadius: 2 }} />}
                  <strong style={{ color: '#3c453b' }}>{d.name}</strong>
                  <div style={{ color: 'var(--color-text-muted)', marginTop: 4 }}>{propertyLabel(effectiveX)}: {d.x}</div>
                  <div style={{ color: 'var(--color-text-muted)' }}>{propertyLabel(effectiveY)}: {d.y}</div>
                </div>
              )
            }}
          />
          {groups.map(({ name, color, data }) => {
            const dim = anyHovered && hoveredKey !== name
            return (
              <Scatter
                key={name || 'default'}
                name={name}
                data={data}
                fill={color}
                opacity={dim ? 0.15 : 1}
              />
            )
          })}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
