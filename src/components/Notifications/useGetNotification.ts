import { AxiosResponse, AxiosError } from "axios";
import { useQuery } from "react-query";
import axios from "axios";

const fetchNotification = async () => {
  return await axios.get(`${process.env.REACT_APP_BACKEND_API}tag/`, {
    auth: {
      username: process.env.REACT_APP_USER as string,
      password: process.env.REACT_APP_PASSWORD as string,
    },
  });
};

export const useGetNotification = () => {
  const { data, isLoading, isError } = useQuery<
    AxiosResponse<any>,
    AxiosError<any>
  >("All Notifications", fetchNotification, {
    staleTime: 3000,
    refetchInterval: 3000,
  });

  return { data, isLoading, isError };
};
