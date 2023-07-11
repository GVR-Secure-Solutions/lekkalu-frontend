import { AxiosResponse, AxiosError } from "axios";
import { useQuery } from "react-query";
import services from "../services";

export const useGetTag = () => {
  const { data, isLoading, isError, error } = useQuery<
    AxiosResponse<any>,
    AxiosError<any>
  >("Get Tag", services.getTag);

  return {
    tag: data,
    loading: isLoading,
    error: isError,
    errorMessage: error,
  };
};
