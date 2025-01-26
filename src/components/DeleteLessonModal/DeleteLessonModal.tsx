import { Dispatch, SetStateAction } from 'react';
import { Modal, Typography } from 'antd';
import { useSelector } from 'react-redux';

import { State } from '../../store';
import { DaySchedule, GroupSchedule } from '../../model/Schedule';
import { useDispatch } from 'react-redux';
import { setSchedule } from '../../store/scheduleReducer';
import { API } from '../../model/apiConst';

interface DeleteLessonModalProps {
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const DeleteLessonModal = ({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
}: DeleteLessonModalProps) => {
  const groupInfo = useSelector((state: State) => state.currentGroup);

  const { activeDayOfWeek } = useSelector(
    (state: State) => state.activeDayOfWeek,
  );
  const dispatch = useDispatch();
  const { currentLesson } = useSelector((state: State) => state.currentLesson);
  const { schedule } = useSelector((state: State) => state.schedule);

  const { Text } = Typography;

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
          [currentDay]:
            (schedule?.[currentDay] as DaySchedule[] | undefined)?.filter(
              (lesson) => lesson.id !== (currentLesson ? currentLesson.id : ''),
            ) ?? [],
        }),
      },
    );
    const result = await response.json();
    dispatch(setSchedule(result));
  };

  const handleOk = async () => {
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
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const handleCancel = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <Modal
      title={<Text type="danger">Удаление занятия</Text>}
      open={isDeleteModalOpen}
      onOk={handleOk}
      okText="Удалить"
      onCancel={handleCancel}
      cancelText="Отмена"
    >
      <div>
        <Text>Вы уверены, что хотите безвозвратно удалить это занятие?</Text>
      </div>
    </Modal>
  );
};
