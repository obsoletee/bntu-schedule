import { lazy, Suspense, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { CustomSpin } from '../CustomSpin/CustomSpin';
import { DayOfWeek, DaySchedule } from '../../model/Schedule';
import { State } from '../../store';

const LessonList = lazy(() => import('../LessonList'));

interface ScheduleList {
  date: string;
  dayOfWeekEN: string;
  dayOfWeekRU: string;
  shortDayOfWeekRU: string;
  weekNumber: number;
}
interface LessonListWithDateProps {
  date: ScheduleList;
}

export const LessonListWithDate = ({ date }: LessonListWithDateProps) => {
  const { currentGroup } = useSelector((state: State) => state.currentGroup);
  const { schedule } = useSelector((state: State) => state.schedule);

  const [lessons, setLessons] = useState<DaySchedule[]>([]);

  useEffect(() => {
    if (schedule) {
      const updatedLessons =
        schedule[date.dayOfWeekEN.toLowerCase() as DayOfWeek]?.filter((item) =>
          item.week.includes(date.weekNumber.toString()),
        ) || [];

      setLessons(updatedLessons);
    }
  }, [currentGroup, schedule, date]);

  return (
    <Suspense fallback={<CustomSpin />}>
      <LessonList items={lessons} />
    </Suspense>
  );
};
