import { Tabs, TabsProps, Typography } from 'antd';
import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';

import { CustomSpin } from '../../components/CustomSpin/CustomSpin';
import { DaySchedule, daysOfWeek } from '../../model/Schedule';
import { State } from '../../store';
import { useDispatch } from 'react-redux';
import { useViewportSize } from '../../hooks/useViewportSize';

const Header = lazy(() => import('../../components/Header'));
const LessonList = lazy(() => import('../../components/LessonList'));

import style from './ScheduleEditPage.module.scss';
import { useScheduleLoader } from '../../hooks/useScheduleLoader';
import { changeActiveDayOfWeek } from '../../store/activeDayOfWeek';

export const ScheduleEditPage = () => {
  const { university, currentGroup } = useSelector(
    (state: State) => state.currentGroup,
  );
  const { Text, Title } = Typography;

  useScheduleLoader(university, currentGroup);
  const { schedule } = useSelector((state: State) => state.schedule);

  const { activeDayOfWeek } = useSelector(
    (state: State) => state.activeDayOfWeek,
  );

  const dispatch = useDispatch();

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
        {currentGroup ? (
          <>
            <div className={style.title}>
              <Title level={3}>Гр. {currentGroup}</Title>
            </div>
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
          </>
        ) : (
          <Text type="danger">Сперва выберите группу.</Text>
        )}
      </div>
    </div>
  );
};
