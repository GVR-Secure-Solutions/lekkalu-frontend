import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import XIRRCalculator from './XIRRCalculator'
import { renderWithClient } from '@/__test__/utils'

// Mock ApexCharts
jest.mock('react-apexcharts', () => ({ __esModule: true, default: () => <div /> }))

// Mock ResizeObserver
class ResizeObserverMock {
  observe() { }
  unobserve() { }
  disconnect() { }
}

// Mock window.ResizeObserver
window.ResizeObserver = ResizeObserverMock

const Component = () => (
  <BrowserRouter>
    <TooltipProvider>
      <XIRRCalculator />
    </TooltipProvider>
  </BrowserRouter>
)

// Mock handleCopy function
// const mockHandleCopy = jest.fn()

describe('XIRRCalculator', () => {
  test('has 1 child', () => {
    // Render the component
    const { container } = render(<Component />)

    // Access the container's children
    const children = container.children

    // Assert that there is exactly one child
    expect(children.length).toBe(1)
  })

  test('buttons are defined', () => {
    renderWithClient(<Component />)
    // Find buttons
    const shareButton = screen.getByText('Share')
    const calculateXIRR = screen.getByText('Calculate XIRR')
    // const exportToExcelButton = screen.getByText('Export to Excel')

    // Assert buttons are in the document
    expect(shareButton).toBeInTheDocument()
    expect(calculateXIRR).toBeInTheDocument()
    // expect(exportToExcelButton).toBeInTheDocument()
  })

  test('inputs are correctly defined', () => {
    // Render the component
    render(<Component />)

    // Find each input field by its label text
    const startDate = screen.getByText('Start Date')
    const endDate = screen.getByText('End Date')
    const maturityDate = screen.getByText('Maturity Date')
    const investedAmount = screen.getByText(/Monthly Invested Amount (₹)/i)
    const maturityAmount = screen.getByText(/Maturity Amount (₹)/i)

    // Assert on the existence of each input field
    expect(startDate).toBeInTheDocument()
    expect(endDate).toBeInTheDocument()
    expect(maturityDate).toBeInTheDocument()
    expect(investedAmount).toBeInTheDocument()
    expect(maturityAmount).toBeInTheDocument()
  })
})
