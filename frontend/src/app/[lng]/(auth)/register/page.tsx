'use client';

import { RegisterForm } from '@/features/authentication/compositions';
import { useRegister } from '@/features/authentication/hooks';
import { RegisterFormValues } from '@/features/authentication/types';
import { message } from 'antd';

const RegisterPage = () => {
  const { handleRegister } = useRegister({
    onError(err) {
      message.error(err?.response?.data?.errorMessage);
    },
    onSuccess() {
      message.success('Registration successful! Please log in.');
    },
  });

  const handleSubmitRegister = async (values: RegisterFormValues) => {
    await handleRegister(values);
  };

  return <RegisterForm onSubmit={handleSubmitRegister} />;
};

export default RegisterPage;
