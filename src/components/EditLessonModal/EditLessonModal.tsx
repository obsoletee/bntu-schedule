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
import dayjs from 'dayjs';

import style from './EditLessonModal.module.scss';
import { useSelector } from 'react-redux';
import { State } from '../../store';
import {
  clearCurrentLesson,
  setCurrentLesson,
} from '../../store/currentLessonReducer';
import { DaySchedule, GroupSchedule } from '../../model/Schedule';
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
import { setSchedule } from '../../store/scheduleReducer';
import { API } from '../../model/apiConst';

interface EditLessonModalProps {
  isEditModalOpen: boolean;
  setIsEditModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const EditLessonModal = ({
  isEditModalOpen,
  setIsEditModalOpen,
}: EditLessonModalProps) => {
  const groupInfo = useSelector((state: State) => state.currentGroup);
  const { subjectList } = useSelector((state: State) => state.subjects);
  const { teacherList } = useSelector((state: State) => state.teachers);

  const { activeDayOfWeek } = useSelector(
    (state: State) => state.activeDayOfWeek,
  );
  const { Text } = Typography;
  const format = 'HH:mm';

  const dispatch = useDispatch();
  const { currentLesson } = useSelector((state: State) => state.currentLesson);
  const { schedule } = useSelector((state: State) => state.schedule);

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

  useEffect(() => {
    const fetchSubjects = async () => {
      dispatch(setSubjectsLoading(true));
      try {
        const response = await fetch(`${API.url}/subjects/`);

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
        const response = await fetch(`${API.url}/teachers/`);

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

  const patchSchedule = async (currentDay: keyof GroupSchedule) => {
    const response = await fetch(
      `${API.url}/${groupInfo.university}/group${groupInfo.currentGroup}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...schedule,
          [currentDay]: [
            ...((schedule?.[currentDay] as DaySchedule[]) ?? []).map((lesson) =>
              lesson.id === currentLesson.id ? currentLesson : lesson,
            ),
            ...(schedule?.[currentDay] &&
            (schedule[currentDay] as DaySchedule[]).some(
              (lesson) => lesson.id === currentLesson.id,
            )
              ? []
              : [currentLesson]),
          ],
        }),
      },
    );
    const result = await response.json();
    dispatch(setSchedule(result));
  };

  const handleOk = async () => {
    if (currentLesson.startTime === '' || currentLesson.endTime === '') {
      alert('Заполните поля "Время начала" и "Время окончания"');
    } else if (currentLesson.subject.fullName === '') {
      alert('Выберите предмет');
    } else {
      try {
        switch (activeDayOfWeek) {
          case '1': {
            await patchSchedule('monday');
            break;
          }
          case '2': {
            await patchSchedule('tuesday');
            break;
          }
          case '3': {
            await patchSchedule('wednesday');
            break;
          }
          case '4': {
            await patchSchedule('thursday');
            break;
          }
          case '5': {
            await patchSchedule('friday');
            break;
          }
          case '6': {
            await patchSchedule('saturday');
            break;
          }
          case '7': {
            await patchSchedule('sunday');
            break;
          }
        }
        setIsEditModalOpen(false);
      } catch (error) {
        console.error('Ошибка:', error);
      }
    }
  };

  const handleCancel = () => {
    dispatch(clearCurrentLesson());
    setIsEditModalOpen(false);
  };

  const handleChange = (value: string, key: string) => {
    switch (key) {
      case 'subject':
        dispatch(
          setCurrentLesson({
            ...currentLesson,
            subject: {
              shortName: subjectList.filter(
                (subject) => subject.fullName === value,
              )[0].shortName,
              fullName: subjectList.filter(
                (subject) => subject.fullName === value,
              )[0].fullName,
            },
          }),
        );
        break;
      case 'teacher':
        dispatch(
          setCurrentLesson({
            ...currentLesson,
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
          }),
        );
        break;
      case 'type': {
        dispatch(
          setCurrentLesson({
            ...currentLesson,
            type: value,
          }),
        );
      }
    }
  };

  return (
    <Modal
      title={
        <Space direction="vertical">
          <Text strong type="warning">
            Редактирование занятия
          </Text>
        </Space>
      }
      open={isEditModalOpen}
      onOk={handleOk}
      okText="Подтвердить"
      onCancel={handleCancel}
      cancelText="Отмена"
    >
      <div className={style.container}>
        <div className={style.description_container}>
          <Select
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
            value={currentLesson.subject.fullName}
            onChange={(value) => {
              handleChange(value, 'subject');
            }}
          />
          <Select
            showSearch
            placeholder="Выберите тип занятия"
            optionFilterProp="label"
            options={selectOptions}
            value={currentLesson.type}
            onChange={(value) => {
              handleChange(value, 'type');
            }}
          />
          <Select
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
            value={currentLesson.teacher.fullName}
            onChange={(value) => {
              handleChange(value, 'teacher');
            }}
          />
          <Text>Время занятия:</Text>
          <TimePicker.RangePicker
            onChange={(value) => {
              dispatch(
                setCurrentLesson({
                  ...currentLesson,
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
                }),
              );
            }}
            value={[
              dayjs(currentLesson.startTime, format),
              dayjs(currentLesson.endTime, format),
            ]}
            format={format}
            minuteStep={5}
            placeholder={['Время начала', 'Время окончания']}
          />
          <Input
            onChange={(value) => {
              dispatch(
                setCurrentLesson({
                  ...currentLesson,
                  class: value.currentTarget.value,
                }),
              );
            }}
            value={currentLesson.class}
            addonBefore={`Аудитория:`}
          />
          <Input
            onChange={(value) => {
              dispatch(
                setCurrentLesson({
                  ...currentLesson,
                  korpus: value.currentTarget.value,
                }),
              );
            }}
            value={currentLesson.korpus}
            addonBefore={`Корпус:`}
          />
          <Text>Недели:</Text>
          <Checkbox.Group
            onChange={(value) => {
              dispatch(
                setCurrentLesson({
                  ...currentLesson,
                  week: [...value],
                }),
              );
            }}
            options={
              groupInfo.university === 'bsuir'
                ? ['1', '2', '3', '4']
                : ['1', '2']
            }
            value={currentLesson.week}
          ></Checkbox.Group>

          <Radio.Group
            onChange={(value) => {
              dispatch(
                setCurrentLesson({
                  ...currentLesson,
                  subgroup: value.target.value,
                }),
              );
            }}
            value={currentLesson.subgroup}
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
