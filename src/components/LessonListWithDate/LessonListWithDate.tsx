import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { DayOfWeek, DaySchedule, GroupSchedule } from '../../model/Schedule';
import { State } from '../../store';

import { LessonList } from '../LessonList/LessonList';

interface ScheduleList {
  date: string;
  dayOfWeekEN: string;
  dayOfWeekRU: string;
  shortDayOfWeekRU: string;
  weekNumber: number;
}
interface LessonListWithDateProps {
  data: GroupSchedule | undefined;
  date: ScheduleList;
}

export const LessonListWithDate = ({ data, date }: LessonListWithDateProps) => {
  const [lessons, setLessons] = useState<DaySchedule[]>([]);

  const groupInfo = useSelector((state: State) => state.currentGroup);

  useEffect(() => {
    if (data) {
      const updatedLessons = groupInfo.subgroup
        ? data[date.dayOfWeekEN.toLowerCase() as DayOfWeek]?.filter(
            (item) =>
              item.week.includes(date.weekNumber.toString()) &&
              (!item.subgroup.localeCompare(groupInfo.subgroup) ||
                item.subgroup === '0'),
          ) || []
        : data[date.dayOfWeekEN.toLowerCase() as DayOfWeek]?.filter((item) =>
            item.week.includes(date.weekNumber.toString()),
          ) || [];

      setLessons(updatedLessons);
    }
  }, [groupInfo.subgroup, groupInfo.currentGroup, data, date]);

  return <LessonList items={lessons} />;
};
