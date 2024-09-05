import { Drawer, Space, Select, List, Typography } from 'antd';
import { bntuAllowedGroups, bsuirAllowedGroups } from '../../model/groups';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../../store';
import { Dispatch, SetStateAction } from 'react';

interface MenuDrawerProps {
  isMenuActive: boolean;
  setIsMenuActive: Dispatch<SetStateAction<boolean>>;
}

export const MenuDrawer = ({
  isMenuActive,
  setIsMenuActive,
}: MenuDrawerProps) => {
  const { Title, Text } = Typography;

  const dispatch = useDispatch();
  const latestGroups = useSelector(
    (state: State) => state.latestGroups.latestGroups,
  );

  const handleChangeGroupNumber = (value: string) => {
    dispatch({ type: 'CHANGE_GROUP_NUMBER', payload: value });

    if (!latestGroups.some((group) => group.number === value)) {
      dispatch({
        type: 'ADD_LATEST_GROUPS',
        payload: { number: value },
      });
    }

    setIsMenuActive(false);
  };
  const handleUseGroupNumber = (value: string) => {
    dispatch({ type: 'CHANGE_GROUP_NUMBER', payload: value });
    setIsMenuActive(false);
  };

  const handleDeleteLatestGroup = (value: string) => {
    dispatch({ type: 'REMOVE_LATEST_GROUPS', payload: value });
  };

  const onClose = () => {
    setIsMenuActive(false);
  };

  const onChange = (value: string) => {
    handleChangeGroupNumber(value);
  };

  const onSearch = (value: string) => {
    console.log('search:', value);
  };
  return (
    <Drawer
      title="Расписание"
      placement={'left'}
      onClose={onClose}
      open={isMenuActive}
    >
      <Title level={3}>Выберите группу:</Title>
      <Space direction="vertical">
        <Space direction="horizontal">
          <Text>БНТУ</Text>
          <Select
            showSearch
            placeholder="Номер группы"
            optionFilterProp="label"
            onChange={onChange}
            onSearch={onSearch}
            options={bntuAllowedGroups}
          />
        </Space>
        <Space direction="horizontal">
          <Text>БГУИР</Text>
          <Select
            showSearch
            placeholder="Номер группы"
            optionFilterProp="label"
            onChange={onChange}
            onSearch={onSearch}
            options={bsuirAllowedGroups}
          />
        </Space>
        {latestGroups.length > 0 ? (
          <List
            header={<Title level={4}>Добавленные:</Title>}
            itemLayout="horizontal"
            dataSource={latestGroups}
            renderItem={(group) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <Space direction="horizontal">
                      <Text
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleUseGroupNumber(group.number)}
                      >{`${group.number} `}</Text>
                      <Text
                        onClick={() => handleDeleteLatestGroup(group.number)}
                        style={{ cursor: 'pointer' }}
                        type="secondary"
                      >
                        x
                      </Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Text>Добавленных групп нет.</Text>
        )}
      </Space>
    </Drawer>
  );
};
