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
import { Input, message, Modal, Select, Space, Typography } from 'antd';

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

  const currentPath = useMemo(() => {
    return window.location.pathname;
  }, []);

  const [messageApi, contextHolder] = message.useMessage();

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
      const response = await fetch(`${API.localhost}/teachers/`);
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
      const response = await fetch(`${API.localhost}/subjects/`);
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
            const response = await fetch(`${API.localhost}/subjects`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fullName: currentSubject.fullName.trim(),
                shortName: currentSubject.shortName.trim(),
              }),
            });
            if (response.ok) {
              clearCurrentSubject();
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
          if (
            teacherList.filter(
              (teacher) =>
                teacher.fullName.toLowerCase().trim() ===
                  currentTeacher.fullName.toLowerCase().trim() ||
                (currentTeacher.avatar.toLowerCase().trim() ===
                  teacher.avatar.toLowerCase().trim() &&
                  currentTeacher.avatar.toLowerCase().trim() !==
                    'emptyAvatar'.toLowerCase()),
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
            const response = await fetch(`${API.localhost}/teachers`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fullName: currentTeacher.fullName.trim(),
                shortName: currentTeacher.shortName.trim(),
                avatar: currentTeacher.avatar
                  ? currentTeacher.avatar.trim()
                  : 'emptyAvatar',
                degree: currentTeacher.degree,
                university: {
                  code: currentTeacher.university.code,
                  title: currentTeacher.university.title,
                },
              }),
            });
            if (response.ok) {
              clearCurrentTeacher();
              fetchTeachers();
              messageApi.open({
                type: 'success',
                content: 'Преподаватель успешно добавлен',
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
    messageApi,
    subjectList,
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
