import { Button, List, Space, Typography } from 'antd';

import { DaySchedule } from '../../model/Schedule';

import style from './LessonList.module.scss';
import { icons } from '../../assets/icons';
import { Suspense, useCallback, useState } from 'react';
import { setLesson } from '../../store/currentLessonReducer';
import { useDispatch, useSelector } from 'react-redux';
import LessonModal from '../LessonModal';
import { CustomSpin } from '../CustomSpin/CustomSpin';
import EditLessonModal from '../EditLessonModal';
import { State } from '../../store';
import DeleteLessonModal from '../DeleteLessonModal';
import AddLessonModal from '../AddLessonModal';

interface LessonListWithDateProps {
  items: DaySchedule[] | undefined;
  iconSize?: 'normal' | 'large' | 'none';
  addButton?: boolean;
  addModal?: boolean;
  editModal?: boolean;
  deleteModal?: boolean;
}

export const LessonList = ({
  items,
  iconSize = 'none',
  addButton = false,
  addModal = false,
  editModal = false,
  deleteModal = false,
}: LessonListWithDateProps) => {
  const { Text } = Typography;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const dispatch = useDispatch();

  const currentLesson = useSelector(
    (state: State) => state.currentLesson.currentLesson,
  );

  const handleOpenModal = useCallback(
    (lessonInfo: DaySchedule) => {
      setIsModalOpen(true);
      setIsEditModalOpen(false);
      setIsDeleteModalOpen(false);
      setIsAddModalOpen(false);
      dispatch(setLesson(lessonInfo));
    },
    [dispatch],
  );

  const handleOpenEditModal = useCallback(
    (lessonInfo: DaySchedule) => {
      setIsModalOpen(false);
      setIsEditModalOpen(true);
      setIsDeleteModalOpen(false);
      setIsAddModalOpen(false);
      dispatch(setLesson(lessonInfo));
    },
    [dispatch],
  );

  const handleOpenDeleteModal = useCallback(
    (lessonInfo: DaySchedule) => {
      setIsModalOpen(false);
      setIsEditModalOpen(false);
      setIsDeleteModalOpen(true);
      setIsAddModalOpen(false);
      dispatch(setLesson(lessonInfo));
    },
    [dispatch],
  );

  const handleOpenAddModal = useCallback(() => {
    setIsAddModalOpen(true);
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
  }, []);

  return (
    <>
      {currentLesson ? (
        <>
          <Suspense fallback={<CustomSpin />}>
            <LessonModal
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
            />
          </Suspense>
          {addModal ? (
            <Suspense fallback={<CustomSpin />}>
              <AddLessonModal
                isAddModalOpen={isAddModalOpen}
                setIsAddModalOpen={setIsAddModalOpen}
              />
            </Suspense>
          ) : (
            <></>
          )}

          {editModal ? (
            <Suspense fallback={<CustomSpin />}>
              <EditLessonModal
                isEditModalOpen={isEditModalOpen}
                setIsEditModalOpen={setIsEditModalOpen}
              />
            </Suspense>
          ) : (
            <></>
          )}
          {deleteModal ? (
            <Suspense fallback={<CustomSpin />}>
              <DeleteLessonModal
                isDeleteModalOpen={isDeleteModalOpen}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
              />
            </Suspense>
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}

      <List
        className={style.list_item}
        itemLayout="horizontal"
        dataSource={items}
        locale={{ emptyText: `В этот день занятий нет.` }}
        renderItem={(item: DaySchedule) => (
          <List.Item key={item.id} onClick={() => handleOpenModal(item)}>
            <List.Item.Meta
              key={item.id}
              avatar={
                <div className={style.status} lesson-type={item.type}></div>
              }
              title={
                <div className={style.card_title}>
                  <Text>
                    {`${item.startTime}-${item.endTime}: ${item.subject.shortName}`}
                  </Text>
                  {iconSize === 'none' ? (
                    <></>
                  ) : (
                    <Space size={'large'}>
                      <img
                        className={style.icon}
                        src={icons.editIcon}
                        icon-size={iconSize}
                        alt="edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditModal(item);
                        }}
                      />
                      <img
                        className={style.icon}
                        src={icons.binIcon}
                        icon-size={iconSize}
                        alt="edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDeleteModal(item);
                        }}
                      />
                    </Space>
                  )}
                </div>
              }
              description={
                <div className={style.list_description}>
                  {item.class && item.korpus ? (
                    <Text type="secondary">{`${item.class}-${item.korpus}к`}</Text>
                  ) : (
                    <></>
                  )}
                  <Text type="secondary">
                    {item.subgroup != '0'
                      ? `${item.teacher.shortName} (подгр. ${item.subgroup})`
                      : `${item.teacher.shortName}`}
                  </Text>
                </div>
              }
            />
          </List.Item>
        )}
      />
      {addButton ? (
        <Button
          onClick={() => {
            handleOpenAddModal();
          }}
          className={style.button}
          block
        >
          Добавить занятие
        </Button>
      ) : (
        <></>
      )}
    </>
  );
};
