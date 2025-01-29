import { Drawer, Space, Select, List, Typography } from 'antd';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { bntuAllowedGroups, bsuirAllowedGroups } from '../../model/groups';
import { HOME } from '../../routes';
import { State } from '../../store';
import { versions } from '../../model/version';
import { VersionModal } from '../VersionModal/VersionModal';

import style from './MenuDrawer.module.scss';

interface MenuDrawerProps {
  isMenuActive: boolean;
  setIsMenuActive: Dispatch<SetStateAction<boolean>>;
}

export const MenuDrawer = ({
  isMenuActive,
  setIsMenuActive,
}: MenuDrawerProps) => {
  const dispatch = useDispatch();

  const { Title, Text } = Typography;

  const latestGroups = useSelector(
    (state: State) => state.latestGroups.latestGroups,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const latestVersion = useMemo(() => {
    return versions.slice(-1)[0];
  }, []);

  const latestGroupsReversed = useMemo(() => {
    return latestGroups.slice(-5).reverse();
  }, [latestGroups]);

  const handleChangeGroupNumber = useCallback(
    (value: string, university: string) => {
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
    },
    [dispatch, latestGroups, setIsMenuActive],
  );
  const handleUseGroupNumber = useCallback(
    (value: string, university: string) => {
      dispatch({
        type: 'CHANGE_GROUP_NUMBER',
        payload: { currentGroup: value, university: university },
      });
      dispatch({ type: 'CHANGE_ACTIVE_DAY_OF_WEEK', payload: '1' });
      setIsMenuActive(false);
    },
    [dispatch, setIsMenuActive],
  );

  const handleDeleteLatestGroup = useCallback(
    (value: string) => {
      dispatch({ type: 'REMOVE_LATEST_GROUPS', payload: value });
    },
    [dispatch],
  );

  const onClose = useCallback(() => {
    setIsMenuActive(false);
  }, [setIsMenuActive]);

  const changesHandle = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  return (
    <>
      <Drawer
        title={
          <Space direction="horizontal">
            <Text>
              <Link to={HOME}>Расписание</Link>
            </Text>
            <Text
              type="secondary"
              className={style.version}
              onClick={changesHandle}
            >
              {`v${latestVersion.title}`}
            </Text>
          </Space>
        }
        placement={'left'}
        onClose={onClose}
        open={isMenuActive}
      >
        <Space direction="vertical" className={style.drawer_container}>
          <Space direction="vertical">
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
                  options={bsuirAllowedGroups}
                />
              </Space>
              {latestGroups.length > 0 ? (
                <List
                  header={<Title level={4}>Добавленные:</Title>}
                  itemLayout="horizontal"
                  dataSource={latestGroupsReversed}
                  renderItem={(group) => (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <Space direction="horizontal">
                            <Text
                              style={{ cursor: 'pointer' }}
                              onClick={() =>
                                handleUseGroupNumber(
                                  group.number,
                                  group.university,
                                )
                              }
                            >{`${group.number} `}</Text>
                            <Text
                              onClick={() =>
                                handleDeleteLatestGroup(group.number)
                              }
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
          </Space>
          <Space direction="vertical">
            <Text strong>
              <Link to={'/subjects'}>Список предметов</Link>
            </Text>
            <Text strong>
              <Link to={'/teachers'}>Список учителей</Link>
            </Text>
            <Text strong>
              <Link to={'/edit'}>Редактор расписания</Link>
            </Text>
          </Space>
        </Space>
      </Drawer>
      <VersionModal
        data={latestVersion}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};
