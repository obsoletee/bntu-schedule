import { Dispatch, SetStateAction } from 'react';
import { Modal, Typography } from 'antd';

import style from './VersionModal.module.scss';
import { Version } from '../../model/version';
import { VERSIONS_LIST } from '../../routes/routes';
import { Link } from 'react-router-dom';

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
      title={`Подробности версии ${data.title}`}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div className={style.description_container}>
        {data.changes
          .slice(-5)
          .reverse()
          .map((item) => (
            <Text key={item}>- {item}</Text>
          ))}
      </div>
      <Link to={VERSIONS_LIST}>История обновлений</Link>
    </Modal>
  );
};
