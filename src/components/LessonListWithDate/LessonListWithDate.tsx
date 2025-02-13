import { lazy, Suspense, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { DayOfWeek, DaySchedule } from '../../model/Schedule';
import { State } from '../../store';
import { Skeleton } from 'antd';

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
  const { subgroup, currentGroup } = useSelector(
    (state: State) => state.currentGroup,
  );
  const { schedule } = useSelector((state: State) => state.schedule);

  const [lessons, setLessons] = useState<DaySchedule[]>([]);

  useEffect(() => {
    if (schedule) {
      const updatedLessons = subgroup
        ? schedule[date.dayOfWeekEN.toLowerCase() as DayOfWeek]?.filter(
            (item) =>
              item.week.includes(date.weekNumber.toString()) &&
              (!item.subgroup.localeCompare(subgroup) || item.subgroup === '0'),
          ) || []
        : schedule[
            date.dayOfWeekEN.toLowerCase() as DayOfWeek
          ]?.filter((item) => item.week.includes(date.weekNumber.toString())) ||
          [];

      setLessons(updatedLessons);
    }
  }, [subgroup, currentGroup, schedule, date]);

  return (
    <Suspense fallback={<Skeleton active />}>
      <LessonList items={lessons} />
    </Suspense>
  );
};
