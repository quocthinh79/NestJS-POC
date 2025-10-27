'use client';

import UserList from '@/features/admin/users/components/user-list';
import useDeleteUser from '@/features/admin/users/hooks/useDeleteUser';
import useGetUsers from '@/features/admin/users/hooks/useGetUsers';
import { adminUserEndpoints } from '@/features/admin/users/services/endpoints';
import { Modal, notification } from 'antd';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { mutate } from 'swr';

const UsersListPage = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') || 1);

  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [currentDeleteUserId, setCurrentDeleteUserId] = useState<string>('');

  const listPayload = { page, limit: 5, search: '' };
  const { data, isLoading, errorMessage } = useGetUsers({
    payload: listPayload,
  });

  const { handleDeleteUser } = useDeleteUser({
    payload: { id: currentDeleteUserId },
    onSuccess: () => {
      mutate([adminUserEndpoints.getUsers(), listPayload]);
      handleCloseConfirmModal();
      notification.success({
        message: 'Success',
        description: 'User deleted successfully.',
      });
    },
    onError(err) {
      console.log('🚀 ~ UsersListPage ~ err:', err);
      notification.error({
        message: 'Error',
        description: err.errorMessage || 'Failed to delete user.',
      });
    },
  });

  const onClickDeleteUser = (id: string) => {
    setOpenConfirmModal(true);
    setCurrentDeleteUserId(id);
  };

  const handleCloseConfirmModal = () => {
    setOpenConfirmModal(false);
    setCurrentDeleteUserId('');
  };

  const handleConfirmDeleteUser = async () => {
    await handleDeleteUser();
  };

  return (
    <>
      <UserList
        dataSource={data?.data || []}
        errorMessage={errorMessage}
        isLoading={isLoading}
        totalItem={data?.paging?.total}
        onDelete={onClickDeleteUser}
      />
      <Modal
        open={openConfirmModal}
        onCancel={handleCloseConfirmModal}
        onOk={handleConfirmDeleteUser}
      >
        <p>Confirm Deletion</p>
        <p>Are you sure you want to delete this user?</p>
      </Modal>
    </>
  );
};

export default UsersListPage;
