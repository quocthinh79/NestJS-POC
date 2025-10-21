'use client';

import { Button, Card, Form, Input } from 'antd';
import { LoginFormValues } from '../../types';

interface LoginFormProps {
  onSubmit?: (values: LoginFormValues) => void;
  isLoading?: boolean;
}

export const LoginForm = ({ onSubmit, isLoading = false }: LoginFormProps) => {
  const [form] = Form.useForm<LoginFormValues>();

  return (
    <Card>
      <Form
        form={form}
        layout='vertical'
        onFinish={onSubmit}
        style={{ width: 400 }}
      >
        <Form.Item<LoginFormValues>
          name='email'
          label='Email'
          rules={[{ required: true, type: 'email' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<LoginFormValues>
          name='password'
          label='Password'
          rules={[{ required: true, min: 6 }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' block loading={isLoading}>
            Login
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
