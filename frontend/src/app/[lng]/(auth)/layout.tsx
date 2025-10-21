import { Flex } from 'antd';

interface AuthRootLayoutProps {
  children: React.ReactNode;
}

const AuthRootLayout = ({ children }: AuthRootLayoutProps) => {
  return (
    <Flex justify='center' align='center' style={{ minHeight: '100vh' }}>
      {children}
    </Flex>
  );
};

export default AuthRootLayout;
