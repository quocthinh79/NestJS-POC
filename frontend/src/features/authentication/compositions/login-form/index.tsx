'use client';

import React from 'react';
import { Card, Form, Input, Button, Typography, Flex } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { LoginFormValues } from '../../types';

const { Title, Text } = Typography;

interface LoginFormProps {
  onSubmit?: (values: LoginFormValues) => void;
  isLoading?: boolean;
}

export const LoginForm = ({ onSubmit, isLoading = false }: LoginFormProps) => {
  const [form] = Form.useForm<LoginFormValues>();

  return (
    <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', borderRadius: 8 }}>
      <Flex flex="1" vertical style={{ marginBottom: 24 }}>
        <Title level={3} style={{ marginBottom: 4 }}>
          Log in
        </Title>
        <Text type="secondary">Welcome back! Please enter your details.</Text>
      </Flex>

      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
      >
        <Form.Item<LoginFormValues>
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email address' },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Enter your email" size="large" />
        </Form.Item>

        <Form.Item<LoginFormValues>
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please enter your password' },
            { min: 6, message: 'Password must be at least 6 characters' },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" size="large" />
        </Form.Item>

        <Form.Item style={{ marginTop: 24, marginBottom: 12 }}>
          <Button type="primary" htmlType="submit" block size="large" loading={isLoading}>
            Log in
          </Button>
        </Form.Item>
      </Form>

      <Flex justify="center" align="center" style={{ marginTop: 12 }}>
        <Text type="secondary" style={{ marginRight: 4 }}>
          Don&apos;t have an account?
        </Text>
        <Link href="/register">Sign up</Link>
      </Flex>
    </Card>
  );
};
