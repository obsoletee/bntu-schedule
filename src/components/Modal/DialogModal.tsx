import { Dispatch, SetStateAction } from 'react';
import { Modal, Typography } from 'antd';

import { DaySchedule } from '../../model/schedule';

import style from './DialogModal.module.scss';

interface DialogModalProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  data: DaySchedule;
}

export const DialogModal = ({
  isModalOpen,
  setIsModalOpen,
  data,
}: DialogModalProps) => {
  const { Text } = Typography;

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      title={`${data.name} | ${data.type}`}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div className={style.description_container}>
        <Text>{data.teacher}</Text>
        <Text>{`Время: ${data.startTime} - ${data.endTime}`}</Text>
        {data.class && data.korpus ? (
          <Text>{`Аудитория: ${data.class}-${data.korpus}к`}</Text>
        ) : (
          <></>
        )}
        {data.subgroup != '0' ? (
          <Text type="danger">{`Подгруппа ${data.subgroup}`}</Text>
        ) : (
          <></>
        )}
      </div>
    </Modal>
  );
};
