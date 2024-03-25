import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import Footer from './Footer'
import { renderWithClient } from '@/__test__/utils'
const Component = () => (
    <BrowserRouter>
      <TooltipProvider>
        <Footer />
      </TooltipProvider>
    </BrowserRouter>
  )

  jest.mock('lottie-react', () => ({
    __esModule: true,
    default: () => <div>Lottie animation</div>, // Mocking the Lottie component
  }));

  jest.mock('axios', () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
  }))

describe('CalculatorLink', () => { 

  test('renders Calculator link with correct path', () => {
    renderWithClient(
        <Component />
    );
    
    const emiCalculatorLink = screen.getByRole('link', { name: 'EMI Calculator' });
    expect(emiCalculatorLink).toBeInTheDocument();
    expect(emiCalculatorLink.getAttribute('href')).toBe('/emi-calculator');

    const cagrCalculatorLink = screen.getByRole('link', { name: 'CAGR Calculator' });
    expect(cagrCalculatorLink).toBeInTheDocument();
    expect(cagrCalculatorLink.getAttribute('href')).toBe('/cagr-calculator');

    const sipCalculatorLink = screen.getByRole('link', { name: 'SIP Calculator' });
    expect(sipCalculatorLink).toBeInTheDocument();
    expect(sipCalculatorLink.getAttribute('href')).toBe('/sip-calculator');
  });
})
