import { message, Modal, Typography } from 'antd';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { useSelector } from 'react-redux';

import { API } from '../../model/apiConst';
import { DaySchedule, GroupSchedule } from '../../model/Schedule';
import { setSchedule } from '../../store/scheduleReducer';
import { State } from '../../store';
import { useDispatch } from 'react-redux';

interface DeleteLessonModalProps {
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const DeleteLessonModal = ({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
}: DeleteLessonModalProps) => {
  const dispatch = useDispatch();

  const { Text } = Typography;

  const { activeDayOfWeek } = useSelector(
    (state: State) => state.activeDayOfWeek,
  );

  const { currentLesson } = useSelector((state: State) => state.currentLesson);

  const { university, currentGroup } = useSelector(
    (state: State) => state.currentGroup,
  );

  const [messageApi, contextHolder] = message.useMessage();

  const { schedule } = useSelector((state: State) => state.schedule);

  const handleOk = useCallback(async () => {
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
    setIsDeleteModalOpen(false);
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
    setIsDeleteModalOpen,
  ]);

  const handleCancel = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, [setIsDeleteModalOpen]);

  return (
    <Modal
      title={<Text type="danger">Удаление занятия</Text>}
      open={isDeleteModalOpen}
      onOk={handleOk}
      okText="Удалить"
      onCancel={handleCancel}
      cancelText="Отмена"
    >
      {contextHolder}
      <div>
        <Text>Вы уверены, что хотите безвозвратно удалить это занятие?</Text>
      </div>
    </Modal>
  );
};
