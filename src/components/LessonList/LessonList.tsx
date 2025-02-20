import { Button, Flex, List, Skeleton, Space, Typography } from 'antd';
import EditOutlined from '@ant-design/icons/lib/icons/EditOutlined';
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined';
import { lazy, Suspense, useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DaySchedule } from '../../model/Schedule';
import { setCurrentLesson } from '../../store/currentLessonReducer';
import { useViewportSize } from '../../hooks/useViewportSize';

const AddLessonModal = lazy(() => import('../AddLessonModal'));
const DeleteLessonModal = lazy(() => import('../DeleteLessonModal'));
const EditLessonModal = lazy(() => import('../EditLessonModal'));
const LessonModal = lazy(() => import('../LessonModal'));

import style from './LessonList.module.scss';
import { State } from '../../store';

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

  const { subgroup } = useSelector((state: State) => state.currentGroup);

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

  const filteredItems = useMemo(() => {
    return items?.filter(
      (item) =>
        !subgroup ||
        item.subgroup === '0' ||
        item.subgroup.localeCompare(subgroup) === 0,
    );
  }, [items, subgroup]);
  const sortedItems = useMemo(() => {
    return filteredItems
      ?.slice()
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [filteredItems]);

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
                <Flex justify="space-between">
                  <Text>
                    {`${item.startTime}-${item.endTime}: ${
                      item.subject.shortName
                    } 
                    ${
                      item.type === 'Лекция'
                        ? `(ЛК)`
                        : item.type === 'Практика'
                        ? `(ПР)`
                        : `(ЛБ)`
                    }`}
                  </Text>
                  <Text style={{ fontSize: '12px' }} type="secondary">
                    Нед. {item.week.join(', ')}
                  </Text>
                  {editModal || deleteModal ? (
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
                  ) : (
                    <></>
                  )}
                </Flex>
              }
              description={
                <Flex vertical>
                  {item.class && item.korpus ? (
                    <Text type="secondary">{`${item.class}-${item.korpus}к`}</Text>
                  ) : null}
                  <Text type="secondary">
                    {item.subgroup !== '0'
                      ? `${item.teacher.shortName} (подгр. ${item.subgroup})`
                      : `${item.teacher.shortName}`}
                  </Text>
                </Flex>
              }
            />
          </List.Item>
        )}
      />
    </>
  );
};
