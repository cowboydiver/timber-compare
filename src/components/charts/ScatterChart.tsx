import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useStore } from '../../store/useStore'
import { getNumericProperties, getNominalProperties } from '../../data/utils'
import { dict } from '../../i18n/dictionary'
import { COLORS } from './palette'
import type { Wood } from '../../data/types'

interface Props {
  woods: Wood[]
}

type DataPoint = {
  x: number
  y: number
  name: string
  imageUrl: string
  colorGroup: string
}

type ScatterGroup = { name: string; color: string; data: DataPoint[] }

export function WoodScatterChart({ woods }: Props) {
  const selectedIds = useStore((s) => s.selectedIds)
  const scatterX = useStore((s) => s.scatterX)
  const scatterY = useStore((s) => s.scatterY)
  const scatterColor = useStore((s) => s.scatterColor)
  const setScatterX = useStore((s) => s.setScatterX)
  const setScatterY = useStore((s) => s.setScatterY)
  const setScatterColor = useStore((s) => s.setScatterColor)

  const numericKeys = getNumericProperties(woods)
  const nominalKeys = getNominalProperties(woods)

  const effectiveX = scatterX || numericKeys[0] || ''
  const effectiveY = scatterY || numericKeys[1] || numericKeys[0] || ''
  const effectiveColor = scatterColor || nominalKeys[0] || ''

  const selectedWoods = woods.filter((w) => selectedIds.includes(w.id))

  if (selectedIds.length === 0) {
    return <p className="chart-empty">{dict.chartPlaceholder}</p>
  }

  const hasColorGrouping = nominalKeys.length > 0

  let groups: ScatterGroup[]

  if (hasColorGrouping && effectiveColor) {
    const valueMap = new Map<string, { colorIdx: number; data: DataPoint[] }>()

    for (const w of selectedWoods) {
      const cv = w.properties[effectiveColor]
      if (cv?.type !== 'nominal') continue

      const val = cv.value
      if (!valueMap.has(val)) {
        valueMap.set(val, { colorIdx: valueMap.size, data: [] })
      }

      const xv = w.properties[effectiveX]
      const yv = w.properties[effectiveY]
      if (xv?.type !== 'numeric' || yv?.type !== 'numeric') continue

      valueMap.get(val)!.data.push({
        x: xv.value,
        y: yv.value,
        name: w.nameDa ?? w.id,
        imageUrl: w.imageUrl,
        colorGroup: val,
      })
    }

    groups = [...valueMap.entries()].map(([name, { colorIdx, data }]) => ({
      name,
      color: COLORS[colorIdx % COLORS.length],
      data,
    }))
  } else {
    const data = selectedWoods.flatMap((w) => {
      const xv = w.properties[effectiveX]
      const yv = w.properties[effectiveY]
      if (xv?.type !== 'numeric' || yv?.type !== 'numeric') return []
      return [{
        x: xv.value,
        y: yv.value,
        name: w.nameDa ?? w.id,
        imageUrl: w.imageUrl,
        colorGroup: '',
      }]
    })
    groups = [{ name: '', color: '#987f67', data }]
  }

  return (
    <div>
      <div className="chart-controls">
        <label htmlFor="scatter-x">X-akse</label>
        <select
          id="scatter-x"
          value={effectiveX}
          onChange={(e) => setScatterX(e.target.value)}
        >
          {numericKeys.map((key) => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>

        <label htmlFor="scatter-y">Y-akse</label>
        <select
          id="scatter-y"
          value={effectiveY}
          onChange={(e) => setScatterY(e.target.value)}
        >
          {numericKeys.map((key) => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>

        {nominalKeys.length > 0 && (
          <>
            <label htmlFor="scatter-color">Farve</label>
            <select
              id="scatter-color"
              value={effectiveColor}
              onChange={(e) => setScatterColor(e.target.value)}
            >
              {nominalKeys.map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </>
        )}
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 4, right: 24, left: 0, bottom: 4 }}>
          <XAxis dataKey="x" name={effectiveX} tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} label={{ value: effectiveX, position: 'insideBottom', offset: -4, fontSize: 11, fill: 'var(--color-text-muted)' }} />
          <YAxis dataKey="y" name={effectiveY} tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} label={{ value: effectiveY, angle: -90, position: 'insideLeft', fontSize: 11, fill: 'var(--color-text-muted)' }} />
          <Tooltip
            content={({ payload }) => {
              if (!payload?.length) return null
              const d = payload[0]?.payload as DataPoint
              return (
                <div style={{ background: '#fff', border: '1px solid #c6c4b3', borderRadius: 3, padding: '8px 10px', fontSize: 12 }}>
                  {d.imageUrl && <img src={d.imageUrl} alt={d.name} width={56} style={{ display: 'block', marginBottom: 6, borderRadius: 2 }} />}
                  <strong style={{ color: '#3c453b' }}>{d.name}</strong>
                  <div style={{ color: 'var(--color-text-muted)', marginTop: 4 }}>{effectiveX}: {d.x}</div>
                  <div style={{ color: 'var(--color-text-muted)' }}>{effectiveY}: {d.y}</div>
                  {d.colorGroup && <div style={{ color: 'var(--color-text-muted)' }}>{effectiveColor}: {d.colorGroup}</div>}
                </div>
              )
            }}
          />
          {groups.map(({ name, color, data }) => (
            <Scatter key={name || 'default'} name={name} data={data} fill={color} />
          ))}
          {hasColorGrouping && <Legend wrapperStyle={{ fontSize: '12px' }} />}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
