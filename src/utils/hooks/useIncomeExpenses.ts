import { AxiosResponse, AxiosError } from 'axios';
import { useQuery } from 'react-query';
import services from '../services';

export const useGetIncomeExpenses = () => {
  const { data, isLoading, isError, error } = useQuery<
    AxiosResponse<any>,
    AxiosError<any>
  >('Get Income Expense', services.getIncomeExpense);

  return {
    incomeExpense: data,
    loading: isLoading,
    error: isError,
    errorMessage: error,
  };
};
