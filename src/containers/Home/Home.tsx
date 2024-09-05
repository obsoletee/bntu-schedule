import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Header } from '../../components/Header/Header';
import { Typography } from 'antd';

import style from './Home.module.scss';
import { Card, Carousel, List, Space } from 'antd';
import { DaySchedule, schedule } from '../../model/schedule';
import { useViewportSize } from '../../hooks/useViewportSize';
import { countWeekNumber, getShortDayOfWeek } from '../../utils/common';
import { DialogModal } from '../../components/Modal';
import { State } from '../../store';
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
    (state: State) => state.currentGroup.currentGroup,
  );

  const [scheduleList, setScheduleList] = useState<ScheduleList[]>([]);
  const [lessonsInfo, setLessonsInfo] = useState<DaySchedule>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { width } = useViewportSize();
  const { Text, Title } = Typography;

  const groupSchedule = schedule as ScheduleType;

  const handleOpenModal = useCallback((lessonInfo: DaySchedule) => {
    setIsModalOpen(true);
    setLessonsInfo(lessonInfo);
  }, []);

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

  return (
    <div className={style.wrapper}>
      <Header />
      {lessonsInfo ? (
        <DialogModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          data={lessonsInfo}
        />
      ) : (
        <></>
      )}
      <div className={style.container}>
        {groupNumber ? (
          <>
            <div className={style.title}>
              <Title level={3}>Гр. {groupNumber}</Title>
            </div>
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
                        className={style.list_item}
                        itemLayout="horizontal"
                        dataSource={
                          groupSchedule[`group${groupNumber}`]?.[
                            `week${date.weekNumber}`
                          ]?.[`${date.dayOfWeekEN.toLowerCase()}`] || []
                        }
                        renderItem={(item: DaySchedule) => (
                          <List.Item
                            key={item.id}
                            onClick={() => handleOpenModal(item)}
                          >
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
                        )}
                      />
                    </Card>
                  </Space>
                </div>
              ))}
            </Carousel>
          </>
        ) : (
          <Text type="danger">Сперва выберите группу.</Text>
        )}
      </div>
    </div>
  );
};
