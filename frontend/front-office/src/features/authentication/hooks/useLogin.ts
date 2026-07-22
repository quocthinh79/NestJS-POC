/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import useSWRMutation from 'swr/mutation';
import { authEndpoints } from '../services/endpoints';
import { LoginFormValues } from '../types';
import { authService } from '../services';
import { ApiResponse } from '@/shared/types';
import { LoginResponse } from '../types/login';

interface UseLoginProps {
  onSuccess?: (data?: ApiResponse<LoginResponse>, key?: string) => void;
  onError?: (err: any, key?: string) => void;
}

const useLogin = (props?: UseLoginProps) => {
  const { onSuccess, onError } = props || {};

  const { trigger, reset, data, ...restSWR } = useSWRMutation(
    [authEndpoints.login()],
    async (_, { arg }: { arg: LoginFormValues }) => authService.login(arg),
    {
      onSuccess(data, key) {
        onSuccess?.(data, key);
      },
      onError(err, key) {
        onError?.(err, key);
      },
    }
  );

  const handleLogin = async (payload?: LoginFormValues) => {
    if (!payload) {
      return;
    }

    reset();
    return await trigger(payload);
  };

  return {
    ...restSWR,
    data,
    handleLogin,
    reset,
  };
};

export default useLogin;
