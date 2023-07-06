import React, {createContext} from "react";
import {render, fireEvent, waitFor, screen} from "@testing-library/react";
import Goals from "components/Goals/Goals";
import "@testing-library/jest-dom";

import {mockState} from "__test__/data/Goals";

const TestContext = createContext(mockState);

describe("deleteGoalRequest", () => {
    test("successfully deletes a goal", async () => {
        render(<TestContext.Provider value={mockState}>
                <Goals Context={TestContext}/>
            </TestContext.Provider>
        );

        fireEvent.click(screen.getAllByPlaceholderText("delete-goal")[0]);
        await waitFor(() => {
            // expect(mockState.deleteGoalRequest).toHaveBeenCalled();
            expect(screen.getByText('Delete')).toBeInTheDocument()
        });
        fireEvent.click(screen.getByText('Delete'));

        await waitFor(() => {
            // expect(mockState.deleteGoalRequest).toHaveBeenCalled();
            expect(mockState.deleteGoalRequest).toHaveBeenCalled();
        });
    });
});

