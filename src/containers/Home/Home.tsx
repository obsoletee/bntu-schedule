import { Card, Carousel, Select, Skeleton, Space, Typography } from 'antd';
import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { updateDateTime } from '../../utils/common';
import { State } from '../../store';
import { useViewportSize } from '../../hooks/useViewportSize';

const Header = lazy(() => import('../../components/Header'));
const Filter = lazy(() => import('../../components/Filter'));
const LessonListWithDate = lazy(() =>
  import('../../components/LessonListWithDate'),
);

import style from './Home.module.scss';
import { setSchedule, setScheduleLoading } from '../../store/scheduleReducer';
import { API } from '../../model/apiConst';
import { GroupSchedule } from '../../model/Schedule';
import { changeGroupNumber } from '../../store/currentGroupReducer';
import { addLatestGroup } from '../../store/latestGroupsReducer';
import { changeActiveDayOfWeek } from '../../store/activeDayOfWeek';
import { bntuAllowedGroups, bsuirAllowedGroups } from '../../model/groups';
import { selectOptions } from '../../components/MenuDrawer/SelectOptions';

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

      if (!latestGroups.some((group) => group.number === value)) {
        dispatch(addLatestGroup({ number: value, university }));
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
            <Space
              style={
                width < 768
                  ? {
                      padding: '0 10px',
                      width: '100%',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }
                  : {
                      padding: '0 10px',
                      width: '100%',
                      flexDirection: 'row',
                    }
              }
            >
              <Space direction="horizontal">
                <Text>БНТУ:</Text>
                <Select
                  key={Math.random()}
                  {...selectOptions}
                  onChange={(value) => {
                    dispatch(setScheduleLoading(true));
                    handleChangeGroupNumber(value, 'bntu');
                  }}
                  options={bntuAllowedGroups}
                />
              </Space>
              <Space direction="horizontal">
                <Text>БГУИР:</Text>
                <Select
                  {...selectOptions}
                  onChange={(value) => {
                    handleChangeGroupNumber(value, 'bsuir');
                  }}
                  options={bsuirAllowedGroups}
                  key={Math.random()}
                />
              </Space>
            </Space>

            <Carousel draggable infinite={false} dots={false} speed={250}>
              {university === 'bntu'
                ? bntuScheduleList.map((date) => (
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
                              <Suspense fallback={<Skeleton active />}>
                                <Filter />
                              </Suspense>
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
                              <Suspense fallback={<Skeleton active />}>
                                <Filter />
                              </Suspense>
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
