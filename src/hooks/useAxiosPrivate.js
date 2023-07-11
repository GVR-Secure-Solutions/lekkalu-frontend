import { useEffect, useContext } from 'react';

import { axiosPrivateClient } from '../components/Axios/Axios';
import useRefreshToken from './useRefresh';
import { Context } from '../provider/Provider';

const useAxiosPrivate = () => {
  const { authToken, setAuthToken } = useContext(Context);

  const refresh = useRefreshToken();

  useEffect(() => {
    const requestInterceptor = axiosPrivateClient.interceptors.request.use(
      // check if Authorization header exists in first request
      (config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${authToken}`;
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseInterceptor = axiosPrivateClient.interceptors.response.use(
      // if no error return response
      (response) => response,

      // handle error incase accessToken is expired
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;

          const newAccessToken = await refresh(); //get new access token using the useRefresh hook

          setAuthToken(newAccessToken);

          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          return axiosPrivateClient(prevRequest);
        }

        return Promise.reject(error);
      },
    );

    // cleanup function to remove interceptors so their don't pile up
    return () => {
      axiosPrivateClient.interceptors.response.eject(responseInterceptor);
      axiosPrivateClient.interceptors.response.eject(requestInterceptor);
    };
  }, [refresh, setAuthToken, authToken]);

  return axiosPrivateClient;
};

export default useAxiosPrivate;
