import { LoadingOutlined } from '@ant-design/icons';
import { Flex, Spin } from 'antd';

export const CustomSpin = () => {
  return (
    <Flex style={{ width: '100%' }} justify="center" align="center">
      <Spin indicator={<LoadingOutlined spin />} size="large" />
    </Flex>
  );
};
