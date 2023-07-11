import { AxiosError } from "axios";
import { useMutation } from "react-query";
import services from "../services";

export const useCreateTag = () => {
  const createTagMutate = useMutation(services.createTag, {
    onSuccess: () => {
      console.log("payload sucessfully sent!!");
    },
    onError: (error: AxiosError<any>) => {
      console.error("An error occurred!", error);
    },
  });

  const handleRequest = (payload: any) => {
    createTagMutate.mutate(payload);
  };

  return {
    handleRequest,
    loading: createTagMutate.isLoading,
    success: createTagMutate.isSuccess,
  };
};
