import { apiCommon } from '@/core';
import { authEndpoints } from './endpoints';
import { LoginFormValues, RegisterFormValues } from '../types';
import { LoginResponse } from '../types/login';
import { ApiResponse } from '@/shared/types';

export const authService = {
  login: async (payload: LoginFormValues) => {
    const { data } = await apiCommon.post<ApiResponse<LoginResponse>>(
      authEndpoints.login(),
      payload
    );

    return data;
  },
  register: async (payload: RegisterFormValues) => {
    const { data } = await apiCommon.post<ApiResponse<null>>(
      authEndpoints.register(),
      payload
    );

    return data;
  },
};
