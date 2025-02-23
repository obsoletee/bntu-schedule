import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { Input, message, Modal, Select, Space, Typography } from 'antd';
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
import { SUBJECTS_PAGE, TEACHERS_PAGE } from '../../routes';

interface EditItemModalProps {
  isEditItemModalOpen: boolean;
  setIsEditItemModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const EditItemModal = ({
  isEditItemModalOpen,
  setIsEditItemModalOpen,
}: EditItemModalProps) => {
  const dispatch = useDispatch();

  const [messageApi, contextHolder] = message.useMessage();
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
    degreePlaceholder: string;
    universityPlaceholder: string;
  } = useMemo(() => {
    if (currentPath === SUBJECTS_PAGE) {
      return {
        value: 'subject',
        fullNamePlaceholder: 'Полное название',
        shortNamePlaceholder: 'Сокращенное название',
        avatarPlaceholder: '',
        degreePlaceholder: '',
        universityPlaceholder: '',
      };
    }
    if (currentPath === TEACHERS_PAGE) {
      return {
        value: 'teacher',
        fullNamePlaceholder: 'ФИО',
        shortNamePlaceholder: 'Фамилия и инициалы',
        avatarPlaceholder: 'Фамилия латиницей',
        degreePlaceholder: 'Ученая степень',
        universityPlaceholder: 'Университет',
      };
    }
    return {
      value: 'empty',
      fullNamePlaceholder: '',
      shortNamePlaceholder: '',
      avatarPlaceholder: '',
      degreePlaceholder: '',
      universityPlaceholder: '',
    };
  }, [currentPath]);

  const handleOk = useCallback(async () => {
    try {
      switch (currentEntity.value) {
        case 'subject': {
          if (currentSubject.fullName && currentSubject.shortName) {
            setIsEditItemModalOpen(false);
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
              messageApi.open({
                type: 'success',
                content: 'Предмет успешно изменен',
              });
            }
          } else {
            messageApi.open({
              type: 'error',
              content: 'Пожалуйста, заполните все поля',
            });
            break;
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
                  degree: currentTeacher.degree,
                  university: {
                    code: currentTeacher.university.code,
                    title: currentTeacher.university.title,
                  },
                }),
              },
            );
            if (response.ok) {
              const updatedTeacher = await response.json();
              dispatch(editTeacher(updatedTeacher));
              clearCurrentTeacher();
              messageApi.open({
                type: 'success',
                content: 'Преподаватель успешно изменен',
              });
            }
          } else {
            messageApi.open({
              type: 'error',
              content: 'Пожалуйста, заполните все поля',
            });
            break;
          }
          break;
        }
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  }, [
    setIsEditItemModalOpen,
    messageApi,
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
          if (field === 'university') {
            dispatch(
              setCurrentTeacher({
                ...currentTeacher,
                university: {
                  code: value === 'БНТУ' ? 'bntu' : 'bsuir',
                  title: value,
                },
              }),
            );
          } else {
            dispatch(setCurrentTeacher({ ...currentTeacher, [field]: value }));
          }
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
      {contextHolder}
      <div className={style.container}>
        <div className={style.description_container}>
          {currentEntity.value === 'teacher' ? (
            <Space direction="vertical" style={{ width: '100%' }}>
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
              <Input
                value={currentTeacher.degree}
                placeholder={currentEntity.degreePlaceholder}
                onChange={(e) => {
                  handleChange(currentEntity.value, 'degree', e.target.value);
                }}
              />
              <Select
                style={{ width: '100%' }}
                value={currentTeacher.university.title}
                placeholder={currentEntity.universityPlaceholder}
                onChange={(value) => {
                  handleChange(currentEntity.value, 'university', value);
                }}
                options={[
                  { value: 'БНТУ', label: 'БНТУ' },
                  { value: 'БГУИР', label: 'БГУИР' },
                ]}
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
