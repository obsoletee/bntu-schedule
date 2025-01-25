import { Tabs, TabsProps, Typography } from 'antd';
import { lazy, Suspense, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { CustomSpin } from '../../components/CustomSpin/CustomSpin';
const Header = lazy(() => import('../../components/Header'));

import { DaySchedule, GroupSchedule } from '../../model/Schedule';
import { State } from '../../store';

import style from './ScheduleEditPage.module.scss';
import LessonList from '../../components/LessonList';
import { useDispatch } from 'react-redux';
import { setSchedule, setScheduleLoading } from '../../store/scheduleReducer';

export const ScheduleEditPage = () => {
  const groupInfo = useSelector((state: State) => state.currentGroup);
  const { Text, Title } = Typography;

  const { schedule } = useSelector((state: State) => state.schedule);

  const activeDayOfWeek = useSelector(
    (state: State) => state.activeDayOfWeek.activeDayOfWeek,
  );

  const daysOfWeek: Array<{
    key: string;
    label: string;
    day: keyof GroupSchedule;
  }> = [
    { key: '1', label: 'Понедельник', day: 'monday' },
    { key: '2', label: 'Вторник', day: 'tuesday' },
    { key: '3', label: 'Среда', day: 'wednesday' },
    { key: '4', label: 'Четверг', day: 'thursday' },
    { key: '5', label: 'Пятница', day: 'friday' },
    { key: '6', label: 'Суббота', day: 'saturday' },
    { key: '7', label: 'Воскресенье', day: 'sunday' },
  ];

  const dispatch = useDispatch();
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
  }, [groupInfo, dispatch]);

  const items: TabsProps['items'] = daysOfWeek.map(({ key, label, day }) => ({
    key,
    label,
    children: (
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
        iconSize="large"
      />
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
              centered
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
