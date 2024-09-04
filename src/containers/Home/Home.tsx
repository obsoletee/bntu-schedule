import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Header } from '../../components/Header/Header';

import style from './Home.module.scss';
import { Card, Carousel, List, Space } from 'antd';
import { DaySchedule, schedule } from '../../model/schedule';
import { useViewportSize } from '../../hooks/useViewportSize';

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

export const Home = () => {
  const groupNumber = useSelector(
    (state: CurrentGroupNumber) => state.currentGroupNumber,
  );

  const [scheduleList, setScheduleList] = useState<ScheduleList[]>([]);
  const { width } = useViewportSize();

  useEffect(() => {
    const generateSchedule = () => {
      const now = new Date();
      const startDate = new Date(
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
      const currentDate = startDate;

      while (currentDate <= endDate) {
        const dayOfWeekEN = currentDate.toLocaleDateString('en-US', {
          weekday: 'long',
        });
        const dayOfWeekRU = currentDate.toLocaleDateString('ru', {
          weekday: 'long',
        });
        const shortDayOfWeekRU =
          dayOfWeekRU === 'понедельник'
            ? 'Пн'
            : dayOfWeekRU === 'вторник'
            ? 'Вт'
            : dayOfWeekRU === 'среда'
            ? 'Ср'
            : dayOfWeekRU === 'четверг'
            ? 'Чт'
            : dayOfWeekRU === 'пятница'
            ? 'Пт'
            : dayOfWeekRU === 'суббота'
            ? 'Сб'
            : dayOfWeekRU === 'воскресенье'
            ? 'Вс'
            : '';

        const formattedDate = currentDate.toLocaleDateString();
        const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
        const pastDaysOfYear =
          (currentDate.getTime() - startOfYear.getTime()) / 86400000;
        const weekNumber = Math.ceil(
          (pastDaysOfYear + startOfYear.getDay()) / 7,
        );

        const dateList = {
          date: formattedDate,
          dayOfWeekEN,
          dayOfWeekRU,
          shortDayOfWeekRU,
          weekNumber: weekNumber % 2 === 0 ? 1 : 2,
        };

        daysArray.push(dateList);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      setScheduleList(daysArray);
    };

    generateSchedule();
  }, []);

  return (
    <>
      <div className={style.wrapper}>
        <Header />
        <div>
          <div className={style.group_info}>
            {groupNumber ? (
              <div>гр. {groupNumber}</div>
            ) : (
              <div>Выберите группу.</div>
            )}
          </div>
          {groupNumber ? (
            <Carousel draggable>
              {scheduleList.map((date) => (
                <div className={style.card_container}>
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
                          schedule[`group${groupNumber}`][
                            `week${date.weekNumber}`
                          ][`${date.dayOfWeekEN.toLowerCase()}`]
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
                                  <div>{`${item.class}-${item.korpus}к`}</div>
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
          ) : (
            <div>Расписание не найдено...</div>
          )}
        </div>
      </div>
    </>
  );
};
