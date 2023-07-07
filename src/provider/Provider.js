import React, { createContext, useReducer, useState } from 'react';
import axiosClient from 'components/Axios/Axios';
import useAxiosPrivate from 'hooks/useAxiosPrivate';
import { InitialState } from './Reducer';
import Reducer from './Reducer';
import Types from './Types';
import setCookie from 'components/Support/PopUp/utils/SetCookie';
import deleteCookie from 'components/Support/PopUp/utils/DeleteCookie';

const Context = createContext({
   ...InitialState,
});

const Provider = ({ children }) => {
   const axiosPrivate = useAxiosPrivate()
   const [authToken, setAuthToken] = useState(null)
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

   const giveFeedback = async (data) => {

      const statusFeedback = []
      try {
         const headers = {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
         };

         await axiosPrivate
            .post(`${process.env.REACT_APP_BACKEND_API}feedback/`, data, {headers})
            .then((res) => {
               statusFeedback.push(res.status)
            });
      } catch (err) {
         statusFeedback.push(err)
         handleErrors(err)
      }

      return statusFeedback
   }

   const fetchTags = async () => {
      try {
         const headers = {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
         };

         await axiosPrivate
            .get(`${process.env.REACT_APP_BACKEND_API}tag/`, { headers })
            .then((res) => {
               dispatch({
                  type: Types.FETCH_TAGS,
                  payload: res.data,
               });
            });
      } catch (error) {
         handleErrors(error);
      }
   };

   const createTag = async (tag) => {
      try {
         const headers = {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
         };

         await axiosPrivate
            .post(`${process.env.REACT_APP_BACKEND_API}tag/`, tag, {headers})
      } catch (error) {
         handleErrors(error)
      }
   }

   const fetchExpenses = async (page, rowsPerPage) => {
      try {

         const headers = {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
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
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
         };
         
         await axiosPrivate
            .delete(`${process.env.REACT_APP_BACKEND_API}expenses/${id}`, { headers })
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

   const createExpenseRequest = async (data) => {
      const createExpenseStatus = []
      try {

         const headers = {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
         };
         await axiosPrivate
            .post(`${process.env.REACT_APP_BACKEND_API}expenses/`, data, { headers })
            .then((res) => {
               dispatch({                  
                  type: Types.CREATE_EXPENSE,
                  payload: { data, id: res.data.data.id },
               });

               createExpenseStatus.push(res)
            });
      } catch (error) {
         handleErrors(error);
      }

      return createExpenseStatus
   };

   const changeExpenseRequest = async (index, expense) => {
      try {

         const headers = {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
         };
         await axiosPrivate
            .put(
               `${process.env.REACT_APP_BACKEND_API}expenses/${expense.id}`,
               expense, { headers },
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
         const headers = {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
         };

         await axiosPrivate
            .get(`${process.env.REACT_APP_BACKEND_API}budget/`, {
               headers
            })
            .then((res) => {
               dispatch({
                  type: Types.FETCH_BUDGET,
                  payload: res.data,
               });
            })

         await axiosPrivate
            .get(`${process.env.REACT_APP_BACKEND_API}weekly_expenses/`,
               { headers }
            )
            .then((res) => {
               weekData = res.data;
               let totlamount = 0;
               let i = 0;
               weekData.map((da) => {
                  totlamount += weekData[i]?.total_amount;
                  if (finalDataWeekly.length >= 4) {
                     finalDataWeekly = [
                        ...finalDataWeekly,
                        {
                           time: da.week.toString() + '_' + da.year.toString(),
                           amount: da?.total_amount,
                           roll_avg: parseFloat((totlamount / 5).toFixed(2)),
                        },
                     ];
                     totlamount = totlamount - weekData[i - 4].total_amount;
                  } else {
                     finalDataWeekly = [
                        ...finalDataWeekly,
                        {
                           time: da.week.toString() + ' ' + da.year.toString(),
                           amount: da?.total_amount,
                        },
                     ];
                  }
                  i += 1;
               });
               dispatch({
                  type: Types.FETCH_WEEKLY_EXPENSE,
                  payload: finalDataWeekly,
               });
            });

         await axiosPrivate
            .get(`${process.env.REACT_APP_BACKEND_API}assets/`,
               { headers }
            )
            .then((res) => {
               let totalVal = 0.000000001;
               res.data.map((da) => {
                  totalVal += da.market_value;
                  finalAssets = [
                     ...finalAssets,
                     {
                        name: da.name,
                        value: parseFloat(da.market_value),
                     },
                  ];
               });
               dispatch({
                  type: Types.FETCH_ASSETS,
                  payload: { finalAssets, totalVal },
               });
            });

         await axiosPrivate
            .get(`${process.env.REACT_APP_BACKEND_API}loans/`,
               { headers }
            )
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
         await axiosPrivate
            .get(`${process.env.REACT_APP_BACKEND_API}monthly_expenses/`, { headers })
            .then((res) => {
               let finalMonthlyExp = [];
               let response = res.data;
               response.map((da) => {
                  finalMonthlyExp = [
                     ...finalMonthlyExp,
                     {
                        name: monthNames[da.month - 1],
                        Spent: da.spent,
                        Balance: da.balance,
                        CumSum: da.cum_sum,
                     },
                  ];
               });

               dispatch({
                  type: Types.FETCH_MONTHLY_EXPENSE,
                  payload: finalMonthlyExp,
               });
            });
      } catch (error) {
         // Handle errors
         handleErrors(error);
      }

      //Removed fetch expenses here, because it breaks pagination request on expenses page
   };

   const fetchToken = async (username, password) => {
      try {
         const auth = {
            username: username,
            password: password
         };

         return await axiosClient.post(`${process.env.REACT_APP_BACKEND_URL}token/`, auth)
            .then(response => {
               setAuthToken(response?.data?.access)
               setCookie('refresh', response?.data?.refresh, 30)
               return response.status
            })
            .catch(error => {
               console.log(error?.response?.data?.detail)
               handleErrors(error);
            })

      } catch (error) {
         handleErrors(error);
      }
   };

   const fetchIncomeSources = async () => {
      try {
         const headers = {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
         };

         return axiosPrivate.get('https://api.finuncle.com/api/income_source/', { headers })
            .then(response => {
               return response.data
            })
      } catch (error) {
         handleErrors(error);
         return []
      }
   };

   const fetchIncomeExpenses = async () => {
      try {
         const headers = {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
         };

         return axiosPrivate.get('https://api.finuncle.com/api/income_expense/', { headers })
            .then(response => {
               return response.data
            })
      } catch (error) {
         handleErrors(error);
         return []
      }
   };

   const fetchIncomeStatement = async () => {
      try {
         let populatedIncomeStatement = { income: [], expenses: [] }
         let transformedIncomeArray = []
         let transformedExpensesArray = []

         const incomeSources = await fetchIncomeSources();
         const incomeExpenses = await fetchIncomeExpenses();

         if (incomeSources.length) {
            //API returns [{‘name’: ‘day_job_income’, ‘type’:’salary’,’amount’:50000}]
            //Transform to [{‘name’: ‘day_job_income’, ‘type’:’salary’,’value’:50000}]
            transformedIncomeArray = incomeSources.map((each) => {
               return { name: each.name, type: each.type, value: parseFloat(each.amount) }
            })
         }
         if (incomeExpenses.length) {
            //API returns [{‘name’: ‘day_job_income’, ‘type’:’salary’,’amount’:50000}]
            //Transform to [{‘name’: ‘day_job_income’, ‘type’:’salary’,’value’:50000}]
            transformedExpensesArray = incomeExpenses.map((each) => {
               console.log({ original: each.amount, value: parseFloat(each.amount) })
               return { name: each.name, type: each.type, value: parseFloat(each.amount) }
            })
         }
         populatedIncomeStatement.income = transformedIncomeArray
         populatedIncomeStatement.expenses = transformedExpensesArray

         dispatch({
            type: Types.SET_INCOME_STATEMENT,
            payload: populatedIncomeStatement,
         });
      } catch (error) {
         handleErrors(error);
      }
   };
   
   const signOut = () => {
      setAuthToken(null)
      deleteCookie('refresh')
   };

   return (
      <Context.Provider
         value={{
            authToken,
            setAuthToken,
            signOut,
            expenses,
            tags,
            budget,
            weeklyExpense,
            monthlyExpenses,
            assets,
            liabilities,
            incomeStatement,
            statusFeedback,
            giveFeedback,
            fetchData,
            fetchExpenses,
            deleteExpenseRequest,
            createExpenseRequest,
            changeExpenseRequest,
            fetchTags,
            createTag,
            fetchToken,
            fetchIncomeSources,
            fetchIncomeExpenses,
            fetchIncomeStatement
         }}
      >
         {children}
      </Context.Provider>
   );
};

export { Context, Provider };
