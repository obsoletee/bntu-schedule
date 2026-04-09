import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../store';
import { API } from '../../model/apiConst';
import { useDispatch } from 'react-redux';
import {
  clearCurrentSubject,
  setCurrentSubject,
} from '../../store/currentSubjectReducer';
import { Input, message, Modal, Select, Space, Typography, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';

import style from './AddItemModal.module.scss';
import {
  clearCurrentTeacher,
  setCurrentTeacher,
} from '../../store/currentTeacherReducer';
import { setSubjects, setSubjectsLoading } from '../../store/subjectsReducer';
import { setTeachers, setTeachersLoading } from '../../store/teachersReducer';
import { SUBJECTS_PAGE, TEACHERS_PAGE } from '../../routes';

interface AddItemModalProps {
  isAddItemModalOpen: boolean;
  setIsAddItemModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const AddItemModal = ({
  isAddItemModalOpen,
  setIsAddItemModalOpen,
}: AddItemModalProps) => {
  const { Text } = Typography;
  const dispatch = useDispatch();

  const currentPath = useMemo(() => window.location.pathname, []);

  const [messageApi, contextHolder] = message.useMessage();

  const { teacherList } = useSelector((state: State) => state.teachers);
  const { subjectList } = useSelector((state: State) => state.subjects);

  const { currentSubject } = useSelector((state: State) => state.currentSubject);
  const { currentTeacher } = useSelector((state: State) => state.currentTeacher);

  // Локальное состояние для файла аватара и превью
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadFileList, setUploadFileList] = useState<UploadFile[]>([]);

  const fetchTeachers = useCallback(async () => {
    dispatch(setTeachersLoading(true));
    try {
      const response = await fetch(`${API.url}/teachers/`);
      const data = await response.json();
      dispatch(setTeachers(data));
    } finally {
      dispatch(setTeachersLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const fetchSubjects = useCallback(async () => {
    dispatch(setSubjectsLoading(true));
    try {
      const response = await fetch(`${API.url}/subjects/`);
      const data = await response.json();
      dispatch(setSubjects(data));
    } finally {
      dispatch(setSubjectsLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  // Очистка локального состояния файла при закрытии модалки
  const resetAvatarState = () => {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(null);
    setAvatarPreview(null);
    setUploadFileList([]);
  };

  // Обработчик загрузки файла
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

  // ⬇️ currentEntity объявляем ЗДЕСЬ, перед handleOk
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
          if (
            subjectList.filter(
              (subject) =>
                subject.fullName.toLowerCase().trim() ===
                currentSubject.fullName.toLowerCase().trim(),
            ).length !== 0
          ) {
            messageApi.open({
              type: 'warning',
              content: 'Этот предмет уже добавлен',
            });
            break;
          }

          if (currentSubject.fullName && currentSubject.shortName) {
            setIsAddItemModalOpen(false);
            const response = await fetch(`${API.url}/subjects`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fullName: currentSubject.fullName.trim(),
                shortName: currentSubject.shortName.trim(),
              }),
            });
            if (response.ok) {
              dispatch(clearCurrentSubject());
              fetchSubjects();
              messageApi.open({
                type: 'success',
                content: 'Предмет успешно добавлен',
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
          // Проверка дубликатов по ФИО (игнорируем старое поле avatar)
          if (
            teacherList.filter(
              (teacher) =>
                teacher.fullName.toLowerCase().trim() ===
                currentTeacher.fullName.toLowerCase().trim(),
            ).length !== 0
          ) {
            messageApi.open({
              type: 'warning',
              content: 'Этот преподаватель уже добавлен',
            });
            break;
          }
          if (currentTeacher.fullName && currentTeacher.shortName) {
            setIsAddItemModalOpen(false);

            // Формируем FormData
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

            const response = await fetch(`${API.url}/teachers`, {
              method: 'POST',
              body: formData, // Не ставим Content-Type, браузер сам установит boundary
            });

            if (response.ok) {
              dispatch(clearCurrentTeacher());
              resetAvatarState();
              fetchTeachers();
              messageApi.open({
                type: 'success',
                content: 'Преподаватель успешно добавлен',
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
              content: 'Пожалуйста, заполните все поля',
            });
            break;
          }
          break;
        }
      }
    } catch (error) {
      console.error('Ошибка:', error);
      messageApi.open({
        type: 'error',
        content: 'Произошла ошибка при добавлении',
      });
    }
  }, [
    messageApi,
    subjectList,
    teacherList,
    currentEntity,
    currentSubject,
    currentTeacher,
    avatarFile,
    setIsAddItemModalOpen,
    fetchSubjects,
    fetchTeachers,
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
    setIsAddItemModalOpen(false);
  }, [setIsAddItemModalOpen, resetAvatarState]);

  return (
    <Modal
      title={
        <Space direction="vertical">
          <Text strong type="success">
            {`Добавление элемента`}
          </Text>
        </Space>
      }
      open={isAddItemModalOpen}
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
                placeholder={currentEntity.universityPlaceholder}
                onChange={(value) => {
                  handleChange(currentEntity.value, 'university', value);
                }}
                options={[
                  { value: 'БНТУ', label: 'БНТУ' },
                  { value: 'БГУИР', label: 'БГУИР' },
                ]}
              />
              {/* Поле загрузки аватара */}
              <Upload
                listType="picture"
                maxCount={1}
                beforeUpload={() => false} // отключаем автоматическую загрузку
                fileList={uploadFileList}
                onChange={handleUploadChange}
                onRemove={() => resetAvatarState()}
              >
                <Button icon={<UploadOutlined />}>Загрузить аватар</Button>
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
