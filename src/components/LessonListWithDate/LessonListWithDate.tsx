import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { DayOfWeek, DaySchedule } from '../../model/Schedule';
import { State } from '../../store';

import { LessonList } from '../LessonList/LessonList';
import {} from '../../store/scheduleReducer';

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
  const { schedule } = useSelector((state: State) => state.schedule);
  const [lessons, setLessons] = useState<DaySchedule[]>([]);

  const groupInfo = useSelector((state: State) => state.currentGroup);

  useEffect(() => {
    if (schedule) {
      const updatedLessons = groupInfo.subgroup
        ? schedule[date.dayOfWeekEN.toLowerCase() as DayOfWeek]?.filter(
            (item) =>
              item.week.includes(date.weekNumber.toString()) &&
              (!item.subgroup.localeCompare(groupInfo.subgroup) ||
                item.subgroup === '0'),
          ) || []
        : schedule[date.dayOfWeekEN.toLowerCase() as DayOfWeek]?.filter(
            (item) => item.week.includes(date.weekNumber.toString()),
          ) || [];

      setLessons(updatedLessons);
    }
  }, [groupInfo.subgroup, groupInfo.currentGroup, schedule, date]);

  return <LessonList items={lessons} />;
};
