import { Button, List, Skeleton, Space, Typography } from 'antd';
import EditOutlined from '@ant-design/icons/lib/icons/EditOutlined';
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined';
import { lazy, Suspense, useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { DaySchedule } from '../../model/Schedule';
import { setCurrentLesson } from '../../store/currentLessonReducer';
import { useViewportSize } from '../../hooks/useViewportSize';

const AddLessonModal = lazy(() => import('../AddLessonModal'));
const DeleteLessonModal = lazy(() => import('../DeleteLessonModal'));
const EditLessonModal = lazy(() => import('../EditLessonModal'));
const LessonModal = lazy(() => import('../LessonModal'));

import style from './LessonList.module.scss';

interface LessonListWithDateProps {
  items: DaySchedule[] | undefined;
  addButton?: boolean;
  addModal?: boolean;
  editModal?: boolean;
  deleteModal?: boolean;
}

export const LessonList = ({
  items,
  addButton = false,
  addModal = false,
  editModal = false,
  deleteModal = false,
}: LessonListWithDateProps) => {
  const dispatch = useDispatch();

  const { Text } = Typography;

  const { width } = useViewportSize();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = useCallback(
    (lessonInfo: DaySchedule) => {
      setIsModalOpen(true);
      dispatch(setCurrentLesson(lessonInfo));
    },
    [dispatch],
  );

  const handleOpenEditModal = useCallback(
    (lessonInfo: DaySchedule) => {
      setIsEditModalOpen(true);
      dispatch(setCurrentLesson(lessonInfo));
    },
    [dispatch],
  );

  const handleOpenDeleteModal = useCallback(
    (lessonInfo: DaySchedule) => {
      setIsDeleteModalOpen(true);
      dispatch(setCurrentLesson(lessonInfo));
    },
    [dispatch],
  );

  const handleOpenAddModal = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  const sortedItems = useMemo(() => {
    const newItems = items?.slice().sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
    });
    return newItems;
  }, [items]);

  return (
    <>
      <Suspense fallback={<Skeleton active />}>
        <LessonModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </Suspense>
      {addModal && (
        <Suspense fallback={<Skeleton active />}>
          <AddLessonModal
            isAddModalOpen={isAddModalOpen}
            setIsAddModalOpen={setIsAddModalOpen}
          />
        </Suspense>
      )}
      {editModal && (
        <Suspense fallback={<Skeleton active />}>
          <EditLessonModal
            isEditModalOpen={isEditModalOpen}
            setIsEditModalOpen={setIsEditModalOpen}
          />
        </Suspense>
      )}
      {deleteModal && (
        <Suspense fallback={<Skeleton active />}>
          <DeleteLessonModal
            isDeleteModalOpen={isDeleteModalOpen}
            setIsDeleteModalOpen={setIsDeleteModalOpen}
          />
        </Suspense>
      )}
      {addButton && (
        <Button onClick={handleOpenAddModal} className={style.button} block>
          Добавить занятие
        </Button>
      )}
      <List
        className={style.list_item}
        itemLayout="horizontal"
        dataSource={sortedItems}
        locale={{ emptyText: 'В этот день занятий нет.' }}
        renderItem={(item: DaySchedule) => (
          <List.Item key={item.id} onClick={() => handleOpenModal(item)}>
            <List.Item.Meta
              avatar={
                <div className={style.status} lesson-type={item.type}></div>
              }
              title={
                <div className={style.card_title}>
                  <Text>
                    {`${item.startTime}-${item.endTime}: ${item.subject.shortName}`}
                  </Text>
                  <Space size={width < 768 ? 'small' : 'large'}>
                    {editModal && (
                      <EditOutlined
                        className={style.icon}
                        alt="edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditModal(item);
                        }}
                      />
                    )}
                    {deleteModal && (
                      <DeleteOutlined
                        className={style.icon}
                        alt="delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDeleteModal(item);
                        }}
                      />
                    )}
                  </Space>
                </div>
              }
              description={
                <div className={style.list_description}>
                  {item.class && item.korpus ? (
                    <Text type="secondary">{`${item.class}-${item.korpus}к`}</Text>
                  ) : null}
                  <Text type="secondary">
                    {item.subgroup !== '0'
                      ? `${item.teacher.shortName} (подгр. ${item.subgroup})`
                      : `${item.teacher.shortName}`}
                  </Text>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </>
  );
};
