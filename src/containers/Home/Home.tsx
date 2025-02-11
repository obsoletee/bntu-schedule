import { Card, Carousel, Skeleton, Space, Typography } from 'antd';
import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CustomSpin } from '../../components/CustomSpin/CustomSpin';
import { getShortDayOfWeek, updateDateTime } from '../../utils/common';
import { State } from '../../store';
import { useViewportSize } from '../../hooks/useViewportSize';

const Header = lazy(() => import('../../components/Header'));
const Filter = lazy(() => import('../../components/Filter'));
const LessonListWithDate = lazy(() =>
  import('../../components/LessonListWithDate'),
);

import style from './Home.module.scss';
import { useScheduleLoader } from '../../hooks/useScheduleLoader';

interface ScheduleList {
  date: string;
  dayOfWeekEN: string;
  dayOfWeekRU: string;
  shortDayOfWeekRU: string;
  weekNumber: number;
}

export const Home = () => {
  const dispatch = useDispatch();

  const { Text, Title } = Typography;

  const { width } = useViewportSize();

  const { currentGroup, university } = useSelector(
    (state: State) => state.currentGroup,
  );

  const { isScheduleLoading } = useSelector((state: State) => state.schedule);

  useScheduleLoader(university, currentGroup);
  const [scheduleList, setScheduleList] = useState<ScheduleList[]>([]);

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
        university,
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
  }, [university]);

  useEffect(() => {
    generateSchedule();
  }, [university, currentGroup, generateSchedule, dispatch]);

  return (
    <div className={style.wrapper}>
      <Suspense fallback={<CustomSpin />}>
        <Header title="Расписание" />
      </Suspense>

      <div className={style.container}>
        {currentGroup ? (
          <>
            <div className={style.title}>
              <Title level={3}>Гр. {currentGroup}</Title>
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
                      <Suspense fallback={<Skeleton active />}>
                        {isScheduleLoading ? (
                          <Skeleton />
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
