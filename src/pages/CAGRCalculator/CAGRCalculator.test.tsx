import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import CAGRCalculator from './CAGRCalculator'

const Component = () => (
  <BrowserRouter>
    <TooltipProvider>
      <CAGRCalculator />
    </TooltipProvider>
  </BrowserRouter>
)

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe('CAGRCalculator', () => {
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
    render(<Component />)
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
  
    const initialValueInput = screen.getByText(/Initial value \(₹\)/i);
    expect(initialValueInput).toBeInTheDocument();    

    const finalValueInput = screen.getByText(/Final Value Costs/i);
    expect(finalValueInput).toBeInTheDocument();    

    const durationInput = screen.getByText(/Duration of Investment/i);
    expect(durationInput).toBeInTheDocument();    
  });

  test('renders CAGRCalculator correctly', () => {
    // Render the component
    const { container } = render(<Component />);
    
    // Assert that the rendered component matches the saved snapshot
    expect(container).toMatchSnapshot();
  });

})
