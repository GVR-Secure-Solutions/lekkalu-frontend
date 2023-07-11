import { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import services from '../services';

export const useCreateExpense = () => {
  const createExpenseMutate = useMutation(services.createExpense, {
    onSuccess: () => {
      console.log('payload sucessfully sent!!');
    },
    onError: (error: AxiosError<any>) => {
      console.error('An error occurred!', error);
    },
  });

  const handleRequest = (payload: any) => {
    createExpenseMutate.mutate(payload);
  };

  return {
    handleRequest,
    loading: createExpenseMutate.isLoading,
    success: createExpenseMutate.isSuccess,
  };
};
