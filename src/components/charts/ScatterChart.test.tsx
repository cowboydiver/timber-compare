import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { WoodScatterChart } from './ScatterChart'
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
  })
})

describe('WoodScatterChart', () => {
  it('renders X-axis, Y-axis, and color dropdowns', () => {
    render(<WoodScatterChart woods={woods} />)
    expect(screen.getByLabelText(/x.akse/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/y.akse/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/farve/i)).toBeInTheDocument()
  })

  it('changing X dropdown updates scatterX in store', () => {
    render(<WoodScatterChart woods={woods} />)
    fireEvent.change(screen.getByLabelText(/x.akse/i), { target: { value: 'janka_hardness' } })
    expect(useStore.getState().scatterX).toBe('janka_hardness')
  })

  it('changing Y dropdown updates scatterY in store', () => {
    render(<WoodScatterChart woods={woods} />)
    fireEvent.change(screen.getByLabelText(/y.akse/i), { target: { value: 'weight' } })
    expect(useStore.getState().scatterY).toBe('weight')
  })

  it('changing color dropdown updates scatterColor in store', () => {
    render(<WoodScatterChart woods={woods} />)
    fireEvent.change(screen.getByLabelText(/farve/i), { target: { value: 'origin' } })
    expect(useStore.getState().scatterColor).toBe('origin')
  })
})
