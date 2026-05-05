import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useStore } from '../../store/useStore'
import { getNumericProperties, getNominalProperties } from '../../data/utils'
import { dict } from '../../i18n/dictionary'
import type { Wood } from '../../data/types'

interface Props {
  woods: Wood[]
}

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

  const data = selectedWoods.flatMap((w) => {
    const xv = w.properties[effectiveX]
    const yv = w.properties[effectiveY]
    if (xv?.type !== 'numeric' || yv?.type !== 'numeric') return []
    return [{
      x: xv.value,
      y: yv.value,
      name: w.nameDa ?? w.id,
      imageUrl: w.imageUrl,
    }]
  })

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
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 4, right: 24, left: 0, bottom: 4 }}>
          <XAxis dataKey="x" name={effectiveX} tick={{ fontSize: 11, fill: '#86968f' }} label={{ value: effectiveX, position: 'insideBottom', offset: -4, fontSize: 11, fill: '#86968f' }} />
          <YAxis dataKey="y" name={effectiveY} tick={{ fontSize: 11, fill: '#86968f' }} label={{ value: effectiveY, angle: -90, position: 'insideLeft', fontSize: 11, fill: '#86968f' }} />
          <Tooltip
            contentStyle={{ fontSize: '12px', borderColor: '#c6c4b3' }}
            content={({ payload }) => {
              if (!payload?.length) return null
              const d = payload[0]?.payload as { name: string; x: number; y: number; imageUrl: string }
              return (
                <div style={{ background: '#fff', border: '1px solid #c6c4b3', borderRadius: 3, padding: '8px 10px', fontSize: 12 }}>
                  {d.imageUrl && <img src={d.imageUrl} alt={d.name} width={56} style={{ display: 'block', marginBottom: 6, borderRadius: 2 }} />}
                  <strong style={{ color: '#3c453b' }}>{d.name}</strong>
                  <div style={{ color: '#86968f', marginTop: 4 }}>{effectiveX}: {d.x}</div>
                  <div style={{ color: '#86968f' }}>{effectiveY}: {d.y}</div>
                </div>
              )
            }}
          />
          <Scatter data={data} fill="#987f67" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
