'use client';

import { Button, Form, Input } from 'antd';
import { RegisterFormValues } from '../../types';

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
    <Form
      form={form}
      layout='vertical'
      onFinish={onSubmit}
      style={{ width: 400 }}
    >
      <Form.Item<RegisterFormValues>
        name='email'
        label='Email'
        rules={[{ required: true, type: 'email' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item<RegisterFormValues>
        name='username'
        label='Username'
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item<RegisterFormValues>
        name='password'
        label='Password'
        rules={[{ required: true, min: 6 }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button type='primary' htmlType='submit' block loading={isLoading}>
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};
