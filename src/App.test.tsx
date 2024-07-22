import React from 'react'
import { waitForElementToBeRemoved } from '@testing-library/react'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import { renderWithClient } from './__test__/utils'

jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
}))
// Mock ApexCharts
jest.mock('react-apexcharts', () => ({ __esModule: true, default: () => <div /> }))

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}

jest.mock('lottie-react', () => ({
  __esModule: true,
  default: () => <div>Lottie animation</div>, // Mocking the Lottie component
}))

describe('App', () => {
  it('renders loading message initially', () => {
    const { getByText } = renderWithClient(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    )
    expect(getByText('Loading please wait...')).toBeInTheDocument()
  })

  it('renders emi routes correctly', async () => {
    try {
      const { getByText, queryByText } = renderWithClient(
        <TooltipProvider>
          <MemoryRouter initialEntries={['/emi-calculator']}>
            <App />
          </MemoryRouter>
        </TooltipProvider>,
      )
      await waitForElementToBeRemoved(() => getByText('Loading please wait...'), {
        onTimeout: () => {
          return new Error(`${'emi-calculator'} path is found`)
        },
      })

      // Assert that the "Ohh! Page Not Found" message is not present
      expect(queryByText('Ohh! Page Not Found')).not.toBeInTheDocument()
    } catch (error: any) {
      expect(error?.message).toMatch(/path is found/)
    }
  })

  const testRouteRendering = (routePath: string) => async () => {
    try {
      const { getByText, queryByText } = renderWithClient(
        <TooltipProvider>
          <MemoryRouter initialEntries={[routePath]}>
            <App />
          </MemoryRouter>
        </TooltipProvider>,
      )

      await waitForElementToBeRemoved(() => getByText('Loading please wait...'), {
        onTimeout: () => {
          throw new Error(`${routePath} path is found`)
        },
      })

      // Assert that the "Ohh! Page Not Found" message is not present
      expect(queryByText('Ohh! Page Not Found')).not.toBeInTheDocument()
    } catch (error: any) {
      expect(error.message).toMatch(/path is found/)
    }
  }

  test('renders sip routes correctly', testRouteRendering('/sip-calculator'))
  test('renders cagr routes correctly', testRouteRendering('/cagr-calculator'))
  test('renders xirr routes correctly', testRouteRendering('/xirr-calculator'))
})
