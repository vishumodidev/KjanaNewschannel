import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router'
import { HomePage } from '../features/home/HomePage'

describe('HomePage Component', () => {
  it('renders brand headline and weather widget correctly', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    // Verify main Kannada headline is in document
    expect(screen.getByText(/ಹಸಿರು ಇಂಧನ, ಮೂಲಸೌಕರ್ಯ ಮತ್ತು ಡಿಜಿಟಲ್ ನವೋನ್ನತಿಗೆ ಭಾರತ ಬದ್ಧ/i)).toBeInTheDocument()

    // Verify weather widget
    expect(screen.getByText(/ಬೆಂಗಳೂರು ಹವಾಮಾನ/i)).toBeInTheDocument()

    // Verify recent major stories section
    expect(screen.getByText(/ಇತ್ತೀಚಿನ ಪ್ರಮುಖ ಸುದ್ದಿಗಳು/i)).toBeInTheDocument()
  })
})

