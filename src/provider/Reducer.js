import Types from './Types';

export const InitialState = {
   budget: [],
   expenses: [],
   weeklyExpense: [],
   goals:[],
   monthlyExpenses: [],
   tags: [],
   assets: [],
   liabilities: [],
   incomeStatement: { income: [], expenses: [] }
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
            ? [
               ...state.expenses,
               { ...action.payload.data, id: action.payload.id },
            ]
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
      case Types.FETCH_GOAL: {
         return {
            ...state,
            goals: action.payload,
         };
      }
      case Types.DELETE_GOAL: {
         const newGoals = state.goals.filter(
            (expense) => expense.id !== action.payload
         );

         return {
            ...state,
            goals: newGoals,
         };
      }
      case Types.CREATE_GOAL: {
         const newState = state.goals.length
            ? [
               ...state.goals,
               { ...action.payload.data, id: state.goals.length },
            ]
            : [action.payload];

         return {
            ...state,
            goals: newState,
         };
      }
      case Types.EDIT_GOAL: {
         const { index, goal } = action.payload;
         const newState = state.goals;
         newState[index] = goal;

         return {
            ...state,
            goals: newState,
         };
      }
   }
};

export default Reducer;
