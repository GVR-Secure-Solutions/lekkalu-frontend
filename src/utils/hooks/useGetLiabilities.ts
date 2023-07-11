import { AxiosResponse, AxiosError } from 'axios';
import { useQuery } from 'react-query';
import services from '../services';

export const useGetLiabilities = () => {
  const { data, isLoading, isError, error } = useQuery<
    AxiosResponse<any>,
    AxiosError<any>
  >('liabilities', services.getLiabilities);

  return {
    liabilities: data?.data,
    loading: isLoading,
    error: isError,
    errorMessage: error,
  };
};
