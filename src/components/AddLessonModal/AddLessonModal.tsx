import { Dispatch, SetStateAction, useEffect } from 'react';
import {
  Checkbox,
  Input,
  Modal,
  Radio,
  Select,
  Space,
  TimePicker,
  Typography,
} from 'antd';

import style from './AddLessonModal.module.scss';
import { useSelector } from 'react-redux';
import { State } from '../../store';
import { useDispatch } from 'react-redux';
import {
  setSubjects,
  setSubjectsLoading,
  Subject,
} from '../../store/subjectsReducer';
import {
  setTeachers,
  setTeachersLoading,
  Teacher,
} from '../../store/teachersReducer';

interface AddLessonModalProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const AddLessonModal = ({
  isAddModalOpen,
  setIsAddModalOpen,
}: AddLessonModalProps) => {
  const groupInfo = useSelector((state: State) => state.currentGroup);

  const { Text } = Typography;
  const format = 'HH:mm';

  const selectOptions = [
    {
      value: 'Лекция',
      label: 'Лекция',
    },
    {
      value: 'Практика',
      label: 'Практика',
    },
    {
      value: 'Лаба',
      label: 'Лаба',
    },
  ];

  const dispatch = useDispatch();

  const { subjectList, isSubjectsLoading } = useSelector(
    (state: State) => state.subjects,
  );
  const { teacherList, isTeachersLoading } = useSelector(
    (state: State) => state.teachers,
  );

  useEffect(() => {
    const fetchSubjects = async () => {
      dispatch(setSubjectsLoading(true));
      try {
        const response = await fetch(`http://localhost:8000/subjects/`);

        if (!response.ok) {
          throw new Error('Ошибка при получении данных');
        }
        const result: Subject[] = await response.json();
        dispatch(setSubjects(result));
      } catch (error) {
        console.error('Ошибка:', error);
      } finally {
        dispatch(setSubjectsLoading(false));
      }
    };

    const fetchTeachers = async () => {
      dispatch(setTeachersLoading(true));
      try {
        const response = await fetch(`http://localhost:8000/teachers/`);

        if (!response.ok) {
          throw new Error('Ошибка при получении данных');
        }
        const result: Teacher[] = await response.json();
        dispatch(setTeachers(result));
      } catch (error) {
        console.error('Ошибка:', error);
      } finally {
        dispatch(setTeachersLoading(false));
      }
    };

    fetchSubjects();
    fetchTeachers();
  }, [groupInfo, dispatch]);

  const handleOk = () => {
    setIsAddModalOpen(false);
  };

  const handleCancel = () => {
    setIsAddModalOpen(false);
  };

  return (
    <Modal
      title={
        <Space direction="vertical">
          <Text strong type="success">
            Добавление занятия
          </Text>
        </Space>
      }
      open={isAddModalOpen}
      onOk={handleOk}
      okText="Добавить"
      onCancel={handleCancel}
      cancelText="Отмена"
    >
      <div className={style.container}>
        <div className={style.description_container}>
          <Select
            loading={isSubjectsLoading}
            showSearch
            placeholder="Выберите предмет"
            optionFilterProp="label"
            options={subjectList.map((subject) => {
              return { ...subject, label: subject.fullName };
            })}
          />
          <Select
            showSearch
            placeholder="Выберите тип занятия"
            optionFilterProp="label"
            options={selectOptions}
          />
          <Select
            loading={isTeachersLoading}
            showSearch
            placeholder="Выберите преподавателя"
            optionFilterProp="label"
            options={teacherList.map((teacher) => {
              return { ...teacher, label: teacher.fullName };
            })}
          />
          <Text>Время занятия:</Text>
          <TimePicker.RangePicker format={format} />
          <Input addonBefore={`Аудитория:`} />
          <Input addonBefore={`Корпус:`} />
          <Checkbox.Group
            options={
              groupInfo.university === 'bsuir'
                ? ['Неделя 1', 'Неделя 2', 'Неделя 3', 'Неделя 4']
                : ['Неделя 1', 'Неделя 2']
            }
          ></Checkbox.Group>

          <Radio.Group>
            <Radio.Button value="0">Общая</Radio.Button>
            <Radio.Button value="1">Подгруппа 1</Radio.Button>
            <Radio.Button value="2">Подгруппа 2</Radio.Button>
          </Radio.Group>
        </div>
      </div>
    </Modal>
  );
};
