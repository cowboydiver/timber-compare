import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Sidebar } from './Sidebar'
import { useStore } from '../../store/useStore'
import type { Wood } from '../../data/types'

const woods: Wood[] = [
  { id: 'oak', nameDa: 'Eg', nameEn: 'Oak', category: 'european', imageUrl: '', properties: {} },
  { id: 'teak', nameDa: 'Teak', nameEn: 'Teak', category: 'tropical', imageUrl: '', properties: {} },
  { id: 'walnut', nameDa: 'Valnød', nameEn: 'Walnut', category: 'american', imageUrl: '', properties: {} },
]

beforeEach(() => {
  useStore.setState({ selectedIds: [], activeTab: 'radar', radarWarning: false, barProperty: '', scatterX: '', scatterY: '', scatterColor: '' })
})

describe('Sidebar', () => {
  it('renders Danish wood names', () => {
    render(<Sidebar woods={woods} />)
    expect(screen.getByText('Eg')).toBeInTheDocument()
    expect(screen.getByText('Teak')).toBeInTheDocument()
    expect(screen.getByText('Valnød')).toBeInTheDocument()
  })

  it('search filters by Danish name (case-insensitive)', () => {
    render(<Sidebar woods={woods} />)
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'val' } })
    expect(screen.getByText('Valnød')).toBeInTheDocument()
    expect(screen.queryByText('Eg')).not.toBeInTheDocument()
  })

  it('category filter buttons narrow the list', () => {
    render(<Sidebar woods={woods} />)
    fireEvent.click(screen.getByRole('button', { name: 'Tropisk' }))
    expect(screen.getByText('Teak')).toBeInTheDocument()
    expect(screen.queryByText('Eg')).not.toBeInTheDocument()
  })

  it('clicking a wood adds it to selectedIds', () => {
    render(<Sidebar woods={woods} />)
    fireEvent.click(screen.getByText('Eg'))
    expect(useStore.getState().selectedIds).toContain('oak')
  })

  it('clicking a selected wood deselects it', () => {
    useStore.setState({ selectedIds: ['oak'] } as Parameters<typeof useStore.setState>[0])
    render(<Sidebar woods={woods} />)
    fireEvent.click(screen.getByText('Eg'))
    expect(useStore.getState().selectedIds).not.toContain('oak')
  })
})
