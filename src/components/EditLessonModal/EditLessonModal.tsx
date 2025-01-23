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
import dayjs from 'dayjs';

import style from './EditLessonModal.module.scss';
import { useSelector } from 'react-redux';
import { State } from '../../store';

interface EditLessonModalProps {
  isEditModalOpen: boolean;
  setIsEditModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const EditLessonModal = ({
  isEditModalOpen,
  setIsEditModalOpen,
}: EditLessonModalProps) => {
  const groupInfo = useSelector((state: State) => state.currentGroup);
  const [subjectList, setSubjectList] = useState([]);
  const [teacherList, setTeacherList] = useState([]);
  const { Text } = Typography;
  const format = 'HH:mm';

  const currentLesson = useSelector(
    (state: State) => state.currentLesson.currentLesson,
  );

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
    const response = await fetch(
      'https://long-edy-obsoletee-6b4c05a7.koyeb.app/subjects/',
    );

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
    const response = await fetch(
      'https://long-edy-obsoletee-6b4c05a7.koyeb.app/teachers/',
    );
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
    setIsEditModalOpen(false);
  };

  const handleCancel = () => {
    setIsEditModalOpen(false);
  };

  return (
    <Modal
      title={
        <Space direction="vertical">
          <Text type="danger">Редактирование занятия</Text>
        </Space>
      }
      open={isEditModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div className={style.container}>
        <div className={style.description_container}>
          <Select
            showSearch
            placeholder="Выберите предмет"
            optionFilterProp="label"
            options={subjectList}
            value={currentLesson?.subject.fullName}
          />
          <Select
            showSearch
            placeholder="Выберите тип занятия"
            optionFilterProp="label"
            options={selectOptions}
            value={currentLesson?.type}
          />
          <Select
            showSearch
            placeholder="Выберите преподавателя"
            optionFilterProp="label"
            options={teacherList}
            value={currentLesson?.teacher.fullName}
          />
          <Text>Время занятия:</Text>
          <TimePicker.RangePicker
            value={[
              dayjs(currentLesson?.startTime, format),
              dayjs(currentLesson?.endTime, format),
            ]}
            format={format}
          />
          <Input value={currentLesson?.class} addonBefore={`Аудитория:`} />
          <Input
            value={Number(currentLesson?.korpus)}
            addonBefore={`Корпус:`}
          />
          <Checkbox.Group
            options={
              groupInfo.university === 'bsuir'
                ? ['Неделя 1', 'Неделя 2', 'Неделя 3', 'Неделя 4']
                : ['Неделя 1', 'Неделя 2']
            }
            value={currentLesson?.week.map((weekNumber) => {
              return `Неделя ${weekNumber}`;
            })}
          ></Checkbox.Group>

          <Radio.Group value={currentLesson?.subgroup}>
            <Radio.Button value="0">Общая</Radio.Button>
            <Radio.Button value="1">Подгруппа 1</Radio.Button>
            <Radio.Button value="2">Подгруппа 2</Radio.Button>
          </Radio.Group>
        </div>
      </div>
    </Modal>
  );
};
