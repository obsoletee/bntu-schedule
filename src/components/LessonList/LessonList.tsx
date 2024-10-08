import { List, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { DaySchedule, GroupSchedule } from '../../model/Schedule';
import { State } from '../../store';

import style from './LessonList.module.scss';

interface ScheduleList {
  date: string;
  dayOfWeekEN: string;
  dayOfWeekRU: string;
  shortDayOfWeekRU: string;
  weekNumber: number;
}
interface LessonListProps {
  data: GroupSchedule | undefined;
  date: ScheduleList;
  handleOpenModal: (lessonInfo: DaySchedule) => void;
}

type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

export const LessonList = ({
  data,
  date,
  handleOpenModal,
}: LessonListProps) => {
  const { Text } = Typography;

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

  return (
    <List
      className={style.list_item}
      itemLayout="horizontal"
      dataSource={lessons}
      locale={{ emptyText: `В этот день занятий нет.` }}
      renderItem={(item: DaySchedule) => (
        <List.Item key={item.id} onClick={() => handleOpenModal(item)}>
          <List.Item.Meta
            key={item.id}
            avatar={
              <div className={style.status} lesson-type={item.type}></div>
            }
            title={`${item.startTime}-${item.endTime}: ${item.subject.shortName}`}
            description={
              <div className={style.list_description}>
                {item.class && item.korpus ? (
                  <Text type="secondary">{`${item.class}-${item.korpus}к`}</Text>
                ) : (
                  <></>
                )}
                <Text type="secondary">
                  {item.subgroup != '0'
                    ? `${item.teacher.shortName} (подгр. ${item.subgroup})`
                    : `${item.teacher.shortName}`}
                </Text>
              </div>
            }
          />
        </List.Item>
      )}
    />
  );
};
