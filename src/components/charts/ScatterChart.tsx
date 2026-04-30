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
  const language = useStore((s) => s.language)

  const numericKeys = getNumericProperties(woods)
  const nominalKeys = getNominalProperties(woods)

  const effectiveX = scatterX || numericKeys[0] || ''
  const effectiveY = scatterY || numericKeys[1] || numericKeys[0] || ''
  const effectiveColor = scatterColor || nominalKeys[0] || ''

  const selectedWoods = woods.filter((w) => selectedIds.includes(w.id))

  const data = selectedWoods.flatMap((w) => {
    const xv = w.properties[effectiveX]
    const yv = w.properties[effectiveY]
    if (xv?.type !== 'numeric' || yv?.type !== 'numeric') return []
    return [{
      x: xv.value,
      y: yv.value,
      name: (language === 'da' ? w.nameDa : w.nameEn) ?? w.id,
      imageUrl: w.imageUrl,
    }]
  })

  return (
    <div>
      <div>
        <label htmlFor="scatter-x">X-axis</label>
        <select
          id="scatter-x"
          value={effectiveX}
          onChange={(e) => setScatterX(e.target.value)}
        >
          {numericKeys.map((key) => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>

        <label htmlFor="scatter-y">Y-axis</label>
        <select
          id="scatter-y"
          value={effectiveY}
          onChange={(e) => setScatterY(e.target.value)}
        >
          {numericKeys.map((key) => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>

        <label htmlFor="scatter-color">Color</label>
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
        <ScatterChart>
          <XAxis dataKey="x" name={effectiveX} />
          <YAxis dataKey="y" name={effectiveY} />
          <Tooltip
            content={({ payload }) => {
              if (!payload?.length) return null
              const d = payload[0]?.payload as { name: string; x: number; y: number; imageUrl: string }
              return (
                <div>
                  <img src={d.imageUrl} alt={d.name} width={60} />
                  <p>{d.name}</p>
                  <p>{effectiveX}: {d.x}</p>
                  <p>{effectiveY}: {d.y}</p>
                </div>
              )
            }}
          />
          <Scatter data={data} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
