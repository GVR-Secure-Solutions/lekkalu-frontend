import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import SIPCalculator from './SIPCalculator'
import { renderWithClient } from '@/__test__/utils'

const Component = () => (
  <BrowserRouter>
    <TooltipProvider>
      <SIPCalculator />
    </TooltipProvider>
  </BrowserRouter>
)

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock handleCopy function
const mockHandleCopy = jest.fn();

describe('SIPCalculator', () => {
  window.ResizeObserver = ResizeObserver;

  test('has 1 child', () => {
    // Render the component
    const { container } = render(<Component />);
    
    // Access the container's children
    const children = container.children;
    
    // Assert that there is exactly one child
    expect(children.length).toBe(1);
  });

  test('buttons are defined', () => {
    renderWithClient(<Component />)
    // Find child components by test IDs
    // const formComponent = screen.getByTestId('emi-form');
    const shareButton = screen.getByText('Share');
    const exportToExcelComponent = screen.getByText('Export to Excel');
    
    expect(shareButton).toBeInTheDocument();
    expect(exportToExcelComponent).toBeInTheDocument();    
  });

  test('inputs are correctly defined', () => {
    // Render the component
    render(<Component />);
  
     // Find each input field by its label text
     const monthlyAmountInput = screen.getByText(/Monthly investment amount (₹)/i);
     const durationInvestmentInput = screen.getByText("Duration of the investment (Yr)");
     const rateReturnInput = screen.getByText("Expected annual return (%)");
 
     // Assert on the existence of each input field
     expect(monthlyAmountInput).toBeInTheDocument();
     expect(durationInvestmentInput).toBeInTheDocument();
     expect(rateReturnInput).toBeInTheDocument();
  });

  test('renders SIPCalculator correctly', () => {
    // Render the component
    const { container } = render(<Component />);
    
    // Assert that the rendered component matches the saved snapshot
    expect(container).toMatchSnapshot();
  });

})
