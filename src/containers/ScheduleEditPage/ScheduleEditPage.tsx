import { Tabs, TabsProps, Typography } from 'antd';
import { useState, useEffect, lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';

import { CustomSpin } from '../../components/CustomSpin/CustomSpin';
const Header = lazy(() => import('../../components/Header'));

import { DaySchedule, GroupSchedule } from '../../model/Schedule';
import { State } from '../../store';

import style from './ScheduleEditPage.module.scss';
import LessonList from '../../components/LessonList';

export const ScheduleEditPage = () => {
  const groupInfo = useSelector((state: State) => state.currentGroup);
  const { Text, Title } = Typography;

  const [schedule, setSchedule] = useState<GroupSchedule>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/${groupInfo.university}/group${groupInfo.currentGroup}`,
        );

        if (!response.ok) {
          throw new Error('Ошибка при получении данных');
        }

        const result = await response.json();

        const transformedResult: GroupSchedule = {
          group: result.group,
          monday: result.monday || [],
          tuesday: result.tuesday || [],
          wednesday: result.wednesday || [],
          thursday: result.thursday || [],
          friday: result.friday || [],
          saturday: result.saturday || [],
          sunday: result.sunday || [],
        };

        setSchedule(transformedResult);
      } catch (error) {
        console.error('Ошибка:', error);
      }
    };

    fetchData();
  }, [groupInfo]);

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
        <Header />
      </Suspense>

      <div className={style.container}>
        {groupInfo ? (
          <>
            <div className={style.title}>
              <Title level={3}>Гр. {groupInfo.currentGroup}</Title>
            </div>
            <Tabs centered size="large" defaultActiveKey="1" items={items} />
          </>
        ) : (
          <Text type="danger">Сперва выберите группу.</Text>
        )}
      </div>
    </div>
  );
};
