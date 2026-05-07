import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Sidebar } from './Sidebar'
import { useStore } from '../../store/useStore'
import type { Wood } from '../../data/types'

const woods: Wood[] = [
  {
    id: 'oak',
    nameDa: 'Eg',
    nameEn: 'Oak',
    category: 'european',
    applications: ['sawn_lumber'],
    imageUrl: '',
    properties: {
      botanical_name: { type: 'nominal', value: 'Quercus robur' },
      weight: { type: 'numeric', value: 700, unit: 'kg/m3' },
      janka_hardness: { type: 'numeric', value: 650, unit: '' },
      modulus_of_rupture: { type: 'numeric', value: 97, unit: 'MPa' },
      modulus_of_elasticity: { type: 'numeric', value: 10.6, unit: 'GPa' },
    },
  },
  {
    id: 'teak',
    nameDa: 'Teak',
    nameEn: 'Teak',
    category: 'tropical',
    applications: ['sawn_lumber'],
    imageUrl: '',
    properties: {},
  },
]

beforeEach(() => {
  useStore.setState({ selectedIds: [], hiddenIds: [], hoveredKey: null })
})

describe('Sidebar', () => {
  it('shows specimen cards only for selected woods', () => {
    useStore.setState({ selectedIds: ['oak'] } as Parameters<typeof useStore.setState>[0])
    render(<Sidebar woods={woods} />)
    expect(screen.getByText('Eg')).toBeInTheDocument()
    expect(screen.queryByText('Teak')).not.toBeInTheDocument()
  })

  it('shows the Aktuelt udvalg heading', () => {
    render(<Sidebar woods={woods} />)
    expect(screen.getByText('Aktuelt udvalg')).toBeInTheDocument()
  })

  it('shows botanical name on the specimen card', () => {
    useStore.setState({ selectedIds: ['oak'] } as Parameters<typeof useStore.setState>[0])
    render(<Sidebar woods={woods} />)
    expect(screen.getByText('Quercus robur')).toBeInTheDocument()
  })

  it('remove button deselects the wood', () => {
    useStore.setState({ selectedIds: ['oak'] } as Parameters<typeof useStore.setState>[0])
    render(<Sidebar woods={woods} />)
    fireEvent.click(screen.getByRole('button', { name: /Fjern Eg/i }))
    expect(useStore.getState().selectedIds).not.toContain('oak')
  })

  it('Ryd alt clears all selections', () => {
    useStore.setState({ selectedIds: ['oak', 'teak'] } as Parameters<typeof useStore.setState>[0])
    render(<Sidebar woods={woods} />)
    fireEvent.click(screen.getByText('Ryd alt'))
    expect(useStore.getState().selectedIds).toHaveLength(0)
  })

  it('shows empty state when nothing is selected', () => {
    render(<Sidebar woods={woods} />)
    expect(screen.getByText(/Vælg træsorter fra biblioteket/i)).toBeInTheDocument()
  })

  it('shows stats grid with Vægt and Janka labels', () => {
    useStore.setState({ selectedIds: ['oak'] } as Parameters<typeof useStore.setState>[0])
    render(<Sidebar woods={woods} />)
    expect(screen.getByText('Vægt')).toBeInTheDocument()
    expect(screen.getByText('Janka')).toBeInTheDocument()
  })
})
