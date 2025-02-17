import { Dropdown, MenuProps, Typography, Image, Flex } from 'antd';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { State } from '../../store';
import { changeSubgroup } from '../../store/currentGroupReducer';
import { icons } from '../../assets/icons';

export const Filter = () => {
  const { Text } = Typography;
  const dispatch = useDispatch();
  const { subgroup } = useSelector((state: State) => state.currentGroup);

  const handleSubgroupChange = useCallback(
    (value: string) => {
      dispatch(changeSubgroup({ subgroup: value }));
    },
    [dispatch],
  );

  const subgroupOptions = [
    { value: '', label: 'Все', icon: icons.teamIcon },
    { value: '1', label: 'Подгр. 1', icon: icons.oneTeamIcon },
    { value: '2', label: 'Подгр. 2', icon: icons.twoTeamIcon },
  ];

  const items: MenuProps['items'] = subgroupOptions.map(
    ({ value, label, icon }) => ({
      label: (
        <Flex
          align="center"
          gap={8}
          onClick={() => handleSubgroupChange(value)}
        >
          <Image src={icon} width={22} height={22} preview={false} />
          <Text type={subgroup === value ? 'success' : 'secondary'}>
            {label}
          </Text>
        </Flex>
      ),
      key: value,
    }),
  );

  const currentIcon =
    subgroupOptions.find((option) => option.value === subgroup)?.icon ||
    icons.teamIcon;

  return (
    <Dropdown menu={{ items }} trigger={['click']}>
      <Image
        onClick={(e) => e.preventDefault()}
        style={{ cursor: 'pointer' }}
        src={currentIcon}
        width={22}
        height={22}
        preview={false}
      />
    </Dropdown>
  );
};
