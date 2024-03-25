import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import EmiCalculator from './EmiCalculator'
import { renderWithClient } from '@/__test__/utils'

const Component = () => (
  <BrowserRouter>
    <TooltipProvider>
      <EmiCalculator />
    </TooltipProvider>
  </BrowserRouter>
)

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe('EmiCalculator', () => {
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
    renderWithClient(<Component />);
  
    // Query for input elements by their labels
    const loanPrincipalInput = screen.getByText('Loan Principal');
    const loanInterestInput = screen.getByText('Loan Interest');
    const loanTenureInput = screen.getByText('Loan Tenure');
    const disbursementDateInput = screen.getByText('Disbursement Date');
    const emiDayInput = screen.getByText('Emi Day');
  
    // Assert that each input element is defined
    expect(loanPrincipalInput).toBeDefined();
    expect(loanInterestInput).toBeDefined();
    expect(loanTenureInput).toBeDefined();
    expect(disbursementDateInput).toBeDefined();
    expect(emiDayInput).toBeDefined();
  });

  test('renders CAGRCalculator correctly', () => {
    // Render the component
    const { container } = renderWithClient(<Component />);
    
    // Assert that the rendered component matches the saved snapshot
    expect(container).toMatchSnapshot();
  });

})
