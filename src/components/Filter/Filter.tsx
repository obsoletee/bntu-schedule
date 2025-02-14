import { Dropdown, MenuProps, Typography } from 'antd';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { State } from '../../store';

import { changeSubgroup } from '../../store/currentGroupReducer';
import { TeamOutlined } from '@ant-design/icons';

export const Filter = () => {
  const { Text } = Typography;
  const dispatch = useDispatch();
  const { subgroup } = useSelector((state: State) => state.currentGroup);

  const handleSubgroupChange = useCallback(
    (value: string) => {
      setTimeout(() => {
        dispatch(changeSubgroup({ subgroup: value }));
      }, 0);
    },
    [dispatch],
  );

  const items: MenuProps['items'] = [
    {
      label: (
        <Text
          type={subgroup === '' ? `success` : `secondary`}
          onClick={() => handleSubgroupChange('')}
        >
          Все
        </Text>
      ),
      key: '0',
    },
    {
      label: (
        <Text
          type={subgroup === '1' ? `success` : `secondary`}
          onClick={() => handleSubgroupChange('1')}
        >
          Подгр. 1
        </Text>
      ),
      key: '1',
    },
    {
      label: (
        <Text
          type={subgroup === '2' ? `success` : `secondary`}
          onClick={() => handleSubgroupChange('2')}
        >
          Подгр. 2
        </Text>
      ),
      key: '2',
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={['click']}>
      <TeamOutlined style={{ fontSize: '22px' }} />
    </Dropdown>
  );
};
