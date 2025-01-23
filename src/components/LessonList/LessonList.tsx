import { List, Typography } from 'antd';

import { DaySchedule } from '../../model/Schedule';

import style from './LessonList.module.scss';
import { icons } from '../../assets/icons';
import { Suspense, useCallback, useState } from 'react';
import { setLesson } from '../../store/currentLessonReducer';
import { useDispatch, useSelector } from 'react-redux';
import LessonModal from '../LessonModal';
import { CustomSpin } from '../CustomSpin/CustomSpin';
import EditLessonModal from '../EditLessonModal';
import { State } from '../../store';

interface LessonListWithDateProps {
  items: DaySchedule[] | undefined;
  iconSize?: 'normal' | 'large' | 'none';
}

export const LessonList = ({
  items,
  iconSize = 'none',
}: LessonListWithDateProps) => {
  const { Text } = Typography;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const dispatch = useDispatch();

  const currentLesson = useSelector(
    (state: State) => state.currentLesson.currentLesson,
  );

  const handleOpenModal = useCallback(
    (lessonInfo: DaySchedule) => {
      setIsModalOpen(true);
      setIsEditModalOpen(false);
      dispatch(setLesson(lessonInfo));
    },
    [dispatch],
  );

  const handleOpenEditModal = useCallback(
    (lessonInfo: DaySchedule) => {
      setIsModalOpen(false);
      setIsEditModalOpen(true);
      dispatch(setLesson(lessonInfo));
    },
    [dispatch],
  );
  return (
    <>
      {currentLesson ? (
        <>
          <Suspense fallback={<CustomSpin />}>
            <LessonModal
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
            />
          </Suspense>
          <Suspense fallback={<CustomSpin />}>
            <EditLessonModal
              isEditModalOpen={isEditModalOpen}
              setIsEditModalOpen={setIsEditModalOpen}
            />
          </Suspense>
        </>
      ) : (
        <></>
      )}

      <List
        className={style.list_item}
        itemLayout="horizontal"
        dataSource={items}
        locale={{ emptyText: `В этот день занятий нет.` }}
        renderItem={(item: DaySchedule) => (
          <List.Item key={item.id} onClick={() => handleOpenModal(item)}>
            <List.Item.Meta
              key={item.id}
              avatar={
                <div className={style.status} lesson-type={item.type}></div>
              }
              title={
                <div className={style.card_title}>
                  <Text>
                    {`${item.startTime}-${item.endTime}: ${item.subject.shortName}`}
                  </Text>
                  {iconSize === 'none' ? (
                    <></>
                  ) : (
                    <img
                      className={style.edit_icon}
                      src={icons.editIcon}
                      icon-size={iconSize}
                      alt="edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditModal(item);
                      }}
                    />
                  )}
                </div>
              }
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
    </>
  );
};
