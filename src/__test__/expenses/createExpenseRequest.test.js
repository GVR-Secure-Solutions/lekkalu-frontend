import React, { createContext } from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Expenses from "components/Expenses/Expenses";
import { mockState } from "__test__/data/Expenses";

const TestContext = createContext(mockState);

jest.mock('axios', () => ({
  post: jest.fn(),
  get: jest.fn(),
  create:jest.fn(),
}))
jest.mock("hooks/useAxiosPrivate", () => jest.fn());
jest.mock('components/Axios/Axios', () => ({
    post: jest.fn(),
}));

describe("createExpenseRequest", () => {
  test("successfully deletes an expense", async () => {
    render(
      <TestContext.Provider value={mockState}>
        <Expenses Context={TestContext}/>
      </TestContext.Provider>
    );

    fireEvent.click(screen.getByTestId("add-expense"));

    const amountField = screen.getByTestId("amount-expense").firstChild.firstChild;
    const endAdornment = screen.getByTestId("tags-expense").children[1].children[1].children[0];

    fireEvent.change(amountField, {target: {value: '23.00'}});
    fireEvent.click(endAdornment);

    const firstOption = screen.getAllByRole('presentation')[2].firstChild.firstChild.firstChild;

    fireEvent.click(firstOption);

    fireEvent.click(screen.getByTestId("submit-expense"));

    await waitFor(() => {
      expect(mockState.createExpenseRequest).toHaveBeenCalled();
    });
  });
});
