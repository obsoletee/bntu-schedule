import { Drawer, Space, Select, List, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch, SetStateAction } from 'react';

import { bntuAllowedGroups, bsuirAllowedGroups } from '../../model/groups';
import { State } from '../../store';

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

  const version = useSelector((state: State) => state.version.version);

  const handleChangeGroupNumber = (value: string, university: string) => {
    dispatch({
      type: 'CHANGE_GROUP_NUMBER',
      payload: { currentGroup: value, university: university },
    });

    if (!latestGroups.some((group) => group.number === value)) {
      dispatch({
        type: 'ADD_LATEST_GROUPS',
        payload: { number: value, university: university },
      });
    }

    setIsMenuActive(false);
  };
  const handleUseGroupNumber = (value: string, university: string) => {
    dispatch({
      type: 'CHANGE_GROUP_NUMBER',
      payload: { currentGroup: value, university: university },
    });
    setIsMenuActive(false);
  };

  const handleDeleteLatestGroup = (value: string) => {
    dispatch({ type: 'REMOVE_LATEST_GROUPS', payload: value });
  };

  const onClose = () => {
    setIsMenuActive(false);
  };

  const onSearch = (value: string) => {
    console.log('search:', value);
  };
  return (
    <Drawer
      title={
        <Space direction="horizontal">
          <Text>Расписание</Text>
          <Text type="secondary">{version}</Text>
        </Space>
      }
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
            onChange={(value) => {
              handleChangeGroupNumber(value, 'bntu');
            }}
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
            onChange={(value) => {
              handleChangeGroupNumber(value, 'bsuir');
            }}
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
                        onClick={() =>
                          handleUseGroupNumber(group.number, group.university)
                        }
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
