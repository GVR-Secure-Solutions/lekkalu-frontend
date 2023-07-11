import { api } from './api';
import apiUtils from './apiUtils';

const services = {
  getTag: async () => {
    return await apiUtils.getRequest(`${api.TAG}`);
  },
  createTag: async (payload: any) => {
    return await apiUtils.postRequest(`${api.TAG}`, payload);
  },
  getIncomeSources: async () => {
    return await apiUtils.getRequest(`${api.INCOME_SOURCES}`);
  },
  getIncomeExpense: async () => {
    return await apiUtils.getRequest(`${api.INCOME_EXPENSE}`);
  },
  getMonthlyExpense: async () => {
    return await apiUtils.getRequest(`${api.MONTHLY_EXPENSES}`);
  },
  getWeeklyExpense: async () => {
    return await apiUtils.getRequest(`${api.WEEKLY_EXPENSES}`);
  },
  getLiabilities: async () => {
    return await apiUtils.getRequest(`${api.LOANS}`);
  },
  getAssets: async () => {
    return await apiUtils.getRequest(`${api.ASSETS}`);
  },
  giveFeedback: async (payload: any) => {
    return await apiUtils.postRequest(`${api.FEEDBACK}`, payload);
  },
  createExpense: async (payload: any) => {
    return await apiUtils.postRequest(`${api.EXPENSES}`, payload);
  },
};

export default services;
