import { Skeleton, Tabs, TabsProps, Typography } from 'antd';
import { lazy, Suspense, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { API } from '../../model/apiConst';
import { DaySchedule, daysOfWeek, GroupSchedule } from '../../model/Schedule';
import { State } from '../../store';
import { setSchedule, setScheduleLoading } from '../../store/scheduleReducer';
import { useDispatch } from 'react-redux';
import { useViewportSize } from '../../hooks/useViewportSize';

const Header = lazy(() => import('../../components/Header'));
const LessonList = lazy(() => import('../../components/LessonList'));

import style from './ScheduleEditPage.module.scss';

import { changeActiveDayOfWeek } from '../../store/activeDayOfWeekReducer';

export const ScheduleEditPage = () => {
  const { university, currentGroup } = useSelector(
    (state: State) => state.currentGroup,
  );
  const { Text } = Typography;

  const { schedule } = useSelector((state: State) => state.schedule);

  const { activeDayOfWeek } = useSelector(
    (state: State) => state.activeDayOfWeek,
  );

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

  const { width } = useViewportSize();
  const items: TabsProps['items'] = daysOfWeek.map(({ key, label, day }) => ({
    key,
    label,
    children: (
      <Suspense fallback={<Skeleton active />}>
        <LessonList
          addButton
          addModal={true}
          editModal={true}
          deleteModal={true}
          items={schedule?.[day] as DaySchedule[] | undefined}
        />
      </Suspense>
    ),
  }));

  return (
    <div className={style.wrapper}>
      <Suspense fallback={<Skeleton active />}>
        <Header />
      </Suspense>

      <div className={style.container}>
        {currentGroup ? (
          <Tabs
            activeKey={activeDayOfWeek}
            onChange={(value) => {
              dispatch(changeActiveDayOfWeek(value));
            }}
            centered={width < 768 ? false : true}
            size="large"
            defaultActiveKey="1"
            items={items}
          />
        ) : (
          <Text type="danger">Сперва выберите группу.</Text>
        )}
      </div>
    </div>
  );
};
