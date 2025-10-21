/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import useSWRMutation from 'swr/mutation';
import { authEndpoints } from '../services/endpoints';
import { RegisterFormValues } from '../types';
import { authService } from '../services';

interface UseRegisterProps {
  onSuccess?: (data?: any, key?: string) => void;
  onError?: (err: any, key?: string) => void;
}

const useRegister = (props?: UseRegisterProps) => {
  const { onSuccess, onError } = props || {};

  const { trigger, reset, data, ...restSWR } = useSWRMutation(
    [authEndpoints.register()],
    async (_, { arg }: { arg: RegisterFormValues }) =>
      authService.register(arg),
    {
      onSuccess(data, key) {
        onSuccess?.(data, key);
      },
      onError(err, key) {
        onError?.(err, key);
      },
    }
  );

  const handleRegister = async (payload?: RegisterFormValues) => {
    if (!payload) {
      return;
    }

    reset();
    return await trigger(payload);
  };

  return {
    ...restSWR,
    data,
    handleRegister,
    reset,
  };
};

export default useRegister;
