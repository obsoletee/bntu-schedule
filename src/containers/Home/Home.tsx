import { Card, Carousel, Space, Typography } from 'antd';
import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CustomSpin } from '../../components/CustomSpin/CustomSpin';
const Header = lazy(() => import('../../components/Header'));
const Filter = lazy(() => import('../../components/Filter'));
const LessonListWithDate = lazy(
  () => import('../../components/LessonListWithDate'),
);

import { GroupSchedule } from '../../model/Schedule';
import { getShortDayOfWeek, updateDateTime } from '../../utils/common';
import { State } from '../../store';
import { useViewportSize } from '../../hooks/useViewportSize';

import style from './Home.module.scss';
import { setSchedule, setScheduleLoading } from '../../store/scheduleReducer';

interface ScheduleList {
  date: string;
  dayOfWeekEN: string;
  dayOfWeekRU: string;
  shortDayOfWeekRU: string;
  weekNumber: number;
}

export const Home = () => {
  const groupInfo = useSelector((state: State) => state.currentGroup);

  const dispatch = useDispatch();

  const [scheduleList, setScheduleList] = useState<ScheduleList[]>([]);

  const { width } = useViewportSize();
  const { Text, Title } = Typography;

  const generateSchedule = useCallback(() => {
    const startDate = new Date();
    const endDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      startDate.getDate(),
    );

    const daysArray: ScheduleList[] = [];

    while (startDate <= endDate) {
      const dayOfWeekEN = startDate.toLocaleDateString('en-US', {
        weekday: 'long',
      });
      const dayOfWeekRU = startDate.toLocaleDateString('ru', {
        weekday: 'long',
      });

      const shortDayOfWeekRU = getShortDayOfWeek(dayOfWeekRU);

      const { formattedDate, studyWeekNumber } = updateDateTime(
        groupInfo.university,
        startDate,
      );

      const dateList = {
        date: formattedDate,
        dayOfWeekEN,
        dayOfWeekRU,
        shortDayOfWeekRU,
        weekNumber: studyWeekNumber,
      };

      daysArray.push(dateList);
      startDate.setDate(startDate.getDate() + 1);
    }

    setScheduleList(daysArray);
  }, [groupInfo]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setScheduleLoading(true));
      try {
        const response = await fetch(
          `http://localhost:8000/${groupInfo.university}/group${groupInfo.currentGroup}`,
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
    generateSchedule();
  }, [groupInfo, generateSchedule, dispatch]);

  return (
    <div className={style.wrapper}>
      <Suspense fallback={<CustomSpin />}>
        <Header title="Расписание" />
      </Suspense>

      <div className={style.container}>
        {groupInfo ? (
          <>
            <div className={style.title}>
              <Title level={3}>Гр. {groupInfo.currentGroup}</Title>
            </div>
            <Carousel draggable infinite={false} dots={false} speed={250}>
              {scheduleList.map((date) => (
                <div key={date.date} className={style.card_container}>
                  <Space direction="vertical">
                    <Card
                      bordered
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
                          <Suspense fallback={<CustomSpin />}>
                            <Filter />
                          </Suspense>
                        </Space>
                      }
                    >
                      {groupInfo.university === '' ? (
                        <></>
                      ) : (
                        <Suspense fallback={<CustomSpin />}>
                          <LessonListWithDate date={date} />
                        </Suspense>
                      )}
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
