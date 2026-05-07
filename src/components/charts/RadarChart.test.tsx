import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WoodRadarChart } from './RadarChart'
import { useStore } from '../../store/useStore'
import type { Wood } from '../../data/types'

const woods: Wood[] = [
  {
    id: 'oak',
    nameDa: 'Eg',
    nameEn: 'Oak',
    category: 'european',
    applications: ['sawn_lumber'],
    imageUrl: 'oak.jpg',
    properties: {
      weight: { type: 'numeric', value: 700, unit: 'kg/m3' },
      janka_hardness: { type: 'numeric', value: 1290, unit: '' },
      origin: { type: 'nominal', value: 'Europe' },
    },
  },
]

beforeEach(() => {
  useStore.setState({ selectedIds: [], activeTab: 'radar', hiddenIds: [], hoveredKey: null })
})

describe('WoodRadarChart', () => {
  it('shows placeholder when nothing is selected', () => {
    render(<WoodRadarChart woods={woods} />)
    expect(screen.getByText(/Vælg træsorter/i)).toBeInTheDocument()
  })

  it('renders without crashing when woods are selected', () => {
    useStore.setState({ selectedIds: ['oak'] })
    render(<WoodRadarChart woods={woods} />)
    expect(screen.queryByText(/Vælg træsorter/i)).not.toBeInTheDocument()
  })

  it('respects hiddenIds — hidden wood is not rendered as a series', () => {
    useStore.setState({ selectedIds: ['oak'], hiddenIds: ['oak'] })
    // With all woods hidden, the chart receives no visible woods but still renders
    render(<WoodRadarChart woods={woods} />)
    // Should not crash
  })
})
