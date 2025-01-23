import { Dispatch, SetStateAction, useEffect, useState } from 'react';
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

interface AddLessonModalProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const AddLessonModal = ({
  isAddModalOpen,
  setIsAddModalOpen,
}: AddLessonModalProps) => {
  const groupInfo = useSelector((state: State) => state.currentGroup);
  const [subjectList, setSubjectList] = useState([]);
  const [teacherList, setTeacherList] = useState([]);
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

  const fetchSubjects = async () => {
    const response = await fetch('http://localhost:8000/subjects/');

    const data = await response.json();
    const formattedSubjects = data.map(
      (subject: { _id: number; shortName: string; fullName: string }) => ({
        value: subject._id,
        label: subject.fullName,
      }),
    );

    setSubjectList(formattedSubjects);
  };

  const fetchTeachers = async () => {
    const response = await fetch('http://localhost:8000/teachers/');
    const data = await response.json();
    const formattedTeachers = data.map(
      (teacher: {
        _id: number;
        shortName: string;
        fullName: string;
        avatar: string;
      }) => ({
        value: teacher._id,
        label: teacher.fullName,
      }),
    );
    setTeacherList(formattedTeachers);
  };

  useEffect(() => {
    fetchSubjects();
    fetchTeachers();
  }, []);

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
          <Text strong type="warning">
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
            showSearch
            placeholder="Выберите предмет"
            optionFilterProp="label"
            options={subjectList}
          />
          <Select
            showSearch
            placeholder="Выберите тип занятия"
            optionFilterProp="label"
            options={selectOptions}
          />
          <Select
            showSearch
            placeholder="Выберите преподавателя"
            optionFilterProp="label"
            options={teacherList}
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
