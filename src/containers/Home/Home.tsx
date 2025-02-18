import { Card, Carousel, Select, Skeleton, Space, Typography } from 'antd';
import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { updateDateTime } from '../../utils/common';
import { State } from '../../store';
import { useViewportSize } from '../../hooks/useViewportSize';

const Header = lazy(() => import('../../components/Header'));
const LessonListWithDate = lazy(() =>
  import('../../components/LessonListWithDate'),
);

import style from './Home.module.scss';
import { setSchedule, setScheduleLoading } from '../../store/scheduleReducer';
import { API } from '../../model/apiConst';
import { GroupSchedule } from '../../model/Schedule';
import { changeGroupNumber } from '../../store/currentGroupReducer';
import { addLatestGroup } from '../../store/latestGroupsReducer';
import { changeActiveDayOfWeek } from '../../store/activeDayOfWeekReducer';

interface ScheduleList {
  date: string;
  dayOfWeekEN: string;
  dayOfWeekRU: string;
  shortDayOfWeekRU: string;
  weekNumber: number;
}

export const Home = () => {
  const dispatch = useDispatch();

  const { Text } = Typography;

  const { width } = useViewportSize();

  const { currentGroup, university } = useSelector(
    (state: State) => state.currentGroup,
  );

  const { isScheduleLoading } = useSelector((state: State) => state.schedule);
  const { availableGroups, isGroupsLoading } = useSelector(
    (state: State) => state.availableGroups,
  );

  const [bntuScheduleList, setBntuScheduleList] = useState<ScheduleList[]>([]);
  const [bsuirScheduleList, setBsuirScheduleList] = useState<ScheduleList[]>(
    [],
  );

  const generateSchedule = useCallback(() => {
    const startDate = new Date();
    const endDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      startDate.getDate(),
    );

    const bntuDaysArray: ScheduleList[] = [];
    const bsuirDaysArray: ScheduleList[] = [];
    const shortDaysOfWeekRU = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

    while (startDate <= endDate) {
      const dayOfWeekEN = startDate.toLocaleDateString('en-US', {
        weekday: 'long',
      });
      const dayOfWeekRU = startDate.toLocaleDateString('ru', {
        weekday: 'long',
      });

      const shortDayOfWeekRU = shortDaysOfWeekRU[startDate.getDay()];

      const bntuDate = updateDateTime('bntu', startDate);

      const bsuirDate = updateDateTime('bsuir', startDate);

      bntuDaysArray.push({
        date: bntuDate.formattedDate,
        dayOfWeekEN,
        dayOfWeekRU,
        shortDayOfWeekRU,
        weekNumber: bntuDate.studyWeekNumber,
      });

      bsuirDaysArray.push({
        date: bsuirDate.formattedDate,
        dayOfWeekEN,
        dayOfWeekRU,
        shortDayOfWeekRU,
        weekNumber: bsuirDate.studyWeekNumber,
      });

      startDate.setDate(startDate.getDate() + 1);
    }

    setBntuScheduleList(bntuDaysArray);
    setBsuirScheduleList(bsuirDaysArray);
  }, []);

  const { latestGroups } = useSelector((state: State) => state.latestGroups);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setScheduleLoading(true));
      try {
        const response = await fetch(
          `${API.url}/${university}/group${currentGroup}`,
        );

        if (!response.ok) {
          throw new Error('Ошибка при получении данных');
        }
        const result: GroupSchedule = await response.json();
        dispatch(setSchedule(result));
      } catch (error) {
        console.error('Ошибка:', error);
      } finally {
        dispatch(setScheduleLoading(false));
      }
    };

    fetchData();
  }, [currentGroup, university, dispatch]);

  useEffect(() => {
    generateSchedule();
  }, [university, currentGroup, generateSchedule, dispatch]);

  const handleChangeGroupNumber = useCallback(
    (value: string, university: string) => {
      dispatch(changeGroupNumber({ currentGroup: value, university }));

      if (!latestGroups.some((group) => group.groupNumber === value)) {
        dispatch(addLatestGroup({ groupNumber: value }));
      }

      dispatch(changeActiveDayOfWeek('1'));

      setScheduleLoading(false);
    },
    [dispatch, latestGroups],
  );

  return (
    <div className={style.wrapper}>
      <Suspense fallback={<Skeleton active />}>
        <Header />
      </Suspense>
      <div className={style.container}>
        {currentGroup ? (
          <>
            <Space direction="horizontal">
              <Text></Text>
              <Select
                disabled={isGroupsLoading}
                loading={isGroupsLoading}
                showSearch={true}
                placeholder="Номер группы"
                optionFilterProp="label"
                key={Math.random()}
                onChange={(value) => {
                  if (value !== currentGroup) {
                    dispatch(setScheduleLoading(true));
                    handleChangeGroupNumber(value, 'bntu');
                  }
                }}
                options={[
                  {
                    label: <span>БНТУ</span>,
                    title: 'bntu',
                    options: availableGroups.filter((group) => {
                      return group.data.universityCode === 'bntu';
                    }),
                  },
                  {
                    label: <span>БГУИР</span>,
                    title: 'bsuir',
                    options: availableGroups.filter((group) => {
                      return group.data.universityCode === 'bsuir';
                    }),
                  },
                ]}
              />
            </Space>

            <Carousel draggable infinite={false} dots={false} speed={250}>
              {university === 'bntu'
                ? bntuScheduleList.map((date) => (
                    <div key={date.date} className={style.card_container}>
                      <Space direction="vertical">
                        <Card
                          bordered
                          title={
                            <>
                              {width < 250
                                ? `${date.shortDayOfWeekRU}. ${date.date.slice(
                                    0,
                                    5,
                                  )} нед. ${date.weekNumber}`
                                : `${date.dayOfWeekRU
                                    .slice(0, 1)
                                    .toUpperCase()}${date.dayOfWeekRU.slice(
                                    1,
                                  )} ${date.date.slice(0, 5)} нед. ${
                                    date.weekNumber
                                  }`}
                            </>
                          }
                        >
                          <Suspense fallback={<Skeleton active />}>
                            {isScheduleLoading ? (
                              <Skeleton active />
                            ) : (
                              <LessonListWithDate date={date} />
                            )}
                          </Suspense>
                        </Card>
                      </Space>
                    </div>
                  ))
                : bsuirScheduleList.map((date) => (
                    <div key={date.date} className={style.card_container}>
                      <Space direction="vertical">
                        <Card
                          bordered
                          title={
                            <Space direction="vertical">
                              <div>
                                {width < 250
                                  ? `${
                                      date.shortDayOfWeekRU
                                    }. ${date.date.slice(0, 5)} нед. ${
                                      date.weekNumber
                                    }`
                                  : `${date.dayOfWeekRU
                                      .slice(0, 1)
                                      .toUpperCase()}${date.dayOfWeekRU.slice(
                                      1,
                                    )} ${date.date.slice(0, 5)} нед. ${
                                      date.weekNumber
                                    }`}
                              </div>
                            </Space>
                          }
                        >
                          <Suspense fallback={<Skeleton active />}>
                            {isScheduleLoading ? (
                              <Skeleton active />
                            ) : (
                              <LessonListWithDate date={date} />
                            )}
                          </Suspense>
                        </Card>
                      </Space>
                    </div>
                  ))}
            </Carousel>
          </>
        ) : (
          <Text type="danger">Сперва выберите группу.</Text>
        )}
      </div>
    </div>
  );
};
