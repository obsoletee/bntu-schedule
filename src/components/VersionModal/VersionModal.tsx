import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { Modal, Typography } from 'antd';
import { Link } from 'react-router-dom';

import { Version } from '../../model/version';
import { VERSIONS_LIST } from '../../routes/routes';

import style from './VersionModal.module.scss';

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

  const handleOk = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen]);

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen]);

  const changesList = useMemo(() => {
    return data.changes
      .slice(-5)
      .reverse()
      .map((item) => <Text key={item}>- {item}</Text>);
  }, [Text, data.changes]);

  return (
    <Modal
      title={`Подробности версии ${data.title}`}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div className={style.description_container}>{changesList}</div>
      <Link onClick={handleOk} to={VERSIONS_LIST}>
        История обновлений
      </Link>
    </Modal>
  );
};
