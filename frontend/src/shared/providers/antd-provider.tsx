import { ConfigProvider } from 'antd';

export const AntdProvider = ({ children }: { children: React.ReactNode }) => (
  <ConfigProvider>{children}</ConfigProvider>
);
