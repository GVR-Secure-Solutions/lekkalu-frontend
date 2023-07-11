import apiUtils from './apiUtils';
import { api } from './api';

const authService = {
  loginUser: async (payload: { username: string; password: string }) => {
    return await apiUtils.postRequest(api.TOKEN, payload);
  },
  signUpUser: async (payload: {
    username: string;
    email: string;
    password: string;
  }) => {
    return await apiUtils.postRequest(api.SIGN_UP, payload);
  },
};

export default authService;
