import { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import services from '../services';

export const useGiveFeedback = () => {
  const giveFeedbackMutate = useMutation(services.giveFeedback, {
    onSuccess: () => {
      console.log('payload sucessfully sent!!');
    },
    onError: (error: AxiosError<any>) => {
      console.error('An error occurred!', error);
    },
  });

  const handleRequest = (payload: any) => {
    giveFeedbackMutate.mutate(payload);
  };

  return {
    handleRequest,
    loading: giveFeedbackMutate.isLoading,
    success: giveFeedbackMutate.isSuccess,
  };
};
