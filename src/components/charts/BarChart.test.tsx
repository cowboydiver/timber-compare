import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WoodBarChart } from './BarChart'
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
  {
    id: 'ash',
    nameDa: 'Ask',
    nameEn: 'Ash',
    category: 'european',
    applications: ['sawn_lumber'],
    imageUrl: 'ash.jpg',
    properties: {
      weight: { type: 'numeric', value: 650, unit: 'kg/m3' },
      janka_hardness: { type: 'numeric', value: 760, unit: '' },
      origin: { type: 'nominal', value: 'Europe' },
    },
  },
]

beforeEach(() => {
  useStore.setState({
    selectedIds: ['oak', 'ash'],
    activeTab: 'bar',
    barProperty: '',
    hiddenIds: [],
    hoveredKey: null,
    colorBy: 'category',
  })
})

describe('WoodBarChart', () => {
  it('renders without crashing when woods are selected', () => {
    render(<WoodBarChart woods={woods} />)
    expect(screen.queryByText(/Vælg træsorter/i)).not.toBeInTheDocument()
  })

  it('shows placeholder when no woods are selected', () => {
    useStore.setState({ selectedIds: [] })
    render(<WoodBarChart woods={woods} />)
    expect(screen.getByText(/Vælg træsorter/i)).toBeInTheDocument()
  })
})
