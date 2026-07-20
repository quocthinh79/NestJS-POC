'use client';

import { useRouter } from 'next/navigation';
import { RegisterForm } from '@/features/authentication/compositions';
import { useRegister } from '@/features/authentication/hooks';
import { RegisterFormValues } from '@/features/authentication/types';
import { message } from 'antd';

const RegisterPage = () => {
  const router = useRouter();

  const { handleRegister, isMutating } = useRegister({
    onError(err) {
      message.error(err?.response?.data?.errorMessage || 'Registration failed. Please try again.');
    },
    onSuccess() {
      message.success('Registration successful! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 1000);
    },
  });

  const handleSubmitRegister = async (values: RegisterFormValues) => {
    await handleRegister(values);
  };

  return (
    <RegisterForm onSubmit={handleSubmitRegister} isLoading={isMutating} />
  );
};

export default RegisterPage;
