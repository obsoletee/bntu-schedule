import { message, Popconfirm } from 'antd';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { API } from '../../model/apiConst';
import { DaySchedule, GroupSchedule } from '../../model/Schedule';
import { setSchedule } from '../../store/scheduleReducer';
import { State } from '../../store';
import { useDispatch } from 'react-redux';
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import styles from './LessonDeletePopconfirm.module.scss';

export const LessonDeletePopconfirm = () => {
  const dispatch = useDispatch();

  const { activeDayOfWeek } = useSelector(
    (state: State) => state.activeDayOfWeek,
  );

  const { currentLesson } = useSelector((state: State) => state.currentLesson);

  const { university, currentGroup } = useSelector(
    (state: State) => state.currentGroup,
  );

  const [messageApi, contextHolder] = message.useMessage();

  const { schedule } = useSelector((state: State) => state.schedule);

  const handleConfirm = useCallback(async () => {
    const patchSchedule = async (currentDay: keyof GroupSchedule) => {
      const response = await fetch(
        `${API.url}/${university}/group${currentGroup}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...schedule,
            [currentDay]:
              (schedule?.[currentDay] as DaySchedule[] | undefined)?.filter(
                (lesson) =>
                  lesson.id !== (currentLesson ? currentLesson.id : ''),
              ) ?? [],
          }),
        },
      );
      const result = await response.json();
      dispatch(setSchedule(result));
    };
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

      messageApi.open({
        type: 'success',
        content: 'Занятие успешно удалено',
      });
    } catch (error) {
      console.error('Ошибка:', error);
    }
  }, [
    messageApi,
    activeDayOfWeek,
    currentLesson,
    dispatch,
    currentGroup,
    university,
    schedule,
  ]);

  return (
    <>
      {contextHolder}
      <Popconfirm
        title="Удалить занятие"
        description="Вы уверены, что хотите удалить это занятие?"
        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
        onConfirm={handleConfirm}
        okText="Да"
        cancelText="Нет"
      >
        <DeleteOutlined
          className={styles.icon}
          alt="delete"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      </Popconfirm>
    </>
  );
};
