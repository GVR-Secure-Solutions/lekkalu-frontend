import { useNavigate } from 'react-router';
import { useMutation } from 'react-query';
import { AxiosResponse, AxiosError } from 'axios';
import swal from 'sweetalert';

import authService from '../authService';

export const useSignUp = () => {
  const navigate = useNavigate();

  const signUpMutate = useMutation(authService.signUpUser, {
    onSuccess: async (res: AxiosResponse<any>) => {
      console.log('sign-up mutate response', res);
      console.log('account created!');
      navigate('/signin');
      swal({
        title: 'success alert',
        text: 'Your account has been created please login',
        icon: 'success',
      });
    },
    onError: (error: AxiosError<any>) => {
      console.log('response error');
      console.log(error?.response?.data);
    },
  });

  const handleSubmit = (payload: {
    username: string;
    password: string;
    email: string;
  }) => {
    signUpMutate.mutate(payload);
  };

  return {
    handleSubmit,
    loading: signUpMutate.isLoading,
  };
};
