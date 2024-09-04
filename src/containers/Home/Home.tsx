import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Header } from '../../components/Header/Header';

import style from './Home.module.scss';
import { Card, Carousel, List, Space } from 'antd';
import { DaySchedule, schedule } from '../../model/schedule';
import { useViewportSize } from '../../hooks/useViewportSize';
import { countWeekNumber, getShortDayOfWeek } from '../../utils/common';

interface CurrentGroupNumber {
  currentGroupNumber: string;
}

interface ScheduleList {
  date: string;
  dayOfWeekEN: string;
  dayOfWeekRU: string;
  shortDayOfWeekRU: string;
  weekNumber: number;
}

interface ScheduleType {
  [key: string]: {
    [week: string]: {
      [day: string]: DaySchedule[];
    };
  };
}

export const Home = () => {
  const groupNumber = useSelector(
    (state: CurrentGroupNumber) => state.currentGroupNumber,
  );

  const [scheduleList, setScheduleList] = useState<ScheduleList[]>([]);
  const { width } = useViewportSize();

  const generateSchedule = useCallback(() => {
    const now = new Date();
    const currentDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const endDate = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      now.getDate(),
    );

    const daysArray: ScheduleList[] = [];

    while (currentDate <= endDate) {
      const dayOfWeekEN = currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
      });
      const dayOfWeekRU = currentDate.toLocaleDateString('ru', {
        weekday: 'long',
      });

      const shortDayOfWeekRU = getShortDayOfWeek(dayOfWeekRU);

      const formattedDate = currentDate.toLocaleDateString();
      const weekNumber = countWeekNumber(currentDate);

      const dateList = {
        date: formattedDate,
        dayOfWeekEN,
        dayOfWeekRU,
        shortDayOfWeekRU,
        weekNumber,
      };

      daysArray.push(dateList);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setScheduleList(daysArray);
  }, []);

  useEffect(() => {
    generateSchedule();
  }, [generateSchedule]);

  const groupSchedule = schedule as ScheduleType;

  return (
    <div className={style.wrapper}>
      <Header />
      <div>
        {groupNumber ? (
          <div>
            <div className={style.group_info}>гр. {groupNumber}</div>
            <Carousel draggable infinite={false}>
              {scheduleList.map((date) => (
                <div key={date.date} className={style.card_container}>
                  <Space direction="vertical">
                    <Card
                      bordered
                      title={
                        width < 250
                          ? `${date.shortDayOfWeekRU}. ${date.date.slice(
                              0,
                              5,
                            )} нед. ${date.weekNumber}`
                          : `${date.dayOfWeekRU
                              .slice(0, 1)
                              .toUpperCase()}${date.dayOfWeekRU.slice(
                              1,
                            )} ${date.date.slice(0, 5)} нед. ${date.weekNumber}`
                      }
                    >
                      <List
                        itemLayout="horizontal"
                        dataSource={
                          groupSchedule[`group${groupNumber}`]?.[
                            `week${date.weekNumber}`
                          ]?.[`${date.dayOfWeekEN.toLowerCase()}`] || []
                        }
                        renderItem={(item: DaySchedule) => (
                          <List.Item key={item.id}>
                            <List.Item.Meta
                              key={item.id}
                              avatar={
                                <div
                                  className={style.status}
                                  lesson-type={item.type}
                                ></div>
                              }
                              title={`${item.startTime}-${item.endTime}: ${item.shortName}`}
                              description={
                                <div>
                                  {item.class && item.korpus ? (
                                    <div>{`${item.class}-${item.korpus}к`}</div>
                                  ) : (
                                    <></>
                                  )}
                                  <div>
                                    {item.subgroup != '0'
                                      ? `${item.teacher} (подгр. ${item.subgroup})`
                                      : `${item.teacher}`}
                                  </div>
                                </div>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    </Card>
                  </Space>
                </div>
              ))}
            </Carousel>
          </div>
        ) : (
          <div>Выберите группу.</div>
        )}
      </div>
    </div>
  );
};
