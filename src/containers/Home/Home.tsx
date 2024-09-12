import { Card, Carousel, Space, Typography } from 'antd';
import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';

import { bntuSchedule } from '../../model/bntuSchedule';
import { bsuirSchedule } from '../../model/bsuirSchedule';
import { countWeekNumber, getShortDayOfWeek } from '../../utils/common';
import { DaySchedule } from '../../model/Schedule';
import { DialogModal } from '../../components/Modal';
import { LessonList } from '../../components/LessonList';
import { Header } from '../../components/Header/Header';
import { State } from '../../store';
import { useViewportSize } from '../../hooks/useViewportSize';

import style from './Home.module.scss';

export interface ScheduleList {
  date: string;
  dayOfWeekEN: string;
  dayOfWeekRU: string;
  shortDayOfWeekRU: string;
  weekNumber: number;
}

export const Home = () => {
  const currentGroup = useSelector((state: State) => state.currentGroup);

  const [scheduleList, setScheduleList] = useState<ScheduleList[]>([]);
  const [lessonsInfo, setLessonsInfo] = useState<DaySchedule>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { width } = useViewportSize();
  const { Text, Title } = Typography;

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
      const weekNumber = countWeekNumber(currentDate, currentGroup.university);

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
  }, [currentGroup]);

  useEffect(() => {
    generateSchedule();
  }, [currentGroup, generateSchedule]);

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
        {currentGroup ? (
          <>
            <div className={style.title}>
              <Title level={3}>Гр. {currentGroup.currentGroup}</Title>
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
                      {currentGroup.university === 'bntu' ? (
                        <LessonList
                          data={bntuSchedule}
                          handleOpenModal={handleOpenModal}
                          date={date}
                          currentGroup={currentGroup}
                        />
                      ) : currentGroup.university === 'bsuir' ? (
                        <LessonList
                          data={bsuirSchedule}
                          handleOpenModal={handleOpenModal}
                          date={date}
                          currentGroup={currentGroup}
                        />
                      ) : (
                        <></>
                      )}
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
