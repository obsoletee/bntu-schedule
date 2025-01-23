import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Modal, Typography } from 'antd';
import { useSelector } from 'react-redux';
import { State } from '../../store';
import { DaySchedule, daysOfWeek, GroupSchedule } from '../../model/Schedule';
import { deepEqual } from '../../utils/special';

interface DeleteLessonModalProps {
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const DeleteLessonModal = ({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
}: DeleteLessonModalProps) => {
  const groupInfo = useSelector((state: State) => state.currentGroup);
  const [schedule, setSchedule] = useState<GroupSchedule>();
  const currentLesson = useSelector(
    (state: State) => state.currentLesson.currentLesson,
  );

  const { Text } = Typography;

  const handleOk = async () => {
    try {
      if (schedule) {
        const updatedSchedule = daysOfWeek.reduce((acc, day) => {
          const lessons = schedule[day];

          if (Array.isArray(lessons)) {
            acc[day] = lessons.filter(
              (lesson: DaySchedule) => !deepEqual(lesson, currentLesson),
            );
          }

          return acc;
        }, {} as Partial<Record<keyof GroupSchedule, DaySchedule[]>>);

        const finalSchedule: GroupSchedule = {
          ...schedule,
          ...updatedSchedule,
        } as GroupSchedule;

        const response = await fetch(
          `http://localhost:8000/${groupInfo.university}/group${groupInfo.currentGroup}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(finalSchedule),
          },
        );

        if (!response.ok) {
          throw new Error('Ошибка при обновлении расписания');
        }
      } else {
        throw new Error(`Данные для не являются массивом`);
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/${groupInfo.university}/group${groupInfo.currentGroup}`,
        );

        if (!response.ok) {
          throw new Error('Ошибка при получении данных');
        }
        const result: GroupSchedule = await response.json();
        setSchedule(result);
      } catch (error) {
        console.error('Ошибка:', error);
      }
    };

    fetchData();
  }, [groupInfo]);

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
        <Text>Вы уверены, что хотите безвозвратно удалить этот элемент?</Text>
      </div>
    </Modal>
  );
};
