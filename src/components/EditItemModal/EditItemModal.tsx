import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { Input, message, Modal, Select, Space, Typography, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
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

  const currentPath = useMemo(() => window.location.pathname, []);

  const { currentSubject } = useSelector((state: State) => state.currentSubject);
  const { currentTeacher } = useSelector((state: State) => state.currentTeacher);

  // Локальное состояние для файла аватара и превью
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadFileList, setUploadFileList] = useState<UploadFile[]>([]);

  // Загрузка текущей аватарки при открытии модалки
  useEffect(() => {
    if (isEditItemModalOpen && currentTeacher?._id) {
      fetch(`${API.url}/teachers/${currentTeacher._id}/avatar`)
        .then(res => {
          if (res.ok) return res.blob();
          throw new Error('No avatar');
        })
        .then(blob => {
          const url = URL.createObjectURL(blob);
          setAvatarPreview(url);
          setUploadFileList([{
            uid: '-1',
            name: 'avatar.jpg',
            status: 'done',
            url,
          }]);
        })
        .catch(() => {
          setAvatarPreview(null);
          setUploadFileList([]);
        });
    } else {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      setAvatarFile(null);
      setAvatarPreview(null);
      setUploadFileList([]);
    }
  }, [isEditItemModalOpen, currentTeacher]);

  const resetAvatarState = () => {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(null);
    setAvatarPreview(null);
    setUploadFileList([]);
  };

  const handleUploadChange: UploadProps['onChange'] = ({ fileList }) => {
    const file = fileList[0]?.originFileObj;
    if (file) {
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
      setUploadFileList([{ uid: '-1', name: file.name, status: 'done', url: previewUrl }]);
    } else {
      resetAvatarState();
    }
  };

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
        avatarPlaceholder: 'Аватар (изображение)',
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
              dispatch(clearCurrentSubject());
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
          }
          break;
        }

        case 'teacher': {
          if (currentTeacher.fullName && currentTeacher.shortName) {
            setIsEditItemModalOpen(false);

            const formData = new FormData();
            const teacherData = {
              fullName: currentTeacher.fullName.trim(),
              shortName: currentTeacher.shortName.trim(),
              degree: currentTeacher.degree,
              university: {
                code: currentTeacher.university.code,
                title: currentTeacher.university.title,
              },
            };
            formData.append('data', JSON.stringify(teacherData));
            if (avatarFile) {
              formData.append('avatar', avatarFile);
            }

            const response = await fetch(`${API.url}/teachers/${currentTeacher._id}`, {
              method: 'PATCH',
              body: formData,
            });

            if (response.ok) {
              const updatedTeacher = await response.json();
              dispatch(editTeacher(updatedTeacher));
              dispatch(clearCurrentTeacher());
              resetAvatarState();
              messageApi.open({
                type: 'success',
                content: 'Преподаватель успешно изменен',
              });
            } else {
              const errorText = await response.text();
              messageApi.open({
                type: 'error',
                content: `Ошибка: ${errorText}`,
              });
            }
          } else {
            messageApi.open({
              type: 'error',
              content: 'Пожалуйста, заполните все обязательные поля',
            });
          }
          break;
        }
      }
    } catch (error) {
      console.error('Ошибка:', error);
      messageApi.open({
        type: 'error',
        content: 'Произошла ошибка при сохранении',
      });
    }
  }, [
    setIsEditItemModalOpen,
    messageApi,
    currentEntity,
    currentSubject,
    currentTeacher,
    avatarFile,
    dispatch,
    resetAvatarState,
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
    resetAvatarState();
    setIsEditItemModalOpen(false);
  }, [setIsEditItemModalOpen, resetAvatarState]);

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
                  handleChange(currentEntity.value, 'shortName', e.target.value);
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
                value={currentTeacher.university?.title}
                placeholder={currentEntity.universityPlaceholder}
                onChange={(value) => {
                  handleChange(currentEntity.value, 'university', value);
                }}
                options={[
                  { value: 'БНТУ', label: 'БНТУ' },
                  { value: 'БГУИР', label: 'БГУИР' },
                ]}
              />
              <Upload
                listType="picture"
                maxCount={1}
                beforeUpload={() => false}
                fileList={uploadFileList}
                onChange={handleUploadChange}
                onRemove={() => resetAvatarState()}
              >
                <Button icon={<UploadOutlined />}>Загрузить новый аватар</Button>
              </Upload>
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
                  handleChange(currentEntity.value, 'shortName', e.target.value);
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
