import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChartPanel } from './ChartPanel'
import { useStore } from '../../store/useStore'

beforeEach(() => {
  useStore.setState({ selectedIds: [], language: 'en', activeTab: 'radar', radarWarning: false, barProperty: '', scatterX: '', scatterY: '', scatterColor: '' })
})

describe('ChartPanel', () => {
  it('renders Radar, Bar and Scatter tabs', () => {
    render(<ChartPanel />)
    expect(screen.getByRole('tab', { name: /radar/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /bar/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /scatter/i })).toBeInTheDocument()
  })

  it('clicking a tab updates activeTab in store', () => {
    render(<ChartPanel />)
    fireEvent.click(screen.getByRole('tab', { name: /bar/i }))
    expect(useStore.getState().activeTab).toBe('bar')
  })
})
