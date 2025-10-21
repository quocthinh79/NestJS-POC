import { apiCommon } from '@/core';
import { authEndpoints } from './endpoints';
import { RegisterFormValues } from '../types';

export const authService = {
  login: async () => {
    const { data } = await apiCommon.post(authEndpoints.login());

    return data;
  },
  register: async (payload: RegisterFormValues) => {
    const { data } = await apiCommon.post(authEndpoints.register(), payload);

    return data;
  },
};
