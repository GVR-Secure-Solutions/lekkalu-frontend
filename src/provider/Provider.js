import React, { createContext, useReducer, useState } from 'react';

import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { InitialState } from './Reducer';
import Reducer from './Reducer';
import Types from './Types';

const Context = createContext({
  ...InitialState,
});

const Provider = ({ children }) => {
  const axiosPrivate = useAxiosPrivate();
  const [authToken, setAuthToken] = useState(null);
  const [store, dispatch] = useReducer(Reducer, InitialState);
  let finalDataWeekly = [];
  let finalLiabilities = [];
  let finalAssets = [];
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  let weekData = [];

  const {
    statusFeedback,
    expenses,
    tags,
    weeklyExpense,
    budget,
    monthlyExpenses,
    assets,
    liabilities,
    incomeStatement,
  } = store;

  const handleErrors = (error) => {
    if (error.response) {
      if (error.response.status === 403) {
        alert(error.response.data.detail);
      } else if (error.response.status === 500) {
        alert(error.message);
      }
    }
    if (error.message == 'Network Error') {
      alert('Network Error');
    }
  };

  const fetchExpenses = async (page, rowsPerPage) => {
    try {
      const headers = {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      };
      await axiosPrivate
        .get(`${process.env.REACT_APP_BACKEND_API}expenses/`, {
          headers,
          params: {
            page: page + 1,
            per_page: rowsPerPage,
          },
        })
        .then((res) => {
          dispatch({
            type: Types.FETCH_EXPENSE,
            payload: res.data,
          });
        });
    } catch (error) {
      handleErrors(error);
    }
  };

  const deleteExpenseRequest = async (id) => {
    try {
      const headers = {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      };

      await axiosPrivate
        .delete(`${process.env.REACT_APP_BACKEND_API}expenses/${id}`, {
          headers,
        })
        .then((res) => {
          dispatch({
            type: Types.DELETE_EXPENSE,
            payload: id,
          });
        });
    } catch (error) {
      handleErrors(error);
    }
  };

  const changeExpenseRequest = async (index, expense) => {
    try {
      const headers = {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      };
      await axiosPrivate
        .put(
          `${process.env.REACT_APP_BACKEND_API}expenses/${expense.id}`,
          expense,
          { headers },
        )
        .then((res) => {
          dispatch({
            type: Types.EDIT_EXPENSE,
            payload: { index, expense },
          });
        });
    } catch (error) {
      handleErrors(error);
    }
  };

  const fetchData = async () => {
    try {
      console.log(`CURRENT TOKEN ${authToken}`);
      const headers = {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      };

      await axiosPrivate
        .get(`${process.env.REACT_APP_BACKEND_API}budget/`, {
          headers,
        })
        .then((res) => {
          dispatch({
            type: Types.FETCH_BUDGET,
            payload: res.data,
          });
        });

      await axiosPrivate
        .get(`${process.env.REACT_APP_BACKEND_API}loans/`, { headers })
        .then((res) => {
          let totalVal = 0.000000001;
          res.data.map((da) => {
            totalVal += parseFloat(da.balance);
            finalLiabilities = [
              ...finalLiabilities,
              {
                name: da.name,
                value: parseFloat(da.balance),
              },
            ];
          });
          dispatch({
            type: Types.FETCH_LIABILITIES,
            payload: { finalLiabilities, totalVal },
          });
        });
    } catch (error) {
      // Handle errors
      handleErrors(error);
    }

    //Removed fetch expenses here, because it breaks pagination request on expenses page
  };

  const fetchIncomeStatement = async () => {
    const incomeSources = [];
    const incomeExpenses = [];
    try {
      let populatedIncomeStatement = { income: [], expenses: [] };
      let transformedIncomeArray = [];
      let transformedExpensesArray = [];

      if (incomeSources.length) {
        //API returns [{‘name’: ‘day_job_income’, ‘type’:’salary’,’amount’:50000}]
        //Transform to [{‘name’: ‘day_job_income’, ‘type’:’salary’,’value’:50000}]
        transformedIncomeArray = incomeSources.map((each) => {
          return {
            name: each.name,
            type: each.type,
            value: parseFloat(each.amount),
          };
        });
      }
      if (incomeExpenses.length) {
        //API returns [{‘name’: ‘day_job_income’, ‘type’:’salary’,’amount’:50000}]
        //Transform to [{‘name’: ‘day_job_income’, ‘type’:’salary’,’value’:50000}]
        transformedExpensesArray = incomeExpenses.map((each) => {
          console.log({
            original: each.amount,
            value: parseFloat(each.amount),
          });
          return {
            name: each.name,
            type: each.type,
            value: parseFloat(each.amount),
          };
        });
      }
      populatedIncomeStatement.income = transformedIncomeArray;
      populatedIncomeStatement.expenses = transformedExpensesArray;

      dispatch({
        type: Types.SET_INCOME_STATEMENT,
        payload: populatedIncomeStatement,
      });
    } catch (error) {
      handleErrors(error);
    }
  };

  return (
    <Context.Provider
      value={{
        dispatch,
        authToken,
        setAuthToken,
        expenses,
        tags,
        budget,
        weeklyExpense,
        monthlyExpenses,
        assets,
        liabilities,
        incomeStatement,
        statusFeedback,
        fetchData,
        fetchExpenses,
        deleteExpenseRequest,
        changeExpenseRequest,
        fetchIncomeStatement,
      }}
    >
      {children}
    </Context.Provider>
  );
};
export { Context, Provider };
