'use client';

import React from 'react';
import { Card, Form, Input, Button, Typography, Flex } from 'antd';
import { MailOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { RegisterFormValues } from '../../types';

const { Title, Text } = Typography;

interface RegisterFormProps {
  onSubmit?: (values: RegisterFormValues) => void;
  isLoading?: boolean;
}

export const RegisterForm = ({
  onSubmit,
  isLoading = false,
}: RegisterFormProps) => {
  const [form] = Form.useForm<RegisterFormValues>();

  return (
    <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', borderRadius: 8 }}>
      <Flex flex="1" vertical style={{ marginBottom: 24 }}>
        <Title level={3} style={{ marginBottom: 4 }}>
          Create your account
        </Title>
        <Text type="secondary">Join the platform to start managing services.</Text>
      </Flex>

      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
      >
        <Form.Item<RegisterFormValues>
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email address' },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Enter your email" size="large" />
        </Form.Item>

        <Form.Item<RegisterFormValues>
          name="username"
          label="Username"
          rules={[{ required: true, message: 'Please enter your username' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Choose a username" size="large" />
        </Form.Item>

        <Form.Item<RegisterFormValues>
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please enter a password' },
            { min: 6, message: 'Password must be at least 6 characters' },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Create a password" size="large" />
        </Form.Item>

        <Form.Item style={{ marginTop: 24, marginBottom: 12 }}>
          <Button type="primary" htmlType="submit" block size="large" loading={isLoading}>
            Create Account
          </Button>
        </Form.Item>
      </Form>

      <Flex justify="center" align="center" style={{ marginTop: 12 }}>
        <Text type="secondary" style={{ marginRight: 4 }}>
          Already have an account?
        </Text>
        <Link href="/login">Log in</Link>
      </Flex>
    </Card>
  );
};
