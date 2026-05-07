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
    applications: ['sawn_lumber'],
    imageUrl: 'oak.jpg',
    properties: {
      weight: { type: 'numeric', value: 700, unit: 'kg/m3' },
      origin: { type: 'nominal', value: 'Europe' },
    },
  },
]

beforeEach(() => {
  useStore.setState({
    selectedIds: ['oak'],
    activeTab: 'radar',
    barProperty: '',
    scatterX: '',
    scatterY: '',
    scatterColor: '',
    hiddenIds: [],
    hoveredKey: null,
    colorBy: 'category',
  })
})

describe('ChartPanel', () => {
  it('renders Radar, Bar and Scatter tabs', () => {
    render(<ChartPanel woods={woods} />)
    expect(screen.getByRole('tab', { name: /Radar/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Søjle/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Punkter/i })).toBeInTheDocument()
  })

  it('clicking a tab updates activeTab in store', () => {
    render(<ChartPanel woods={woods} />)
    fireEvent.click(screen.getByRole('tab', { name: /Søjle/i }))
    expect(useStore.getState().activeTab).toBe('bar')
  })

  it('shows bar property and color dropdowns when bar tab is active', () => {
    useStore.setState({ activeTab: 'bar' })
    render(<ChartPanel woods={woods} />)
    expect(screen.getByLabelText('Egenskab')).toBeInTheDocument()
    expect(screen.getByLabelText('Farve')).toBeInTheDocument()
  })

  it('shows X-axis dropdown when scatter tab is active', () => {
    useStore.setState({ activeTab: 'scatter' })
    render(<ChartPanel woods={woods} />)
    expect(screen.getByLabelText(/x.akse/i)).toBeInTheDocument()
  })

  it('does not show normalization info text on radar tab', () => {
    render(<ChartPanel woods={woods} />)
    expect(screen.queryByText(/Normaliseret 0–100/i)).not.toBeInTheDocument()
  })

  it('ArrowRight moves focus to next tab and activates it', () => {
    render(<ChartPanel woods={woods} />)
    const radarTab = screen.getByRole('tab', { name: /Radar/i })
    radarTab.focus()
    fireEvent.keyDown(radarTab, { key: 'ArrowRight' })
    expect(useStore.getState().activeTab).toBe('bar')
    expect(screen.getByRole('tab', { name: /Søjle/i })).toHaveFocus()
  })

  it('ArrowLeft wraps from first tab to last tab', () => {
    render(<ChartPanel woods={woods} />)
    const radarTab = screen.getByRole('tab', { name: /Radar/i })
    radarTab.focus()
    fireEvent.keyDown(radarTab, { key: 'ArrowLeft' })
    expect(useStore.getState().activeTab).toBe('scatter')
    expect(screen.getByRole('tab', { name: /Punkter/i })).toHaveFocus()
  })

  it('shows the status footer', () => {
    render(<ChartPanel woods={woods} />)
    expect(screen.getByText(/træsorter sammenlignes/i)).toBeInTheDocument()
  })
})
