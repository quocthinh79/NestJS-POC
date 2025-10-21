import { ACCESS_TOKEN_COOKIE_KEY_NAME } from '@/shared/constants';
import { getCookie } from '@/shared/utils';
import axios, { type AxiosInstance } from 'axios';

const apiCommon: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3001/',
});

apiCommon.interceptors.request.use(
  async (config) => {
    const tokenFromCookie = getCookie(ACCESS_TOKEN_COOKIE_KEY_NAME);

    if (tokenFromCookie) {
      apiCommon.defaults.headers.common.Authorization = `Bearer ${tokenFromCookie}`;
      config.headers['Authorization'] = `Bearer ${tokenFromCookie}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiCommon.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

export default apiCommon;
