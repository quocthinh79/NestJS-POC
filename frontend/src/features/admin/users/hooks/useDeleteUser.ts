'use client';

import useSWRMutation from 'swr/mutation';
import { ApiResponse } from '@/shared/types';
import { adminUserEndpoints } from '../services/endpoints';
import { adminUserService } from '../services';
import { DeleteUserRequest } from '../types/detail';

interface UseDeleteUserProps {
  onSuccess?: (data?: ApiResponse<null>, key?: string) => void;
  onError?: (err: ApiResponse<null>, key?: string) => void;
  payload?: DeleteUserRequest;
}

const useDeleteUser = (props?: UseDeleteUserProps) => {
  const { onSuccess, onError, payload } = props || {};

  const { trigger, reset, data, ...restSWR } = useSWRMutation(
    [adminUserEndpoints.deleteUser(payload?.id || ''), payload?.id],
    async (keys) => adminUserService.deleteUser(keys[1] || ''),
    {
      onSuccess(data, key) {
        if (!data?.success) {
          onError?.(data, key);
          return;
        }
        onSuccess?.(data, key);
      },
      onError(err, key) {
        onError?.(err?.response?.data, key);
      },
    }
  );

  const handleDeleteUser = async () => {
    if (!payload?.id) {
      return;
    }

    reset();
    return await trigger();
  };

  return {
    ...restSWR,
    data,
    handleDeleteUser,
    reset,
    errorMessage: data?.errorMessage,
  };
};

export default useDeleteUser;
