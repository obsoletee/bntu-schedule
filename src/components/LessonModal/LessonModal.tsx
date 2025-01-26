import { Dispatch, SetStateAction } from 'react';
import { Modal, Typography } from 'antd';

import style from './LessonModal.module.scss';
import { teacherImages } from '../../assets/images/teacherImages';
import { useSelector } from 'react-redux';
import { State } from '../../store';

interface LessonModalProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const LessonModal = ({
  isModalOpen,
  setIsModalOpen,
}: LessonModalProps) => {
  const { Text } = Typography;
  const currentLesson = useSelector(
    (state: State) => state.currentLesson.currentLesson,
  );
  const avatarKey =
    currentLesson?.teacher.avatar.toLowerCase() as keyof typeof teacherImages;

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <Modal
      title={`${currentLesson ? currentLesson.subject.fullName : ''} | ${
        currentLesson ? currentLesson.type : ''
      }`}
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
              <Text type="danger">{`Подгруппа ${currentLesson?.subgroup}`}</Text>
            ) : (
              <></>
            )
          ) : (
            ''
          )}
        </div>
        <div className={style.photo_wrapper}>
          <img
            src={teacherImages[avatarKey]}
            alt={currentLesson ? currentLesson.teacher.fullName : ''}
          />
        </div>
      </div>
    </Modal>
  );
};
