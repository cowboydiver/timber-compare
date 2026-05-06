import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from './Header'

describe('Header', () => {
  it('renders the Global Timber logo link', () => {
    render(<Header />)
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://www.globaltimber.dk')
  })

  it('shows the Sammenligning tool label', () => {
    render(<Header />)
    expect(screen.getByText('Sammenligning')).toBeInTheDocument()
  })

  it('renders nav links', () => {
    render(<Header />)
    expect(screen.getByText('Sammenlign')).toBeInTheDocument()
    expect(screen.getByText('Træsorter')).toBeInTheDocument()
  })
})
