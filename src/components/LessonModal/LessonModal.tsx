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
  const avatarKey = currentLesson?.teacher.avatar as keyof typeof teacherImages;

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <Modal
      title={`${currentLesson?.subject.fullName} | ${currentLesson?.type}`}
      open={isModalOpen}
      onOk={handleOk}
      okText="Ок"
      onCancel={handleCancel}
      cancelText="Назад"
    >
      <div className={style.container}>
        <div className={style.description_container}>
          <Text>
            <b>{currentLesson?.teacher.fullName}</b>
          </Text>
          <Text>{`Время: ${currentLesson?.startTime} - ${currentLesson?.endTime}`}</Text>
          {currentLesson?.class && currentLesson?.korpus ? (
            <Text>{`Аудитория: ${currentLesson.class}-${currentLesson.korpus}к`}</Text>
          ) : (
            <></>
          )}
          <Text>
            Недели:{' '}
            {currentLesson!.week.length > 0 ? (
              <>
                {currentLesson!.week.slice(0, -1).join(', ')}
                {currentLesson!.week.length > 1
                  ? `, ${currentLesson?.week[currentLesson.week.length - 1]}`
                  : `${currentLesson?.week[0]}`}
              </>
            ) : (
              'Нет данных.'
            )}
          </Text>
          {currentLesson?.subgroup != '0' ? (
            <Text type="danger">{`Подгруппа ${currentLesson?.subgroup}`}</Text>
          ) : (
            <></>
          )}
        </div>
        <div className={style.photo_wrapper}>
          <img
            src={teacherImages[avatarKey]}
            alt={currentLesson?.teacher.fullName}
          />
        </div>
      </div>
    </Modal>
  );
};
