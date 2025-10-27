'use client';

import { Alert, Button, Flex, Table, TableColumnsType } from 'antd';
import { UserData } from '../../types/list';
import usePagination from '@/shared/hooks/usePagination';

interface UserListProps {
  dataSource: UserData[];
  onDelete?: (id: string) => void;
  isLoading?: boolean;
  errorMessage?: string;
  totalItem?: number;
}

const UserList = ({
  dataSource,
  onDelete,
  isLoading = false,
  errorMessage,
  totalItem,
}: UserListProps) => {
  const { hideOnSinglePage, showSizeChanger, onChange, current } =
    usePagination();

  const columns: TableColumnsType<UserData> = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    {
      dataIndex: '',
      key: 'x',
      render: (_, record) => (
        <Button type='text' onClick={() => onDelete?.(record.id)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Flex vertical style={{ flex: 1 }}>
      {errorMessage && <Alert type='error' message={errorMessage} />}
      <Table<UserData>
        columns={columns}
        dataSource={dataSource}
        loading={isLoading}
        pagination={{
          pageSize: 5,
          total: Number(totalItem),
          hideOnSinglePage,
          showSizeChanger,
          onChange,
          current,
        }}
      />
    </Flex>
  );
};

export default UserList;
