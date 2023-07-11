import { useMutation } from 'react-query';
import { AxiosResponse, AxiosError } from 'axios';
import swal from 'sweetalert';

import authService from '../authService';
import storageUtils from '../storageUtils';

export const useLogin = () => {
  const loginMutate = useMutation(authService.loginUser, {
    onSuccess: async (res: AxiosResponse<any>) => {
      storageUtils.setAuthToken(res?.data?.access);
      swal({
        title: 'success alert',
        text: 'logged in successfully',
        icon: 'success',
      });
      window.location.href = '/';
    },
    onError: (error: AxiosError<any>) => {
      console.log('log in response error');
      console.log(error?.response?.data);
    },
  });

  const handleSubmit = (payload: { username: string; password: string }) => {
    loginMutate.mutate(payload);
  };

  return {
    handleSubmit,
    loading: loginMutate.isLoading,
  };
};
