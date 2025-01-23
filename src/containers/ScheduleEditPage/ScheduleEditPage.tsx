import { Tabs, TabsProps, Typography } from 'antd';
import { useState, useEffect, lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';

import { CustomSpin } from '../../components/CustomSpin/CustomSpin';
const Header = lazy(() => import('../../components/Header'));

import { GroupSchedule } from '../../model/Schedule';
import { State } from '../../store';

import style from './ScheduleEditPage.module.scss';
import LessonList from '../../components/LessonList';

export const ScheduleEditPage = () => {
  const groupInfo = useSelector((state: State) => state.currentGroup);

  const [schedule, setSchedule] = useState<GroupSchedule>();
  const { Text, Title } = Typography;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://long-edy-obsoletee-6b4c05a7.koyeb.app/${groupInfo.university}/group${groupInfo.currentGroup}`,
        );

        if (!response.ok) {
          throw new Error('Ошибка при получении данных');
        }
        const result: GroupSchedule = await response.json();
        setSchedule(result);
      } catch (error) {
        console.error('Ошибка:', error);
      }
    };

    fetchData();
  }, [groupInfo]);

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Понедельник',
      children: <LessonList items={schedule?.monday} iconSize="large" />,
    },
    {
      key: '2',
      label: 'Вторник',
      children: <LessonList items={schedule?.tuesday} iconSize="large" />,
    },
    {
      key: '3',
      label: 'Среда',
      children: <LessonList items={schedule?.wednesday} iconSize="large" />,
    },
    {
      key: '4',
      label: 'Четверг',
      children: <LessonList items={schedule?.thursday} iconSize="large" />,
    },
    {
      key: '5',
      label: 'Пятница',
      children: <LessonList items={schedule?.friday} iconSize="large" />,
    },
    {
      key: '6',
      label: 'Суббота',
      children: <LessonList items={schedule?.saturday} iconSize="large" />,
    },
    {
      key: '7',
      label: 'Воскресенье',
      children: <></>,
    },
  ];

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
