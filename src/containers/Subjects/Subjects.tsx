import { Button, Flex, Skeleton, Typography } from 'antd';
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

export const Subjects = () => {
  const dispatch = useDispatch();
  const { Text } = Typography;

  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  const [visiblePopoverId, setVisiblePopoverId] = useState<string | undefined>(
    undefined,
  );

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
      }
    },
    [dispatch],
  );

  return (
    <div className={style.wrapper}>
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
          <SubjectList
            visiblePopoverId={visiblePopoverId}
            setVisiblePopoverId={setVisiblePopoverId}
            handleDeleteSubject={handleDeleteSubject}
          />
        </Suspense>
      </div>
    </div>
  );
};
