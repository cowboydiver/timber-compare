import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Header } from './Header'
import { useStore } from '../../store/useStore'

beforeEach(() => {
  useStore.setState({ selectedIds: [], language: 'en', activeTab: 'radar', radarWarning: false, barProperty: '', scatterX: '', scatterY: '', scatterColor: '' })
})

describe('Header', () => {
  it('renders DA and EN toggle buttons', () => {
    render(<Header />)
    expect(screen.getByRole('button', { name: 'DA' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'EN' })).toBeInTheDocument()
  })

  it('language toggle switches between DA and EN', () => {
    render(<Header />)
    fireEvent.click(screen.getByRole('button', { name: 'DA' }))
    expect(useStore.getState().language).toBe('da')
    fireEvent.click(screen.getByRole('button', { name: 'EN' }))
    expect(useStore.getState().language).toBe('en')
  })
})
