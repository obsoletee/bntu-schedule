import { Button, Flex, List, Skeleton, Space, Typography } from 'antd';
import EditOutlined from '@ant-design/icons/lib/icons/EditOutlined';

import { lazy, Suspense, useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DaySchedule } from '../../model/Schedule';
import { setCurrentLesson } from '../../store/currentLessonReducer';
import { useViewportSize } from '../../hooks/useViewportSize';

const AddLessonModal = lazy(() => import('../AddLessonModal'));
const LessonDeletePopconfirm = lazy(() => import('../LessonDeletePopconfirm'));
const EditLessonModal = lazy(() => import('../EditLessonModal'));
const LessonDetailsModal = lazy(() => import('../LessonDetailsModal'));

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { subjectList } = useSelector((state: State) => state.subjects);
  const { teacherList } = useSelector((state: State) => state.teachers);

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
        <LessonDetailsModal
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
                      subjectList.filter((subject) => {
                        return item.subjectId.includes(subject._id);
                      }).length > 0
                        ? subjectList.filter((subject) => {
                            return item.subjectId.includes(subject._id);
                          })[0].shortName
                        : ''
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

                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        {deleteModal && (
                          <Suspense fallback={<></>}>
                            <LessonDeletePopconfirm />
                          </Suspense>
                        )}
                      </div>
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
                      ? `${
                          teacherList.filter((teacher) => {
                            return item.teacherId.includes(teacher._id);
                          }).length > 0
                            ? teacherList.filter((teacher) => {
                                return item.teacherId.includes(teacher._id);
                              })[0].shortName
                            : ''
                        } (подгр. ${item.subgroup})`
                      : `${
                          teacherList.filter((teacher) => {
                            return item.teacherId.includes(teacher._id);
                          }).length > 0
                            ? teacherList.filter((teacher) => {
                                return item.teacherId.includes(teacher._id);
                              })[0].shortName
                            : ''
                        }`}
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
