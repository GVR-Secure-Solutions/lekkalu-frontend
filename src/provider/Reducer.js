import Types from "./Types";

export const InitialState = {
  budget: [],
  expenses: [],
  weeklyExpense: [],
   goals: [],
  monthlyExpenses: [],
  tags: [],
  assets: [],
  liabilities: [],
  depreciation:  [],
  incomeStatement: { income: [], expenses: [] },
};

const Reducer = (state, action) => {
  switch (action.type) {
    case Types.FETCH_BUDGET: {
      return {
        ...state,
        budget: action.payload,
      };
    }
    case Types.FETCH_EXPENSE: {
      return {
        ...state,
        expenses: action.payload,
      };
    }
    case Types.FETCH_WEEKLY_EXPENSE: {
      return {
        ...state,
        weeklyExpense: action.payload,
      };
    }
    case Types.FETCH_MONTHLY_EXPENSE: {
      return {
        ...state,
        monthlyExpenses: action.payload,
      };
    }
    case Types.FETCH_ASSETS: {
      return {
        ...state,
        assets: action.payload,
      };
    }
    case Types.FETCH_LIABILITIES: {
      return {
        ...state,
        liabilities: action.payload,
      };
    }
    case Types.FETCH_depreciation: {
      return {
        ...state,
        depreciation: action.payload,
      };
    }
    case Types.DELETE_EXPENSE: {
      const newExpenses = state.expenses.filter(
        (expense) => expense.id !== action.payload
      );

      return {
        ...state,
        expenses: newExpenses,
      };
    }
    case Types.CREATE_EXPENSE: {
      const newState = state.expenses.length
        ? [...state.expenses, { ...action.payload.data, id: action.payload.id }]
        : [action.payload];

      return {
        ...state,
        expenses: newState,
      };
    }

    case Types.EDIT_EXPENSE: {
      const { index, expense } = action.payload;
      const newState = state.expenses;
      newState[index] = expense;

      return {
        ...state,
        expenses: newState,
      };
    }
    case Types.SET_INCOME_STATEMENT: {
      return {
        ...state,
        incomeStatement: action.payload,
      };
    }
    case Types.FETCH_TAGS: {
      return {
        ...state,
        tags: action.payload,
      };
    }
    case Types.DELETE_BUDGET: {
      return {
        ...state,
        budget: state.budget.filter((item) => item.id !== action.payload),
      };
    }
    case Types.SET_BUDGET: {
      return {
        ...state,
        budget: [...state.budget, action.payload],
      };
    }
    case Types.EDIT_BUDGET: {
      return {
        ...state,
        budget: state.budget.map((item) => {
          if (item.id === action.payload.id) {
            return action.payload;
          }
          return item;
        }),
      };
    }
    case Types.SET_USER: {
      return { ...state, user: action.payload };
    }
    default: {
      return state;
    }
  }
};

export default Reducer;
