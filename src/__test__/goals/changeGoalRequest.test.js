import React, { createContext } from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { mockState } from "__test__/data/Goals";
import Goals from "components/Goals/Goals";
const TestContext = createContext(mockState);

describe("changeGoalRequest", () => {
  test("successfully changes a goal", async () => {
    render(
      <TestContext.Provider value={mockState}>
        <Goals Context={TestContext}/>
      </TestContext.Provider>
    );

    fireEvent.click(screen.getAllByPlaceholderText("edit-goal")[0]);

    const goalField = screen.getByTestId("goal").firstChild.firstChild;
    const subGoalField = screen.getByTestId("sub-goal").firstChild.firstChild;
    const targetMetricField = screen.getByTestId("target-metric").firstChild.firstChild;
    const currentField = screen.getByTestId("current-metric").firstChild.firstChild;
    const balance = screen.getByTestId("balance").firstChild.firstChild;
    const reachablitiyInMonthsField = screen.getByTestId("reachablitiy-in-months").firstChild.firstChild;
    const reachabilityInYearsField = screen.getByTestId("reachability-in-years").firstChild.firstChild;
    
    fireEvent.change(subGoalField, {target: {value: 'Net cash reserve of 3 months of your current total income'}});
    fireEvent.click(screen.getByTestId("submit-goal"));

    await waitFor(() => {
      expect(mockState.changeGoalRequest).toHaveBeenCalled();
    });
  });
});
