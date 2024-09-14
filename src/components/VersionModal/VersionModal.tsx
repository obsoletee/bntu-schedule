import { Dispatch, SetStateAction } from 'react';
import { Modal, Typography } from 'antd';

import style from './VersionModal.module.scss';
import { Version, version102 } from '../../model/version';

interface VersionModalProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  data: Version;
}

export const VersionModal = ({
  isModalOpen,
  setIsModalOpen,
  data,
}: VersionModalProps) => {
  const { Text } = Typography;

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      title={`Подробности версии ${version102.title}`}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div className={style.description_container}>
        {data.changes.map((item) => (
          <Text>- {item}</Text>
        ))}
      </div>
    </Modal>
  );
};
