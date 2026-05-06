import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WoodScatterChart } from './ScatterChart'
import { useStore } from '../../store/useStore'
import type { Wood } from '../../data/types'

vi.mock('recharts', async () => {
  const actual = await vi.importActual<typeof import('recharts')>('recharts')
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    ScatterChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Scatter: ({ name }: { name?: string }) => <div data-testid="scatter-group">{name}</div>,
    XAxis: () => null,
    YAxis: () => null,
    Tooltip: () => null,
    Legend: () => null,
  }
})

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
  {
    id: 'teak',
    nameDa: 'Teak',
    nameEn: 'Teak',
    category: 'tropical',
    imageUrl: 'teak.jpg',
    properties: {
      weight: { type: 'numeric', value: 630, unit: 'kg/m3' },
      janka_hardness: { type: 'numeric', value: 1000, unit: '' },
      origin: { type: 'nominal', value: 'Asia' },
    },
  },
]

beforeEach(() => {
  useStore.setState({
    selectedIds: ['oak', 'teak'],
    activeTab: 'scatter',
    scatterX: '',
    scatterY: '',
    scatterColor: '',
    hiddenIds: [],
    hoveredKey: null,
    colorBy: 'category',
  })
})

describe('WoodScatterChart', () => {
  it('renders scatter groups for selected woods', () => {
    render(<WoodScatterChart woods={woods} />)
    const groups = screen.getAllByTestId('scatter-group')
    expect(groups.length).toBeGreaterThan(0)
  })

  it('renders one group per category when colorBy is category', () => {
    useStore.setState({ colorBy: 'category' })
    render(<WoodScatterChart woods={woods} />)
    const groups = screen.getAllByTestId('scatter-group')
    const names = groups.map((g) => g.textContent)
    expect(names).toContain('Europæisk')
    expect(names).toContain('Tropisk')
  })

  it('renders one group per origin when colorBy is origin', () => {
    useStore.setState({ colorBy: 'origin' })
    render(<WoodScatterChart woods={woods} />)
    const groups = screen.getAllByTestId('scatter-group')
    const names = groups.map((g) => g.textContent)
    expect(names).toContain('Europe')
    expect(names).toContain('Asia')
  })

  it('shows placeholder when no woods are selected', () => {
    useStore.setState({ selectedIds: [] })
    render(<WoodScatterChart woods={woods} />)
    expect(screen.getByText(/Vælg træsorter/i)).toBeInTheDocument()
  })
})
