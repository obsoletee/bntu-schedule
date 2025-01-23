import { Button, List, Space, Typography } from 'antd';

import { DaySchedule } from '../../model/Schedule';

import style from './LessonList.module.scss';
import { icons } from '../../assets/icons';
import { useCallback, useState } from 'react';
import { setLesson } from '../../store/currentLessonReducer';
import { useDispatch } from 'react-redux';
import LessonModal from '../LessonModal';
import EditLessonModal from '../EditLessonModal';
import DeleteLessonModal from '../DeleteLessonModal';
import AddLessonModal from '../AddLessonModal';

interface LessonListWithDateProps {
  items: DaySchedule[] | undefined;
  iconSize?: 'normal' | 'large';
  addButton?: boolean;
  addModal?: boolean;
  editModal?: boolean;
  deleteModal?: boolean;
}

export const LessonList = ({
  iconSize = 'normal',
  items,
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

  const handleOpenModal = useCallback(
    (lessonInfo: DaySchedule) => {
      setIsModalOpen(true);
      dispatch(setLesson(lessonInfo));
    },
    [dispatch],
  );

  const handleOpenEditModal = useCallback(
    (lessonInfo: DaySchedule) => {
      setIsEditModalOpen(true);
      dispatch(setLesson(lessonInfo));
    },
    [dispatch],
  );

  const handleOpenDeleteModal = useCallback(
    (lessonInfo: DaySchedule) => {
      setIsDeleteModalOpen(true);
      dispatch(setLesson(lessonInfo));
    },
    [dispatch],
  );

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  return (
    <>
      <>
        <LessonModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />

        {addModal ? (
          <AddLessonModal
            isAddModalOpen={isAddModalOpen}
            setIsAddModalOpen={setIsAddModalOpen}
          />
        ) : (
          <></>
        )}

        {editModal ? (
          <EditLessonModal
            isEditModalOpen={isEditModalOpen}
            setIsEditModalOpen={setIsEditModalOpen}
          />
        ) : (
          <></>
        )}
        {deleteModal ? (
          <DeleteLessonModal
            isDeleteModalOpen={isDeleteModalOpen}
            setIsDeleteModalOpen={setIsDeleteModalOpen}
          />
        ) : (
          <></>
        )}
      </>

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

                  <Space size={'large'}>
                    {editModal ? (
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
                    ) : (
                      <></>
                    )}
                    {deleteModal ? (
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
                    ) : (
                      <></>
                    )}
                  </Space>
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
        <Button onClick={handleOpenAddModal} className={style.button} block>
          Добавить занятие
        </Button>
      ) : (
        <></>
      )}
    </>
  );
};
