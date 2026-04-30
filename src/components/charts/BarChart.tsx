import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useStore } from '../../store/useStore'
import { getNumericProperties } from '../../data/utils'
import type { Wood } from '../../data/types'

interface Props {
  woods: Wood[]
}

export function WoodBarChart({ woods }: Props) {
  const selectedIds = useStore((s) => s.selectedIds)
  const barProperty = useStore((s) => s.barProperty)
  const setBarProperty = useStore((s) => s.setBarProperty)
  const language = useStore((s) => s.language)

  const numericKeys = getNumericProperties(woods)
  const effectiveProperty = barProperty || numericKeys[0] || ''
  const selectedWoods = woods.filter((w) => selectedIds.includes(w.id))

  const data = selectedWoods.map((w) => {
    const pv = w.properties[effectiveProperty]
    return {
      name: (language === 'da' ? w.nameDa : w.nameEn) ?? w.id,
      value: pv?.type === 'numeric' ? pv.value : null,
    }
  })

  return (
    <div>
      <select
        value={effectiveProperty}
        onChange={(e) => setBarProperty(e.target.value)}
      >
        {numericKeys.map((key) => (
          <option key={key} value={key}>{key}</option>
        ))}
      </select>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
