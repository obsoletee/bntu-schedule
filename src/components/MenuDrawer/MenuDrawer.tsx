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
import { changeGroupNumber } from '../../store/currentGroupReducer';
import {
  addLatestGroup,
  removeLatestGroup,
} from '../../store/latestGroupsReducer';
import { changeActiveDayOfWeek } from '../../store/activeDayOfWeek';
import { setScheduleLoading } from '../../store/scheduleReducer';
import { selectOptions } from './SelectOptions';

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

  const { latestGroups } = useSelector((state: State) => state.latestGroups);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const latestVersion = useMemo(() => {
    return versions.slice(-1)[0];
  }, []);

  const latestGroupsReversed = useMemo(() => {
    return latestGroups.slice(-5).reverse();
  }, [latestGroups]);

  const handleChangeGroupNumber = useCallback(
    (value: string, university: string) => {
      setIsMenuActive(false);

      setScheduleLoading(true);

      dispatch(changeGroupNumber({ currentGroup: value, university }));

      if (!latestGroups.some((group) => group.number === value)) {
        dispatch(addLatestGroup({ number: value, university }));
      }

      dispatch(changeActiveDayOfWeek('1'));

      setScheduleLoading(false);
    },
    [dispatch, latestGroups, setIsMenuActive],
  );

  const handleUseGroupNumber = useCallback(
    (value: string, university: string) => {
      setIsMenuActive(false);
      dispatch(
        changeGroupNumber({ currentGroup: value, university: university }),
      );
      dispatch(changeActiveDayOfWeek('1'));
    },
    [dispatch, setIsMenuActive],
  );

  const handleDeleteLatestGroup = useCallback(
    (value: string) => {
      dispatch(removeLatestGroup(value));
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
              <Link
                onClick={() => {
                  setIsMenuActive(false);
                }}
                to={HOME}
              >
                Расписание
              </Link>
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
                  key={Math.random()}
                  {...selectOptions}
                  onChange={(value) => {
                    handleChangeGroupNumber(value, 'bntu');
                  }}
                  options={bntuAllowedGroups}
                />
              </Space>
              <Space direction="horizontal">
                <Text>БГУИР</Text>
                <Select
                  {...selectOptions}
                  onChange={(value) => {
                    handleChangeGroupNumber(value, 'bsuir');
                  }}
                  options={bsuirAllowedGroups}
                  key={Math.random()}
                />
              </Space>
              {latestGroups.length > 0 ? (
                <List
                  header={<Title level={4}>Последние:</Title>}
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
          {/*           
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
          </Space> */}
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
