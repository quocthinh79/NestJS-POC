'use client';

import { ResponsePaging } from '@/shared/types/api-response';
import { useEffect } from 'react';
import useSWR from 'swr';
import { adminUserService } from '../services';
import { adminUserEndpoints } from '../services/endpoints';
import { UserData } from '../types/list';

interface UseGetUsersProps {
  onSuccess?: (data?: ResponsePaging<UserData[]>, key?: string) => void;
  onError?: (err: ResponsePaging<UserData[]>, key?: string) => void;
  onRevalidate?: (data?: ResponsePaging<UserData[]>) => void;
  payload?: {
    page?: number;
    limit?: number;
    search?: string;
  };
}

const useGetUsers = (props?: UseGetUsersProps) => {
  const { onSuccess, onError, onRevalidate, payload } = props || {};

  const { data, ...restSWR } = useSWR(
    [adminUserEndpoints.getUsers(), payload],
    (keys) => adminUserService.getUsers(keys[1]),
    {
      onSuccess(data, key) {
        if (!data || data?.errorMessage) {
          onError?.(data, key);
          return;
        }

        onSuccess?.(data, key);
      },
      onError(err, key) {
        onError?.(err, key);
      },
    }
  );

  useEffect(() => {
    if (!data?.data || !data?.success) {
      return;
    }

    onRevalidate?.(data);
  }, [data]);

  return { ...restSWR, data, errorMessage: data?.errorMessage };
};

export default useGetUsers;
