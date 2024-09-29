import { Card, Carousel, Space, Typography } from 'antd';
import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';

import { CustomSpin } from '../../components/CustomSpin/CustomSpin';
const Header = lazy(() => import('../../components/Header'));
const Filter = lazy(() => import('../../components/Filter'));
const LessonList = lazy(() => import('../../components/LessonList'));
const LessonModal = lazy(() => import('../../components/LessonModal'));

import { bntuSchedule } from '../../model/bntuSchedule';
import { bsuirSchedule } from '../../model/bsuirSchedule';
import { DaySchedule } from '../../model/Schedule';
import { getShortDayOfWeek, updateDateTime } from '../../utils/common';
import { State } from '../../store';
import { useViewportSize } from '../../hooks/useViewportSize';

import style from './Home.module.scss';

interface ScheduleList {
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
      <Suspense fallback={<CustomSpin />}>
        <Header />
      </Suspense>
      {lessonsInfo ? (
        <Suspense fallback={<CustomSpin />}>
          <LessonModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            data={lessonsInfo}
          />
        </Suspense>
      ) : (
        <></>
      )}
      <div className={style.container}>
        {groupInfo ? (
          <>
            <div className={style.title}>
              <Title level={3}>Гр. {groupInfo.currentGroup}</Title>
            </div>
            <Carousel draggable infinite={false} dots={false} speed={250}>
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
                          <Suspense fallback={<CustomSpin />}>
                            <Filter />
                          </Suspense>
                        </Space>
                      }
                    >
                      {groupInfo.university === '' ? (
                        <></>
                      ) : (
                        <Suspense fallback={<CustomSpin />}>
                          <LessonList
                            data={
                              groupInfo.university === 'bntu'
                                ? bntuSchedule
                                : groupInfo.university === 'bsuir'
                                ? bsuirSchedule
                                : bntuSchedule
                            }
                            handleOpenModal={handleOpenModal}
                            date={date}
                          />
                        </Suspense>
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
