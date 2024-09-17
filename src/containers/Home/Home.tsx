import { Card, Carousel, Space, Typography } from 'antd';
import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';

import { bntuSchedule } from '../../model/bntuSchedule';
import { bsuirSchedule } from '../../model/bsuirSchedule';
import { getShortDayOfWeek, updateDateTime } from '../../utils/common';
import { DaySchedule } from '../../model/Schedule';
import { LessonModal } from '../../components/LessonModal';
import { LessonList } from '../../components/LessonList';
import { Header } from '../../components/Header/Header';
import { State } from '../../store';
import { useViewportSize } from '../../hooks/useViewportSize';

import style from './Home.module.scss';
import { Filter } from '../../components/Filter';

export interface ScheduleList {
  date: string;
  dayOfWeekEN: string;
  dayOfWeekRU: string;
  shortDayOfWeekRU: string;
  weekNumber: number;
}

export const Home = () => {
  const groupInfo = useSelector((state: State) => state.currentGroup);

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
    const startDate = new Date();
    const endDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      startDate.getDate(),
    );

    const daysArray: ScheduleList[] = [];

    while (startDate <= endDate) {
      const dayOfWeekEN = startDate.toLocaleDateString('en-US', {
        weekday: 'long',
      });
      const dayOfWeekRU = startDate.toLocaleDateString('ru', {
        weekday: 'long',
      });

      const shortDayOfWeekRU = getShortDayOfWeek(dayOfWeekRU);

      const { formattedDate, studyWeekNumber } = updateDateTime(
        groupInfo.university,
        startDate,
      );

      const dateList = {
        date: formattedDate,
        dayOfWeekEN,
        dayOfWeekRU,
        shortDayOfWeekRU,
        weekNumber: studyWeekNumber,
      };

      daysArray.push(dateList);
      startDate.setDate(startDate.getDate() + 1);
    }

    setScheduleList(daysArray);
  }, [groupInfo]);

  useEffect(() => {
    generateSchedule();
  }, [groupInfo, generateSchedule]);

  return (
    <div className={style.wrapper}>
      <Header />
      {lessonsInfo ? (
        <LessonModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          data={lessonsInfo}
        />
      ) : (
        <></>
      )}
      <div className={style.container}>
        {groupInfo ? (
          <>
            <div className={style.title}>
              <Title level={3}>Гр. {groupInfo.currentGroup}</Title>
            </div>
            <Carousel draggable infinite={false} dots={false} speed={200}>
              {scheduleList.map((date) => (
                <div key={date.date} className={style.card_container}>
                  <Space direction="vertical">
                    <Card
                      bordered
                      title={
                        <Space direction="vertical">
                          <div>
                            {width < 250
                              ? `${date.shortDayOfWeekRU}. ${date.date.slice(
                                  0,
                                  5,
                                )} нед. ${date.weekNumber}`
                              : `${date.dayOfWeekRU
                                  .slice(0, 1)
                                  .toUpperCase()}${date.dayOfWeekRU.slice(
                                  1,
                                )} ${date.date.slice(0, 5)} нед. ${
                                  date.weekNumber
                                }`}
                          </div>
                          <Filter />
                        </Space>
                      }
                    >
                      {groupInfo.university === 'bntu' ? (
                        <LessonList
                          data={bntuSchedule}
                          handleOpenModal={handleOpenModal}
                          date={date}
                          currentGroup={groupInfo}
                        />
                      ) : groupInfo.university === 'bsuir' ? (
                        <LessonList
                          data={bsuirSchedule}
                          handleOpenModal={handleOpenModal}
                          date={date}
                          currentGroup={groupInfo}
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
