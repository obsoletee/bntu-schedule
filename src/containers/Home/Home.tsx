import { Card, Carousel, Space, Typography } from 'antd';
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { bntuSchedule } from '../../model/bntuSchedule';
import { bsuirSchedule } from '../../model/bsuirSchedule';
import {
  countWeekNumber,
  formatDate,
  getShortDayOfWeek,
} from '../../utils/common';
import { DaySchedule } from '../../model/Schedule';
import { LessonModal } from '../../components/LessonModal';
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
  const groupInfo = useSelector((state: State) => state.currentGroup);

  const [scheduleList, setScheduleList] = useState<ScheduleList[]>([]);
  const [lessonsInfo, setLessonsInfo] = useState<DaySchedule>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { width } = useViewportSize();
  const { Text, Title } = Typography;

  const dispatch = useDispatch();

  const handleOpenModal = useCallback((lessonInfo: DaySchedule) => {
    setIsModalOpen(true);
    setLessonsInfo(lessonInfo);
  }, []);

  const generateSchedule = useCallback(() => {
    const currentDate = new Date();
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      currentDate.getDate(),
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

      const formattedDate = formatDate(currentDate);

      const weekNumber = countWeekNumber(currentDate, groupInfo.university);

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
  }, [groupInfo]);

  useEffect(() => {
    generateSchedule();
  }, [groupInfo, generateSchedule]);

  const handleSubgroupChange = (value: string) => {
    dispatch({
      type: 'CHANGE_SUBGROUP',
      payload: { subgroup: value },
    });
  };

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
                          <Space direction="horizontal">
                            <Text
                              underline
                              onClick={() => handleSubgroupChange('')}
                              type={
                                groupInfo.subgroup === ''
                                  ? `success`
                                  : `secondary`
                              }
                            >
                              Все
                            </Text>
                            <Text
                              underline
                              onClick={() => handleSubgroupChange('1')}
                              type={
                                groupInfo.subgroup === '1'
                                  ? `success`
                                  : `secondary`
                              }
                            >
                              1 подг.
                            </Text>
                            <Text
                              underline
                              onClick={() => handleSubgroupChange('2')}
                              type={
                                groupInfo.subgroup === '2'
                                  ? `success`
                                  : `secondary`
                              }
                            >
                              2 подг.
                            </Text>
                          </Space>
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
