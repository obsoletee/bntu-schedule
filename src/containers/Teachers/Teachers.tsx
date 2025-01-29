import { Button } from 'antd';
import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { API } from '../../model/apiConst';
import { CustomSpin } from '../../components/CustomSpin/CustomSpin';
import {
  setTeachers,
  deleteTeacher,
  setTeachersLoading,
} from '../../store/teachersReducer';
import { clearCurrentTeacher } from '../../store/currentTeacherReducer';

const AddItemModal = lazy(() => import('../../components/AddItemModal'));
const Header = lazy(() => import('../../components/Header'));
const TeacherList = lazy(() => import('./TeacherList'));

import style from './Teachers.module.scss';
import { clearCurrentSubject } from '../../store/currentSubjectReducer';

export const Teachers = () => {
  const dispatch = useDispatch();

  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [visiblePopoverId, setVisiblePopoverId] = useState<string | undefined>(
    undefined,
  );

  const fetchTeachers = useCallback(async () => {
    dispatch(setTeachersLoading(true));
    try {
      const response = await fetch(`${API.url}/teachers/`);
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
      }
    },
    [dispatch],
  );

  return (
    <div className={style.wrapper}>
      <Suspense fallback={<CustomSpin />}>
        <Header title="Преподаватели" />
      </Suspense>
      <div className={style.container}>
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
        <Suspense fallback={<CustomSpin />}>
          <AddItemModal
            isAddItemModalOpen={isAddItemModalOpen}
            setIsAddItemModalOpen={setIsAddItemModalOpen}
          />
        </Suspense>

        <Suspense fallback={<CustomSpin />}>
          <TeacherList
            handleDeleteTeacher={handleDeleteTeacher}
            visiblePopoverId={visiblePopoverId}
            setVisiblePopoverId={setVisiblePopoverId}
          />
        </Suspense>
      </div>
    </div>
  );
};
