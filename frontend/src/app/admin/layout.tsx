import { Flex } from 'antd';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex className='admin-layout' justify='center' align='center'>
      {children}
    </Flex>
  );
};

export default AdminLayout;
