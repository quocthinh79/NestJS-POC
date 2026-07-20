'use client';

import React, { useState } from 'react';
import {
  Alert,
  Avatar,
  Button,
  Card,
  Flex,
  Input,
  Popconfirm,
  Space,
  Table,
  TableColumnsType,
  Tag,
  Typography,
} from 'antd';
import {
  DeleteOutlined,
  MailOutlined,
  SearchOutlined,
  SafetyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { UserData } from '../../types/list';
import usePagination from '@/shared/hooks/usePagination';
import { UserRole } from '@/shared/enums';

const { Title, Text } = Typography;

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
  totalItem = 0,
}: UserListProps) => {
  const { hideOnSinglePage, showSizeChanger, onChange, current } = usePagination();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter dataSource based on local search term
  const filteredData = dataSource.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAvatarColor = (name: string) => {
    const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#1890ff', '#52c41a'];
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const columns: TableColumnsType<UserData> = [
    {
      title: 'User',
      key: 'name',
      render: (_, record) => (
        <Flex align="center" gap={12}>
          <Avatar
            style={{
              backgroundColor: getAvatarColor(record.name || record.email),
              verticalAlign: 'middle',
              fontWeight: 600,
            }}
          >
            {(record.name || record.email || 'U').charAt(0).toUpperCase()}
          </Avatar>
          <Flex vertical>
            <Text strong style={{ fontSize: 14 }}>
              {record.name || 'Unnamed User'}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              ID: {record.id}
            </Text>
          </Flex>
        </Flex>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => (
        <Space size={6}>
          <MailOutlined style={{ color: '#8c8c8c' }} />
          <Text>{email}</Text>
        </Space>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: UserRole) => {
        const isAdmin = role === UserRole.Admin;
        return (
          <Tag
            color={isAdmin ? 'magenta' : 'blue'}
            icon={isAdmin ? <SafetyOutlined /> : <UserOutlined />}
            style={{ padding: '2px 8px', borderRadius: 4, fontWeight: 500 }}
          >
            {role ? role.toUpperCase() : 'USER'}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Popconfirm
          title="Delete User"
          description="Are you sure you want to delete this user?"
          onConfirm={() => onDelete?.(record.id)}
          okText="Delete"
          okButtonProps={{ danger: true }}
          cancelText="Cancel"
        >
          <Button type="text" danger icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Card
      style={{ width: '100%', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
      bodyStyle={{ padding: 24 }}
    >
      <Flex vertical gap={16}>
        {/* Header Toolbar */}
        <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
          <Flex align="center" gap={8}>
            <Title level={4} style={{ margin: 0 }}>
              User Directory
            </Title>
            <Tag color="blue" style={{ borderRadius: 12, fontWeight: 600 }}>
              Total: {totalItem}
            </Tag>
          </Flex>
          <Input
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 240 }}
            allowClear
          />
        </Flex>

        {errorMessage && (
          <Alert
            type="error"
            message={errorMessage}
            showIcon
            closable
            style={{ borderRadius: 6 }}
          />
        )}

        <Table<UserData>
          columns={columns}
          dataSource={filteredData}
          loading={isLoading}
          rowKey="id"
          pagination={{
            pageSize: 5,
            total: Number(totalItem),
            hideOnSinglePage,
            showSizeChanger,
            onChange,
            current,
            showTotal: (total, range) => (
              <Text type="secondary" style={{ fontSize: 12 }}>
                Showing {range[0]}-{range[1]} of {total} users
              </Text>
            ),
          }}
        />
      </Flex>
    </Card>
  );
};

export default UserList;
