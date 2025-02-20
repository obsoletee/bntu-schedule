import { Card, Carousel, Skeleton, Space, Typography } from 'antd';
import { useState, useEffect, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
  const { isGroupsLoading } = useSelector(
    (state: State) => state.availableGroups,
  );

  const [bntuScheduleList, setBntuScheduleList] = useState<ScheduleList[]>([]);
  const [bsuirScheduleList, setBsuirScheduleList] = useState<ScheduleList[]>(
    [],
  );

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
    const fetchSchedule = async () => {
      dispatch(setScheduleLoading(true));
      try {
        const response = await fetch(
          `${API.localhost}/generateSchedule/${university}`,
        );

        if (!response.ok) {
          throw new Error('Ошибка при получении данных');
        }

        const result: ScheduleList[] = await response.json();
        switch (university) {
          case 'bntu': {
            setBntuScheduleList(result);
            break;
          }
          case 'bsuir': {
            setBsuirScheduleList(result);
            break;
          }
        }
      } catch (error) {
        console.error('Ошибка:', error);
      } finally {
        dispatch(setScheduleLoading(false));
      }
    };

    fetchSchedule();
  }, [university, dispatch]);

  return (
    <div className={style.wrapper}>
      <header>
        <Suspense
          fallback={
            <Skeleton.Input
              style={{
                margin: '10px 20px',
                width: '100%',
                height: '20px',
              }}
              active
            />
          }
        >
          <Header />
        </Suspense>
      </header>
      <div className={style.container}>
        {currentGroup ? (
          <>
            <Carousel draggable infinite={false} dots={false} speed={250}>
              {university === 'bntu'
                ? bntuScheduleList.map((date) => (
                    <Space direction="vertical">
                      <Card
                        size="small"
                        title={
                          <Text>
                            {width < 250
                              ? `${date.shortDayOfWeekRU}. ${date.date.slice(
                                  0,
                                  5,
                                )}, нед. ${date.weekNumber}`
                              : `${date.dayOfWeekRU
                                  .slice(0, 1)
                                  .toUpperCase()}${date.dayOfWeekRU.slice(
                                  1,
                                )} ${date.date.slice(0, 5)}, нед. ${
                                  date.weekNumber
                                }`}
                          </Text>
                        }
                      >
                        <Suspense fallback={<Skeleton active />}>
                          {isScheduleLoading || isGroupsLoading ? (
                            <Skeleton active />
                          ) : (
                            <LessonListWithDate date={date} />
                          )}
                        </Suspense>
                      </Card>
                    </Space>
                  ))
                : bsuirScheduleList.map((date) => (
                    <Space direction="vertical">
                      <Card
                        title={
                          <Space direction="vertical">
                            <div>
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
