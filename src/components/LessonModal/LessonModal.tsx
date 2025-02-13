import { Modal, Typography, Flex, Image } from 'antd';
import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

import {
  TeacherImageKeys,
  teacherImages,
} from '../../assets/images/teacherImages';
import { State } from '../../store';

import style from './LessonModal.module.scss';
import { useViewportSize } from '../../hooks/useViewportSize';

interface LessonModalProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const LessonModal = ({
  isModalOpen,
  setIsModalOpen,
}: LessonModalProps) => {
  const { Text, Title } = Typography;

  const { width } = useViewportSize();

  const { currentLesson } = useSelector((state: State) => state.currentLesson);
  const avatarKey = useMemo(() => {
    return currentLesson.teacher.avatar.toLowerCase() as TeacherImageKeys;
  }, [currentLesson.teacher.avatar]);

  const handleOk = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen]);

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen]);

  return (
    <Modal
      title={
        <Flex vertical gap={0}>
          <Title level={4}>{`${
            currentLesson ? currentLesson.subject.fullName : ''
          }`}</Title>
          <Text
            lesson-type={currentLesson.type}
            className={style.lessonType}
          >{`${currentLesson ? currentLesson.type : ''}`}</Text>
        </Flex>
      }
      open={isModalOpen}
      onOk={handleOk}
      okText="Ок"
      onCancel={handleCancel}
      cancelText="Назад"
    >
      <div className={style.container}>
        <div className={style.description_container}>
          <Text>
            <b>{currentLesson ? currentLesson.teacher.fullName : ''}</b>
          </Text>
          <Text>{`Время: ${currentLesson ? currentLesson.startTime : ''} - ${
            currentLesson ? currentLesson.endTime : ''
          }`}</Text>
          {currentLesson?.class && currentLesson?.korpus ? (
            <Text>{`Аудитория: ${currentLesson.class}-${currentLesson.korpus}к`}</Text>
          ) : (
            <></>
          )}
          <Text>
            Недели:{' '}
            {currentLesson ? (
              currentLesson.week.length > 0 ? (
                <>
                  {currentLesson!.week.slice(0, -1).join(', ')}
                  {currentLesson!.week.length > 1
                    ? `, ${currentLesson?.week[currentLesson.week.length - 1]}`
                    : `${currentLesson?.week[0]}`}
                </>
              ) : (
                'Нет данных.'
              )
            ) : (
              ''
            )}
          </Text>
          {currentLesson ? (
            currentLesson.subgroup != '0' ? (
              <Text strong>{`Подгруппа ${currentLesson?.subgroup}`}</Text>
            ) : (
              <></>
            )
          ) : (
            ''
          )}
        </div>
        {width > 240 ? (
          <div className={style.photo_wrapper}>
            <Image
              className={style.avatar}
              src={teacherImages[avatarKey]}
              fallback={teacherImages.emptyAvatar}
              placeholder={
                <Image preview={false} src={teacherImages.emptyAvatar} />
              }
            />
          </div>
        ) : (
          <></>
        )}
      </div>
    </Modal>
  );
};
