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
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
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
import { setSchedule, setScheduleLoading } from '../../store/scheduleReducer';
import { GroupSchedule } from '../../model/Schedule';

interface AddLessonModalProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const AddLessonModal = ({
  isAddModalOpen,
  setIsAddModalOpen,
}: AddLessonModalProps) => {
  const groupInfo = useSelector((state: State) => state.currentGroup);

  const [formData, setFormData] = useState({
    subject: {
      shortName: '',
      fullName: '',
    },
    teacher: {
      shortName: '',
      fullName: '',
      avatar: '',
    },
    startTime: '',
    endTime: '',
    type: '',
    class: '',
    korpus: '',
    subgroup: '0',
    week: [1],
  });
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

  // const { schedule, isScheduleLoading } = useSelector(
  //   (state: State) => state.schedule,
  // );

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

    const fetchData = async () => {
      dispatch(setScheduleLoading(true));
      try {
        const response = await fetch(
          `http://localhost:8000/${groupInfo.university}/group${groupInfo.currentGroup}`,
        );

        if (!response.ok) {
          throw new Error('Ошибка при получении данных');
        }
        const result: GroupSchedule = await response.json();
        dispatch(setSchedule(result));
      } catch (error) {
        console.error('Ошибка:', error);
      } finally {
        dispatch(setScheduleLoading(false));
      }
    };

    fetchData();
    fetchSubjects();
    fetchTeachers();
  }, [groupInfo, dispatch]);

  const handleOk = () => {
    setIsAddModalOpen(false);
  };

  const handleCancel = () => {
    setIsAddModalOpen(false);
  };

  const handleChange = (value: string, key: string) => {
    switch (key) {
      case 'subject':
        setFormData((prev) => ({
          ...prev,
          subject: {
            shortName: subjectList.filter(
              (subject) => subject.fullName === value,
            )[0].shortName,
            fullName: subjectList.filter(
              (subject) => subject.fullName === value,
            )[0].fullName,
          },
        }));
        break;
      case 'teacher':
        setFormData((prev) => ({
          ...prev,
          teacher: {
            shortName: teacherList.filter(
              (teacher) => teacher.fullName === value,
            )[0].shortName,
            fullName: teacherList.filter(
              (teacher) => teacher.fullName === value,
            )[0].fullName,
            avatar: teacherList.filter(
              (teacher) => teacher.fullName === value,
            )[0].avatar,
          },
        }));
        break;
      case 'type': {
        setFormData((prev) => ({
          ...prev,
          type: value,
        }));
      }
    }
  };

  console.log(formData);
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
            onChange={(value) => {
              handleChange(value, 'subject');
            }}
            value={
              formData.subject.fullName ? formData.subject.fullName : undefined
            }
            loading={isSubjectsLoading}
            showSearch
            placeholder="Выберите предмет"
            optionFilterProp="label"
            options={subjectList.map((subject) => {
              return {
                ...subject,
                label: subject.fullName,
                value: subject.fullName,
              };
            })}
          />
          <Select
            showSearch
            placeholder="Выберите тип занятия"
            optionFilterProp="label"
            options={selectOptions}
            onChange={(value) => {
              handleChange(value, 'type');
            }}
            value={formData.type ? formData.type : undefined}
          />
          <Select
            onChange={(value) => {
              handleChange(value, 'teacher');
            }}
            value={
              formData.teacher.fullName ? formData.teacher.fullName : undefined
            }
            loading={isTeachersLoading}
            showSearch
            placeholder="Выберите преподавателя"
            optionFilterProp="label"
            options={teacherList.map((teacher) => {
              return {
                ...teacher,
                label: teacher.fullName,
                value: teacher.fullName,
              };
            })}
          />
          <Text>Время занятия:</Text>
          <TimePicker.RangePicker
            onChange={(value) => {
              setFormData((prev) => ({
                ...prev,
                startTime: value
                  ? `${
                      value[0]!.hour()! < 10
                        ? `0${value[0]?.hour()}`
                        : `${value[0]?.hour()}`
                    }:${
                      value[0]!.minute()! < 10
                        ? `0${value[0]?.minute()}`
                        : `${value[0]?.minute()}`
                    }`
                  : '',
                endTime: value
                  ? `${
                      value[1]!.hour()! < 10
                        ? `0${value[1]?.hour()}`
                        : `${value[1]?.hour()}`
                    }:${
                      value[1]!.minute()! < 10
                        ? `0${value[1]?.minute()}`
                        : `${value[1]?.minute()}`
                    }`
                  : '',
              }));
            }}
            placeholder={['Время начала', 'Время окончания']}
            minuteStep={5}
            value={[
              formData.startTime
                ? dayjs(formData.startTime, format)
                : undefined,
              formData.endTime ? dayjs(formData.endTime, format) : undefined,
            ]}
            format={format}
          />
          <Input
            onChange={(value) => {
              setFormData((prev) => ({
                ...prev,
                class: value.currentTarget.value,
              }));
            }}
            value={formData.class ? formData.class : undefined}
            addonBefore={`Аудитория:`}
          />
          <Input
            onChange={(value) => {
              setFormData((prev) => ({
                ...prev,
                korpus: value.currentTarget.value,
              }));
            }}
            value={formData.korpus ? formData.korpus : undefined}
            addonBefore={`Корпус:`}
          />
          <Text>Недели:</Text>
          <Checkbox.Group
            onChange={(value) => {
              setFormData((prev) => ({
                ...prev,
                week: [...value],
              }));
            }}
            value={formData.week}
            options={groupInfo.university === 'bsuir' ? [1, 2, 3, 4] : [1, 2]}
          ></Checkbox.Group>

          <Radio.Group
            onChange={(value) => {
              setFormData((prev) => ({
                ...prev,
                subgroup: value.target.value,
              }));
            }}
            value={formData.subgroup}
          >
            <Radio.Button value="0">Общая</Radio.Button>
            <Radio.Button value="1">Подгруппа 1</Radio.Button>
            <Radio.Button value="2">Подгруппа 2</Radio.Button>
          </Radio.Group>
        </div>
      </div>
    </Modal>
  );
};
