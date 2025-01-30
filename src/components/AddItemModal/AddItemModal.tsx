import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../store';
import { API } from '../../model/apiConst';
import { useDispatch } from 'react-redux';
import {
  clearCurrentSubject,
  setCurrentSubject,
} from '../../store/currentSubjectReducer';
import { Input, Modal, Space, Typography } from 'antd';

import style from './AddItemModal.module.scss';
import {
  clearCurrentTeacher,
  setCurrentTeacher,
} from '../../store/currentTeacherReducer';
import { setSubjects, setSubjectsLoading } from '../../store/subjectsReducer';
import { setTeachers, setTeachersLoading } from '../../store/teachersReducer';

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

  const currentPath = useMemo(() => {
    return window.location.pathname;
  }, []);

  const { teacherList } = useSelector((state: State) => state.teachers);
  const { subjectList } = useSelector((state: State) => state.subjects);
  const { currentSubject } = useSelector(
    (state: State) => state.currentSubject,
  );
  const { currentTeacher } = useSelector(
    (state: State) => state.currentTeacher,
  );

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
          if (
            subjectList.filter(
              (subject) =>
                subject.fullName.toLowerCase().trimEnd().trimStart() ===
                currentSubject.fullName.toLowerCase().trimEnd().trimStart(),
            ).length === 0
          ) {
            alert('Этот предмет уже добавлен');
            break;
          }
          if (currentSubject.fullName && currentSubject.shortName) {
            const response = await fetch(`${API.url}/subjects`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fullName: currentSubject.fullName,
                shortName: currentSubject.shortName,
              }),
            });
            if (response.ok) {
              clearCurrentSubject();
              fetchSubjects();
            }
          }
          break;
        }

        case 'teacher': {
          if (
            teacherList.filter(
              (teacher) =>
                teacher.fullName.toLowerCase().trimEnd().trimStart() ===
                currentTeacher.fullName.toLowerCase().trimEnd().trimStart(),
            ).length === 0
          ) {
            alert('Этот преподаватель уже добавлен');
            break;
          }
          if (currentTeacher.fullName && currentTeacher.shortName) {
            const response = await fetch(`${API.url}/teachers`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fullName: currentTeacher.fullName,
                shortName: currentTeacher.shortName,
                avatar: currentTeacher.avatar
                  ? currentTeacher.avatar
                  : 'emptyAvatar',
              }),
            });
            if (response.ok) {
              clearCurrentTeacher();
              fetchTeachers();
            }
          }
          break;
        }
      }
    } catch (error) {
      console.error('Ошибка:', error);
    } finally {
      setIsAddItemModalOpen(false);
    }
  }, [
    teacherList,
    currentEntity,
    currentSubject,
    currentTeacher,
    setIsAddItemModalOpen,
    fetchSubjects,
    fetchTeachers,
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
    setIsAddItemModalOpen(false);
  }, [setIsAddItemModalOpen]);

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
