import { Dispatch, SetStateAction } from 'react';
import { Modal, Typography } from 'antd';

import { DaySchedule } from '../../model/Schedule';

import style from './LessonModal.module.scss';
import { teacherImages } from '../../assets/images/teacherImages';

interface LessonModalProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  data: DaySchedule;
}

export const LessonModal = ({
  isModalOpen,
  setIsModalOpen,
  data,
}: LessonModalProps) => {
  const { Text } = Typography;
  const avatarKey = data.teacher.avatar as keyof typeof teacherImages;

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <Modal
      title={`${data.subject.fullName} | ${data.type}`}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div className={style.container}>
        <div className={style.description_container}>
          <Text>
            <b>{data.teacher.fullName}</b>
          </Text>
          <Text>{`Время: ${data.startTime} - ${data.endTime}`}</Text>
          {data.class && data.korpus ? (
            <Text>{`Аудитория: ${data.class}-${data.korpus}к`}</Text>
          ) : (
            <></>
          )}
          <Text>
            Недели:{' '}
            {data.week.length > 0 ? (
              <>
                {data.week.slice(0, -1).join(', ')}
                {data.week.length > 1
                  ? `, ${data.week[data.week.length - 1]}`
                  : `${data.week[0]}`}
              </>
            ) : (
              'Нет данных.'
            )}
          </Text>
          {data.subgroup != '0' ? (
            <Text type="danger">{`Подгруппа ${data.subgroup}`}</Text>
          ) : (
            <></>
          )}
        </div>
        <div className={style.photo_wrapper}>
          <img src={teacherImages[avatarKey]} alt={data.teacher.fullName} />
        </div>
      </div>
    </Modal>
  );
};
