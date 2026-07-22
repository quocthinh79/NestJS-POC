import { apiCommon } from '@/core';
import { ApiResponse } from '@/shared/types';
import { adminUserEndpoints } from './endpoints';
import { UserData } from '../types/list';
import { ResponsePaging } from '@/shared/types/api-response';

export const adminUserService = {
  getUsers: async (payload?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const { data } = await apiCommon.get<ResponsePaging<UserData[]>>(
      adminUserEndpoints.getUsers(),
      {
        params: {
          page: payload?.page || 1,
          limit: payload?.limit || 10,
          search: payload?.search || '',
        },
      }
    );

    return data;
  },
  deleteUser: async (id: string) => {
    const { data } = await apiCommon.delete<ApiResponse<null>>(
      adminUserEndpoints.deleteUser(id)
    );

    return data;
  },
};
