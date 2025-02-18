import { Drawer, Space, List, Typography, Flex, Image } from 'antd';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { HOME } from '../../routes';
import { State } from '../../store';
import { versions } from '../../model/version';
import { VersionModal } from '../VersionModal/VersionModal';

import style from './MenuDrawer.module.scss';
import { changeGroupNumber } from '../../store/currentGroupReducer';
import { removeLatestGroup } from '../../store/latestGroupsReducer';
import { changeActiveDayOfWeek } from '../../store/activeDayOfWeekReducer';
import { setScheduleLoading } from '../../store/scheduleReducer';
import { useViewportSize } from '../../hooks/useViewportSize';
import { DeleteOutlined } from '@ant-design/icons';
import { icons } from '../../assets/icons';
import { API } from '../../model/apiConst';
import {
  AllowedGroups,
  setGroups,
  setGroupsLoading,
} from '../../store/availableGroupsReducer';

interface MenuDrawerProps {
  isMenuActive: boolean;
  setIsMenuActive: Dispatch<SetStateAction<boolean>>;
}

export const MenuDrawer = ({
  isMenuActive,
  setIsMenuActive,
}: MenuDrawerProps) => {
  const dispatch = useDispatch();

  const { Text } = Typography;

  const { width } = useViewportSize();

  const { latestGroups } = useSelector((state: State) => state.latestGroups);
  const { availableGroups } = useSelector(
    (state: State) => state.availableGroups,
  );

  const latestGroupDetails = useMemo(() => {
    const latestGroupNumbers = latestGroups.map((group) => group.groupNumber);

    return availableGroups.filter((group) =>
      latestGroupNumbers.includes(group.value),
    );
  }, [availableGroups, latestGroups]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const latestVersion = useMemo(() => {
    return versions.slice(-1)[0];
  }, []);

  const latestGroupsReversed = useMemo(() => {
    return latestGroupDetails.slice(-5).reverse();
  }, [latestGroupDetails]);

  const handleUseGroupNumber = useCallback(
    (value: string, university: string) => {
      setIsMenuActive(false);
      setScheduleLoading(true);
      dispatch(changeGroupNumber({ currentGroup: value, university }));
      dispatch(changeActiveDayOfWeek('1'));
      setScheduleLoading(false);
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

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setGroupsLoading(true));
      try {
        const response = await fetch(`${API.localhost}/availableGroups`);

        if (!response.ok) {
          throw new Error('Ошибка при получении данных');
        }
        const result: AllowedGroups[] = await response.json();
        dispatch(setGroups(result));
      } catch (error) {
        console.error('Ошибка:', error);
      } finally {
        dispatch(setGroupsLoading(false));
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <>
      <Drawer
        width={width < 473 ? '80%' : 378}
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
            <Space direction="vertical">
              {latestGroups.length > 0 ? (
                <List
                  header={
                    <Text strong style={{ fontSize: '24px' }}>
                      Последние группы:
                    </Text>
                  }
                  itemLayout="horizontal"
                  dataSource={latestGroupsReversed}
                  renderItem={(group) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Flex
                            style={{ cursor: 'pointer' }}
                            onClick={() =>
                              handleUseGroupNumber(
                                group.data.groupNumber,
                                group.data.universityCode,
                              )
                            }
                          >
                            {group.data.universityCode === 'bntu' ? (
                              <Image
                                src={icons.bntuLogo}
                                width={32}
                                height={32}
                                preview={false}
                              />
                            ) : (
                              <Image
                                preview={false}
                                src={icons.bsuirLogo}
                                width={32}
                                height={32}
                              />
                            )}
                          </Flex>
                        }
                        title={
                          <Flex
                            justify="space-between"
                            align="center"
                            onClick={() =>
                              handleUseGroupNumber(
                                group.data.groupNumber,
                                group.data.universityCode,
                              )
                            }
                          >
                            <Text
                              strong
                              underline
                              style={{ cursor: 'pointer' }}
                            >
                              {group.data.groupNumber}
                            </Text>

                            <DeleteOutlined
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteLatestGroup(group.data.groupNumber);
                              }}
                              style={{ cursor: 'pointer', fontSize: '18px' }}
                            />
                          </Flex>
                        }
                        description={
                          <Space
                            style={{ cursor: 'pointer' }}
                            onClick={() =>
                              handleUseGroupNumber(
                                group.data.groupNumber,
                                group.data.universityCode,
                              )
                            }
                          >
                            <Text>{group.data.universityName}</Text>
                            <Text>|</Text>
                            <Text>{group.data.departmentShortName}</Text>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <Text style={{ fontSize: '18px' }}>Добавленных групп нет.</Text>
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
