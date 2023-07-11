import React, { createContext } from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Expenses from '../../components/Expenses/Expenses';
import { mockState } from '../data/Expenses';

const TestContext = createContext(mockState);

window.scrollTo = jest.fn();

describe('deleteExpenseRequest', () => {
  test('successfully deletes an expense', async () => {
    render(
      <TestContext.Provider value={mockState}>
        <Expenses Context={TestContext} />
      </TestContext.Provider>,
    );

    fireEvent.click(screen.getAllByPlaceholderText('delete-expense')[0]);
    await waitFor(() => {
      // expect(mockState.deleteExpenseRequest).toHaveBeenCalled();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      // expect(mockState.deleteExpenseRequest).toHaveBeenCalled();
      expect(mockState.deleteExpenseRequest).toHaveBeenCalled();
    });
  });
});
