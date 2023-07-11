import { AxiosResponse, AxiosError } from 'axios';
import { useQuery } from 'react-query';
import services from '../services';

export const useGetAssets = () => {
  const { data, isLoading, isError, error } = useQuery<
    AxiosResponse<any>,
    AxiosError<any>
  >('assets', services.getAssets);

  return {
    assets: data?.data,
    loading: isLoading,
    error: isError,
    errorMessage: error,
  };
};
