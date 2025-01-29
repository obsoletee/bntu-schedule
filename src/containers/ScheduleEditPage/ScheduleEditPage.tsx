import { Tabs, TabsProps, Typography } from 'antd';
import { lazy, Suspense, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { API } from '../../model/apiConst';
import { CustomSpin } from '../../components/CustomSpin/CustomSpin';
import { DaySchedule, daysOfWeek, GroupSchedule } from '../../model/Schedule';
import { State } from '../../store';
import { setSchedule, setScheduleLoading } from '../../store/scheduleReducer';
import { useDispatch } from 'react-redux';
import { useViewportSize } from '../../hooks/useViewportSize';

const Header = lazy(() => import('../../components/Header'));
const LessonList = lazy(() => import('../../components/LessonList'));

import style from './ScheduleEditPage.module.scss';

export const ScheduleEditPage = () => {
  const groupInfo = useSelector((state: State) => state.currentGroup);
  const { Text, Title } = Typography;

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
          `${API.url}/${groupInfo.university}/group${groupInfo.currentGroup}`,
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
  }, [groupInfo, dispatch]);

  const { width } = useViewportSize();
  const items: TabsProps['items'] = daysOfWeek.map(({ key, label, day }) => ({
    key,
    label,
    children: (
      <Suspense fallback={<CustomSpin />}>
        <LessonList
          addButton
          addModal={true}
          editModal={true}
          deleteModal={true}
          items={
            day === 'sunday'
              ? undefined
              : (schedule?.[day] as DaySchedule[] | undefined)
          }
        />
      </Suspense>
    ),
  }));

  return (
    <div className={style.wrapper}>
      <Suspense fallback={<CustomSpin />}>
        <Header title="Редактор расписания" />
      </Suspense>

      <div className={style.container}>
        {groupInfo.currentGroup ? (
          <>
            <div className={style.title}>
              <Title level={3}>Гр. {groupInfo.currentGroup}</Title>
            </div>
            <Tabs
              activeKey={activeDayOfWeek}
              onChange={(value) => {
                dispatch({ type: 'CHANGE_ACTIVE_DAY_OF_WEEK', payload: value });
              }}
              centered={width < 768 ? false : true}
              size="large"
              defaultActiveKey="1"
              items={items}
            />
          </>
        ) : (
          <Text type="danger">Сперва выберите группу.</Text>
        )}
      </div>
    </div>
  );
};
