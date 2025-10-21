import axios, { type AxiosInstance } from 'axios';

const apiCommon: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3001/',
});

apiCommon.interceptors.request.use(
  async (config) => {
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
