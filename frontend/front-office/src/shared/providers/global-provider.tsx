import { AntdProvider } from './antd-provider';
import { SWRProvider } from './swr-provider';

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AntdProvider>
      <SWRProvider>{children}</SWRProvider>
    </AntdProvider>
  );
};
