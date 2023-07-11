import { AxiosResponse, AxiosError } from 'axios';
import { useQuery } from 'react-query';
import services from '../services';

export const useGetMonthlyExpense = () => {
  const { data, isLoading, isError, error } = useQuery<
    AxiosResponse<any>,
    AxiosError<any>
  >('monthly expense', services.getMonthlyExpense);

  return {
    monthlyExpense: data?.data,
    loading: isLoading,
    error: isError,
    errorMessage: error,
  };
};
