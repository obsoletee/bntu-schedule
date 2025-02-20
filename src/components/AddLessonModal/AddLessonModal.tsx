import {
  Checkbox,
  Input,
  message,
  Modal,
  Radio,
  Select,
  Space,
  TimePicker,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { API } from '../../model/apiConst';
import { generateUniqueId } from '../../utils/special';
import {
  GroupSchedule,
  lessonTypeList,
  Subject,
  Teacher,
} from '../../model/Schedule';
import { setSchedule } from '../../store/scheduleReducer';
import { setSubjects, setSubjectsLoading } from '../../store/subjectsReducer';
import { setTeachers, setTeachersLoading } from '../../store/teachersReducer';
import { State } from '../../store';

import style from './AddLessonModal.module.scss';

interface AddLessonModalProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const AddLessonModal = ({
  isAddModalOpen,
  setIsAddModalOpen,
}: AddLessonModalProps) => {
  const dispatch = useDispatch();

  const { Text } = Typography;
  const format = 'HH:mm';

  const [messageApi, contextHolder] = message.useMessage();

  const { currentGroup, university } = useSelector(
    (state: State) => state.currentGroup,
  );
  const { activeDayOfWeek } = useSelector(
    (state: State) => state.activeDayOfWeek,
  );
  const { subjectList, isSubjectsLoading } = useSelector(
    (state: State) => state.subjects,
  );
  const { teacherList, isTeachersLoading } = useSelector(
    (state: State) => state.teachers,
  );

  const { schedule } = useSelector((state: State) => state.schedule);

  const [formData, setFormData] = useState({
    id: generateUniqueId(),
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
    subjectId: '',
    teacherId: '',
    class: '',
    korpus: '',
    subgroup: '0',
    week: ['1'],
  });

  useEffect(() => {
    const fetchSubjects = async () => {
      dispatch(setSubjectsLoading(true));
      try {
        const response = await fetch(`${API.localhost}/subjects/`);

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
        const response = await fetch(`${API.localhost}/teachers/`);

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
  }, [dispatch]);

  const handleOk = useCallback(async () => {
    const patchSchedule = async (currentDay: keyof GroupSchedule) => {
      const response = await fetch(
        `${API.localhost}/${university}/group${currentGroup}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...schedule,
            [currentDay]: [...(schedule?.[currentDay] ?? []), formData],
          }),
        },
      );
      const result = await response.json();
      dispatch(setSchedule(result));
    };
    if (formData.subject.fullName === '') {
      messageApi.open({
        type: 'error',
        content: 'Выберите предмет',
      });
    } else if (formData.startTime === '' || formData.endTime === '') {
      messageApi.open({
        type: 'error',
        content: 'Заполните поля "Время начала" и "Время окончания"',
      });
    } else {
      try {
        setIsAddModalOpen(false);
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
        setFormData({
          id: generateUniqueId(),
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
          week: ['1'],
          subjectId: '',
          teacherId: '',
        });
        messageApi.open({
          type: 'success',
          content: 'Занятие успешно добавлено',
        });
      } catch (error) {
        console.error('Ошибка:', error);
      }
    }
  }, [
    messageApi,
    activeDayOfWeek,
    dispatch,
    formData,
    schedule,
    setIsAddModalOpen,
    currentGroup,
    university,
  ]);

  const handleCancel = useCallback(() => {
    setIsAddModalOpen(false);
  }, [setIsAddModalOpen]);

  const handleChange = useCallback(
    (value: string, key: string) => {
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
            subjectId: subjectList.filter(
              (subject) => subject.fullName === value,
            )[0]._id,
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
            teacherId: teacherList.filter(
              (teacher) => teacher.fullName === value,
            )[0]._id,
          }));
          break;
        case 'type': {
          setFormData((prev) => ({
            ...prev,
            type: value,
          }));
        }
      }
    },
    [subjectList, teacherList],
  );

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
      {contextHolder}
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
            options={lessonTypeList}
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
            allowClear={false}
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
            options={university === 'bsuir' ? ['1', '2', '3', '4'] : ['1', '2']}
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
