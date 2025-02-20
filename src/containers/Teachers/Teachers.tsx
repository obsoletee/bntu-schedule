import { Button, Flex, message, Skeleton, Typography } from 'antd';
import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { API } from '../../model/apiConst';
import {
  setTeachers,
  deleteTeacher,
  setTeachersLoading,
} from '../../store/teachersReducer';
import { clearCurrentSubject } from '../../store/currentSubjectReducer';
import { clearCurrentTeacher } from '../../store/currentTeacherReducer';
import { Link } from 'react-router-dom';
import { SUBJECTS_PAGE } from '../../routes';

const AddItemModal = lazy(() => import('../../components/AddItemModal'));
const Header = lazy(() => import('../../components/Header'));
const TeacherList = lazy(() => import('./TeacherList'));

import style from './Teachers.module.scss';

export const Teachers = () => {
  const dispatch = useDispatch();

  const { Text } = Typography;

  const [messageApi, contextHolder] = message.useMessage();
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  const fetchTeachers = useCallback(async () => {
    dispatch(setTeachersLoading(true));
    try {
      const response = await fetch(`${API.localhost}/teachers/`);
      const data = await response.json();
      dispatch(setTeachers(data));
    } finally {
      dispatch(setTeachersLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const handleDeleteTeacher = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`${API.url}/teachers/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          dispatch(deleteTeacher(id));
        }
      } catch (error) {
        console.error('Ошибка:', error);
      } finally {
        messageApi.open({
          type: 'success',
          content: 'Преподаватель успешно удален',
        });
      }
    },
    [dispatch, messageApi],
  );

  return (
    <div className={style.wrapper}>
      {contextHolder}
      <Suspense fallback={<Skeleton active />}>
        <Header />
      </Suspense>
      <div className={style.container}>
        <Flex
          align="center"
          className={style.flex_container}
          justify="space-between"
        >
          <Button
            className={style.button}
            onClick={() => {
              dispatch(clearCurrentSubject());
              dispatch(clearCurrentTeacher());
              setIsAddItemModalOpen(true);
            }}
          >
            Добавить преподавателя
          </Button>
          <Text>
            <Link to={SUBJECTS_PAGE}>Редактирование предметов</Link>
          </Text>
        </Flex>
        <Suspense fallback={<Skeleton active />}>
          <AddItemModal
            isAddItemModalOpen={isAddItemModalOpen}
            setIsAddItemModalOpen={setIsAddItemModalOpen}
          />
        </Suspense>

        <Suspense fallback={<Skeleton active />}>
          <TeacherList handleDeleteTeacher={handleDeleteTeacher} />
        </Suspense>
      </div>
    </div>
  );
};
