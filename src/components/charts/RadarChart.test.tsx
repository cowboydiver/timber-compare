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
    imageUrl: 'oak.jpg',
    properties: {
      weight: { type: 'numeric', value: 700, unit: 'kg/m3' },
      janka_hardness: { type: 'numeric', value: 1290, unit: '' },
      origin: { type: 'nominal', value: 'Europe' },
    },
  },
]

beforeEach(() => {
  useStore.setState({ selectedIds: [], activeTab: 'radar' })
})

describe('WoodRadarChart', () => {
  it('shows radar warning banner when more than 6 woods are selected', () => {
    useStore.setState({ selectedIds: ['a', 'b', 'c', 'd', 'e', 'f', 'g'] })
    render(<WoodRadarChart woods={woods} />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('does not show warning banner when 6 or fewer woods are selected', () => {
    useStore.setState({ selectedIds: ['oak'] })
    render(<WoodRadarChart woods={woods} />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
