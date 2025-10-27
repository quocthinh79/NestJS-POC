'use client';

import UserList from '@/features/admin/users/components/user-list';
import useGetUsers from '@/features/admin/users/hooks/useGetUsers';
import { useSearchParams } from 'next/navigation';

const UsersListPage = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') || 1);

  const { data, isLoading, errorMessage } = useGetUsers({
    payload: { page, limit: 5, search: '' },
  });

  return (
    <UserList
      dataSource={data?.data || []}
      errorMessage={errorMessage}
      isLoading={isLoading}
      totalItem={data?.paging?.total}
    />
  );
};

export default UsersListPage;
