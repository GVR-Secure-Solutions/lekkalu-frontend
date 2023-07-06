export const mockGoals = [
    {
        id: 1,
        goals: "",
        subGoals: "Lent to be < 25% of Total Assets",
        targetMetric: '25.0%', current: '25.7%',
        balance: '0.7%',
        reachablitiyInMonths: 31,
        reachabilityInYears: 2.6,
        started: '2022-05-02',
        finished: '2022-05-02',
        plannedStart: '2022-05-02',
        preferedQuantity: 'higher',
    },
    {
        id: 2,
        goals: "",
        subGoals: 'Net cash reserve of 6 months of your current total income',
        targetMetric: 1333800, current: 672127,
        balance: 661673,
        reachablitiyInMonths: 26,
        reachabilityInYears: 2.2,
        started: '2021-11-01',
        finished: '2021-11-01',
        plannedStart: '2022-05-01',
        preferredQuantity: 'higher',
    }
]

export const mockState = {
    goals: mockGoals,
    fetchGoals: jest.fn(),
    deleteGoalRequest: jest.fn(),
    changeGoalRequest: jest.fn(),
    createGoalRequest: jest.fn(),
};