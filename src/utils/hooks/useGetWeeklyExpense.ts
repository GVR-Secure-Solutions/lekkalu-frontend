import { AxiosResponse, AxiosError } from 'axios';
import { useQuery } from 'react-query';
import services from '../services';

export const useGetWeeklyExpense = () => {
  const { data, isLoading, isError, error } = useQuery<
    AxiosResponse<any>,
    AxiosError<any>
  >('weekly expense', services.getWeeklyExpense);

  return {
    weeklyExpense: data?.data,
    loading: isLoading,
    error: isError,
    errorMessage: error,
  };
};
