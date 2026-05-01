import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { WoodBarChart } from './BarChart'
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
    id: 'ash',
    nameDa: 'Ask',
    nameEn: 'Ash',
    category: 'european',
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
  })
})

describe('WoodBarChart', () => {
  it('renders a dropdown with numeric property keys as options', () => {
    render(<WoodBarChart woods={woods} />)
    const select = screen.getByRole('combobox')
    const options = Array.from(select.querySelectorAll('option')).map((o) => o.value)
    expect(options).toContain('weight')
    expect(options).toContain('janka_hardness')
    expect(options).not.toContain('origin')
  })

  it('changing the dropdown updates barProperty in store', () => {
    render(<WoodBarChart woods={woods} />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'janka_hardness' } })
    expect(useStore.getState().barProperty).toBe('janka_hardness')
  })
})
