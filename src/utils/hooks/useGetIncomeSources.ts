import { AxiosResponse, AxiosError } from 'axios';
import { useQuery } from 'react-query';
import services from '../services';

export const useGetIncomeSources = () => {
  const { data, isLoading, isError, error } = useQuery<
    AxiosResponse<any>,
    AxiosError<any>
  >('Get Income Sources', services.getIncomeSources);

  return {
    incomeSources: data,
    loading: isLoading,
    error: isError,
    errorMessage: error,
  };
};
