import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { Input, Modal, Space, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { editTeacher } from '../../store/teachersReducer';
import { editSubject } from '../../store/subjectsReducer';

import { API } from '../../model/apiConst';
import { State } from '../../store';
import {
  clearCurrentSubject,
  setCurrentSubject,
} from '../../store/currentSubjectReducer';
import {
  clearCurrentTeacher,
  setCurrentTeacher,
} from '../../store/currentTeacherReducer';

import style from './EditItemModal.module.scss';

interface EditItemModalProps {
  isEditItemModalOpen: boolean;
  setIsEditItemModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const EditItemModal = ({
  isEditItemModalOpen,
  setIsEditItemModalOpen,
}: EditItemModalProps) => {
  const dispatch = useDispatch();

  const { Text } = Typography;

  const currentPath = useMemo(() => {
    return window.location.pathname;
  }, []);

  const { currentSubject } = useSelector(
    (state: State) => state.currentSubject,
  );
  const { currentTeacher } = useSelector(
    (state: State) => state.currentTeacher,
  );

  const currentEntity: {
    value: 'subject' | 'teacher' | 'empty';
    fullNamePlaceholder: string;
    shortNamePlaceholder: string;
    avatarPlaceholder: string;
  } = useMemo(() => {
    if (currentPath === '/subjects') {
      return {
        value: 'subject',
        fullNamePlaceholder: 'Полное название',
        shortNamePlaceholder: 'Сокращенное название',
        avatarPlaceholder: '',
      };
    }
    if (currentPath === '/teachers') {
      return {
        value: 'teacher',
        fullNamePlaceholder: 'ФИО',
        shortNamePlaceholder: 'Фамилия и инициалы',
        avatarPlaceholder: 'Фамилия латиницей',
      };
    }
    return {
      value: 'empty',
      fullNamePlaceholder: '',
      shortNamePlaceholder: '',
      avatarPlaceholder: '',
    };
  }, [currentPath]);

  const handleOk = useCallback(async () => {
    try {
      switch (currentEntity.value) {
        case 'subject': {
          setIsEditItemModalOpen(false);
          if (currentSubject.fullName && currentSubject.shortName) {
            const response = await fetch(
              `${API.url}/subjects/${currentSubject._id}`,
              {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  _id: currentSubject._id,
                  fullName: currentSubject.fullName.trim(),
                  shortName: currentSubject.shortName.trim(),
                }),
              },
            );
            if (response.ok) {
              const updatedSubject = await response.json();
              dispatch(editSubject(updatedSubject));
              clearCurrentSubject();
            }
          }
          break;
        }

        case 'teacher': {
          if (
            currentTeacher.fullName &&
            currentTeacher.shortName &&
            currentTeacher.avatar
          ) {
            setIsEditItemModalOpen(false);
            const response = await fetch(
              `${API.url}/teachers/${currentTeacher._id}`,
              {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  _id: currentTeacher._id,
                  fullName: currentTeacher.fullName.trim(),
                  shortName: currentTeacher.shortName.trim(),
                  avatar: currentTeacher.avatar.trim(),
                }),
              },
            );
            if (response.ok) {
              const updatedTeacher = await response.json();
              dispatch(editTeacher(updatedTeacher));
              clearCurrentTeacher();
            }
          }
          break;
        }
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  }, [
    setIsEditItemModalOpen,
    currentEntity,
    currentSubject,
    currentTeacher,
    dispatch,
  ]);

  const handleChange = useCallback(
    (entityType: string, field: string, value: string) => {
      switch (entityType) {
        case 'subject': {
          dispatch(setCurrentSubject({ ...currentSubject, [field]: value }));
          break;
        }
        case 'teacher': {
          dispatch(setCurrentTeacher({ ...currentTeacher, [field]: value }));
          break;
        }
      }
    },
    [currentSubject, currentTeacher, dispatch],
  );

  const handleCancel = useCallback(() => {
    setIsEditItemModalOpen(false);
  }, [setIsEditItemModalOpen]);

  return (
    <Modal
      title={
        <Space direction="vertical">
          <Text strong type="warning">
            {`Редактирование элемента`}
          </Text>
        </Space>
      }
      open={isEditItemModalOpen}
      onOk={handleOk}
      okText="Подтвердить"
      onCancel={handleCancel}
      cancelText="Отмена"
    >
      <div className={style.container}>
        <div className={style.description_container}>
          {currentEntity.value === 'teacher' ? (
            <Space direction="vertical">
              <Input
                value={currentTeacher.fullName}
                placeholder={currentEntity.fullNamePlaceholder}
                onChange={(e) => {
                  handleChange(currentEntity.value, 'fullName', e.target.value);
                }}
              />
              <Input
                value={currentTeacher.shortName}
                placeholder={currentEntity.shortNamePlaceholder}
                onChange={(e) => {
                  handleChange(
                    currentEntity.value,
                    'shortName',
                    e.target.value,
                  );
                }}
              />
              <Input
                value={currentTeacher.avatar}
                placeholder={currentEntity.avatarPlaceholder}
                onChange={(e) => {
                  handleChange(currentEntity.value, 'avatar', e.target.value);
                }}
              />
            </Space>
          ) : currentEntity.value === 'subject' ? (
            <Space direction="vertical">
              <Input
                value={currentSubject.fullName}
                placeholder={currentEntity.fullNamePlaceholder}
                onChange={(e) => {
                  handleChange(currentEntity.value, 'fullName', e.target.value);
                }}
              />
              <Input
                value={currentSubject.shortName}
                placeholder={currentEntity.shortNamePlaceholder}
                onChange={(e) => {
                  handleChange(
                    currentEntity.value,
                    'shortName',
                    e.target.value,
                  );
                }}
              />
            </Space>
          ) : (
            <></>
          )}
        </div>
      </div>
    </Modal>
  );
};
