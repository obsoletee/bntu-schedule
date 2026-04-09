import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom'; // добавляем
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
  const location = useLocation(); // получаем текущий путь
  const currentPath = useMemo(() => location.pathname, [location.pathname]);

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

  // currentEntity теперь определяется на основе location.pathname
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
    // ... (без изменений, всё остальное остаётся)
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
    // ... (без изменений)
  , [currentSubject, currentTeacher, dispatch]);

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
            // ... (без изменений)
          ) : currentEntity.value === 'subject' ? (
            // ... (без изменений)
          ) : (
            <></>
          )}
        </div>
      </div>
    </Modal>
  );
};
