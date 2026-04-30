import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChartPanel } from './ChartPanel'
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
      origin: { type: 'nominal', value: 'Europe' },
    },
  },
]

beforeEach(() => {
  useStore.setState({ selectedIds: ['oak'], language: 'en', activeTab: 'radar', radarWarning: false, barProperty: '', scatterX: '', scatterY: '', scatterColor: '' })
})

describe('ChartPanel', () => {
  it('renders Radar, Bar and Scatter tabs', () => {
    render(<ChartPanel woods={woods} />)
    expect(screen.getByRole('tab', { name: /radar/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /bar/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /scatter/i })).toBeInTheDocument()
  })

  it('clicking a tab updates activeTab in store', () => {
    render(<ChartPanel woods={woods} />)
    fireEvent.click(screen.getByRole('tab', { name: /bar/i }))
    expect(useStore.getState().activeTab).toBe('bar')
  })

  it('shows bar property dropdown when bar tab is active', () => {
    useStore.setState({ activeTab: 'bar' })
    render(<ChartPanel woods={woods} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('shows X-axis dropdown when scatter tab is active', () => {
    useStore.setState({ activeTab: 'scatter' })
    render(<ChartPanel woods={woods} />)
    expect(screen.getByLabelText(/x.axis/i)).toBeInTheDocument()
  })
})
