import { List, Typography } from 'antd';

import style from './LessonList.module.scss';
import { CurrentGroupState } from '../../store';
import { ScheduleList } from '../../containers/Home/Home';
import { DaySchedule, Schedule } from '../../model/Schedule';

interface LessonListProps {
  data: Schedule;
  currentGroup: CurrentGroupState;
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
  currentGroup,
  date,
  handleOpenModal,
}: LessonListProps) => {
  const { Text } = Typography;
  return (
    <List
      className={style.list_item}
      itemLayout="horizontal"
      dataSource={
        data[`group${currentGroup.currentGroup}`][
          date.dayOfWeekEN.toLowerCase() as DayOfWeek
        ]
      }
      renderItem={(item: DaySchedule) =>
        item.week.includes(date.weekNumber.toString()) ? (
          <List.Item key={item.id} onClick={() => handleOpenModal(item)}>
            <List.Item.Meta
              key={item.id}
              avatar={
                <div className={style.status} lesson-type={item.type}></div>
              }
              title={`${item.startTime}-${item.endTime}: ${item.shortName}`}
              description={
                <div className={style.list_description}>
                  {item.class && item.korpus ? (
                    <Text type="secondary">{`${item.class}-${item.korpus}к`}</Text>
                  ) : (
                    <></>
                  )}
                  <Text type="secondary">
                    {item.subgroup != '0'
                      ? `${item.teacher} (подгр. ${item.subgroup})`
                      : `${item.teacher}`}
                  </Text>
                </div>
              }
            />
          </List.Item>
        ) : (
          <></>
        )
      }
    />
  );
};
