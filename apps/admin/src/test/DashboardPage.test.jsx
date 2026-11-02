import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router'
import { DashboardPage } from '../features/dashboard/DashboardPage'

describe('DashboardPage Component', () => {
  it('renders dashboard heading and navigation widgets', () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText(/Newsroom CMS/i)).toBeInTheDocument()
    expect(screen.getByText('Quick Actions')).toBeInTheDocument()
  })
})

