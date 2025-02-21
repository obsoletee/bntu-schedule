import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
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
import { State } from '../../store';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import { API } from '../../model/apiConst';
import {
  DaySchedule,
  GroupSchedule,
  lessonTypeList,
  Subject,
  Teacher,
} from '../../model/Schedule';
import {
  clearCurrentLesson,
  setCurrentLesson,
} from '../../store/currentLessonReducer';
import { setSchedule } from '../../store/scheduleReducer';
import { setSubjects, setSubjectsLoading } from '../../store/subjectsReducer';
import { setTeachers, setTeachersLoading } from '../../store/teachersReducer';

import style from './EditLessonModal.module.scss';

interface EditLessonModalProps {
  isEditModalOpen: boolean;
  setIsEditModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const EditLessonModal = ({
  isEditModalOpen,
  setIsEditModalOpen,
}: EditLessonModalProps) => {
  const dispatch = useDispatch();

  const { Text } = Typography;
  const format = 'HH:mm';

  const [teacher, setTeacher] = useState<Teacher[]>([]);

  const { activeDayOfWeek } = useSelector(
    (state: State) => state.activeDayOfWeek,
  );

  const [messageApi, contextHolder] = message.useMessage();
  const { currentLesson } = useSelector((state: State) => state.currentLesson);
  const groupInfo = useSelector((state: State) => state.currentGroup);
  const { subjectList } = useSelector((state: State) => state.subjects);
  const { teacherList } = useSelector((state: State) => state.teachers);
  const { schedule } = useSelector((state: State) => state.schedule);

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
  }, [groupInfo, dispatch]);

  useEffect(() => {
    setTeacher(
      currentLesson.teacherId
        ? teacherList.filter((teacher) => {
            return currentLesson.teacherId.includes(teacher._id);
          })
          ? teacherList.filter((teacher) => {
              return currentLesson.teacherId.includes(teacher._id);
            })
          : [
              {
                _id: '',
                shortName: '',
                fullName: '',
                avatar: 'emptyAvatar',
                degree: '',
                university: {
                  code: '',
                  title: '',
                },
              },
            ]
        : [
            {
              _id: '',
              shortName: '',
              fullName: '',
              avatar: 'emptyAvatar',
              degree: '',
              university: {
                code: '',
                title: '',
              },
            },
          ],
    );
  }, [teacherList, currentLesson]);

  const handleOk = useCallback(async () => {
    const patchSchedule = async (currentDay: keyof GroupSchedule) => {
      console.log('отправляем: ', currentLesson);
      const response = await fetch(
        `${API.localhost}/${groupInfo.university}/group${groupInfo.currentGroup}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...schedule,
            [currentDay]: [
              ...(
                (schedule?.[currentDay] as DaySchedule[]) ?? []
              ).map((lesson) =>
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
      messageApi.open({
        type: 'success',
        content: 'Занятие успешно отредактировано',
      });
    };
    if (currentLesson.subject.fullName === '') {
      messageApi.open({
        type: 'error',
        content: 'Выберите предмет',
      });
    } else if (currentLesson.startTime === '' || currentLesson.endTime === '') {
      messageApi.open({
        type: 'error',
        content: 'Заполните поля "Время начала" и "Время окончания"',
      });
    } else {
      setIsEditModalOpen(false);
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
      } catch (error) {
        console.error('Ошибка:', error);
      }
    }
  }, [
    messageApi,
    activeDayOfWeek,
    currentLesson,
    dispatch,
    groupInfo,
    setIsEditModalOpen,
    schedule,
  ]);

  const handleCancel = useCallback(() => {
    dispatch(clearCurrentLesson());
    setIsEditModalOpen(false);
  }, [setIsEditModalOpen, dispatch]);

  const handleChange = useCallback(
    (value: string, key: string) => {
      switch (key) {
        case 'subject':
          dispatch(
            setCurrentLesson({
              ...currentLesson,
              subject: {
                _id: subjectList.filter(
                  (subject) => subject.fullName === value,
                )[0]._id,
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
    },
    [currentLesson, dispatch, subjectList],
  );

  const hangleChangeMultiple = useCallback(
    (value: string[]) => {
      if (value.length === 0) {
        dispatch(
          setCurrentLesson({
            ...currentLesson,
            teacher: {
              _id: currentLesson.teacher._id,
              shortName: '',
              fullName: '',
              avatar: 'emptyAvatar',
              degree: '',
              university: {
                code: '',
                title: '',
              },
            },
            teacherId: [],
          }),
        );
      } else {
        dispatch(
          setCurrentLesson({
            ...currentLesson,
            teacher: {
              _id: teacherList.filter(
                (teacher) => teacher.fullName === value[0],
              )[0]._id,
              shortName: teacherList.filter(
                (teacher) => teacher.fullName === value[0],
              )[0].shortName,
              fullName: teacherList.filter(
                (teacher) => teacher.fullName === value[0],
              )[0].fullName,
              avatar: teacherList.filter(
                (teacher) => teacher.fullName === value[0],
              )[0].avatar,
              degree: teacherList.filter(
                (teacher) => teacher.fullName === value[0],
              )[0].degree,
              university: teacherList.filter(
                (teacher) => teacher.fullName === value[0],
              )[0].university,
            },
            teacherId: teacherList
              .filter((teacher) => value.includes(teacher.fullName))
              .map((teacher) => teacher._id),
          }),
        );
      }
    },

    [teacherList, currentLesson, dispatch],
  );

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
      {contextHolder}
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
            options={lessonTypeList}
            value={currentLesson.type}
            onChange={(value) => {
              handleChange(value, 'type');
            }}
          />
          <Select
            showSearch
            mode="multiple"
            placeholder="Выберите преподавателя"
            optionFilterProp="label"
            options={teacherList.map((teacher) => {
              return {
                ...teacher,
                label: teacher.fullName,
                value: teacher.fullName,
              };
            })}
            value={teacher ? teacher.map((item) => item.fullName) : undefined}
            onChange={(value) => {
              hangleChangeMultiple(value);
            }}
          />
          <Text>Время занятия:</Text>
          <TimePicker.RangePicker
            allowClear={false}
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
