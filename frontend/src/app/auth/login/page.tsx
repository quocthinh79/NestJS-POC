'use client';

import { LoginForm } from '@/features/authentication/compositions';
import { useLogin } from '@/features/authentication/hooks';
import { LoginFormValues } from '@/features/authentication/types';
import { ACCESS_TOKEN_COOKIE_KEY_NAME } from '@/shared/constants';
import { setCookie } from '@/shared/utils/cookies';
import { message } from 'antd';

const LoginPage = () => {
  const { handleLogin, isMutating } = useLogin({
    onError(err) {
      message.error(err?.response?.data?.errorMessage);
    },
    onSuccess(data) {
      const accessToken = data?.data?.accessToken;

      if (accessToken) {
        setCookie(ACCESS_TOKEN_COOKIE_KEY_NAME, accessToken, 1);
      }

      message.success('Login successful! Welcome back.');
    },
  });

  const handleSubmitLogin = async (values: LoginFormValues) => {
    await handleLogin(values);
  };

  return <LoginForm onSubmit={handleSubmitLogin} isLoading={isMutating} />;
};

export default LoginPage;
