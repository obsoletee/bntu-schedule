import { Button, Flex, message, Skeleton, Typography } from 'antd';
import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { API } from '../../model/apiConst';
import {
  deleteSubject,
  setSubjects,
  setSubjectsLoading,
} from '../../store/subjectsReducer';

const AddItemModal = lazy(() => import('../../components/AddItemModal'));
const Header = lazy(() => import('../../components/Header'));
const SubjectList = lazy(() => import('./SubjectList'));

import style from './Subjects.module.scss';
import { clearCurrentSubject } from '../../store/currentSubjectReducer';
import { clearCurrentTeacher } from '../../store/currentTeacherReducer';
import { Link } from 'react-router-dom';
import { TEACHERS_PAGE } from '../../routes';
import { useViewportSize } from '../../hooks/useViewportSize';

export const Subjects = () => {
  const dispatch = useDispatch();
  const { Text } = Typography;

  const { width } = useViewportSize();

  const [messageApi, contextHolder] = message.useMessage();
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  const fetchSubjects = useCallback(async () => {
    dispatch(setSubjectsLoading(true));
    try {
      const response = await fetch(`${API.url}/subjects/`);
      const data = await response.json();
      dispatch(setSubjects(data));
    } finally {
      dispatch(setSubjectsLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const handleDeleteSubject = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`${API.url}/subjects/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          dispatch(deleteSubject(id));
        }
      } catch (error) {
        console.error('Ошибка:', error);
      } finally {
        messageApi.open({
          type: 'success',
          content: 'Предмет успешно удален',
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
          align={width < 768 ? 'flex-start' : 'center'}
          className={style.flex_container}
          gap={width < 768 ? `0.5rem` : ''}
          justify={width < 768 ? 'center' : 'space-between'}
          vertical={width < 768}
          style={width < 768 ? { marginBottom: '15px' } : {}}
        >
          <Button
            className={style.button}
            style={width < 768 ? {} : { marginBottom: '15px' }}
            onClick={() => {
              dispatch(clearCurrentSubject());
              dispatch(clearCurrentTeacher());
              setIsAddItemModalOpen(true);
            }}
          >
            Добавить предмет
          </Button>
          <Text>
            <Link to={TEACHERS_PAGE}>Редактирование учителей</Link>
          </Text>
        </Flex>
        <Suspense fallback={<Skeleton active />}>
          <AddItemModal
            isAddItemModalOpen={isAddItemModalOpen}
            setIsAddItemModalOpen={setIsAddItemModalOpen}
          />
        </Suspense>

        <Suspense fallback={<Skeleton active />}>
          <SubjectList handleDeleteSubject={handleDeleteSubject} />
        </Suspense>
      </div>
    </div>
  );
};
