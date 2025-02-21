import { Card, Carousel, Skeleton, Typography } from 'antd';
import { lazy, Suspense, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { API } from '../../model/apiConst';
import { DaySchedule, daysOfWeek, GroupSchedule } from '../../model/Schedule';
import { State } from '../../store';
import { setSchedule, setScheduleLoading } from '../../store/scheduleReducer';
import { useDispatch } from 'react-redux';

const Header = lazy(() => import('../../components/Header'));
const LessonList = lazy(() => import('../../components/LessonList'));

import style from './FullSchedulePage.module.scss';

export const FullSchedulePage = () => {
  const { university, currentGroup } = useSelector(
    (state: State) => state.currentGroup,
  );
  const { Text } = Typography;

  const { schedule } = useSelector((state: State) => state.schedule);

  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      dispatch(setScheduleLoading(true));
      try {
        const response = await fetch(
          `${API.localhost}/${university}/group${currentGroup}`,
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

  const items = daysOfWeek.map(({ label, day }) => ({
    children: (
      <Card
        size="small"
        bordered
        title={
          <Text strong style={{ fontSize: '18px' }}>
            {label}
          </Text>
        }
      >
        <Suspense fallback={<Skeleton active />}>
          <LessonList items={schedule?.[day] as DaySchedule[] | undefined} />
        </Suspense>
      </Card>
    ),
  }));

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
              {items.map((item) => (
                <>{item.children}</>
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
