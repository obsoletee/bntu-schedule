import { Button } from 'antd';
import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { API } from '../../model/apiConst';
import { CustomSpin } from '../../components/CustomSpin/CustomSpin';
import {
  deleteSubject,
  setSubjects,
  setSubjectsLoading,
} from '../../store/subjectsReducer';

const AddItemModal = lazy(() => import('../../components/AddItemModal'));
const Header = lazy(() => import('../../components/Header'));
const SubjectList = lazy(() => import('./SubjectList'));

import style from './Subjects.module.scss';
import { setCurrentSubject } from '../../store/currentSubjectReducer';

export const Subjects = () => {
  const dispatch = useDispatch();

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
      <Suspense fallback={<CustomSpin />}>
        <Header title="Предметы" />
      </Suspense>
      <div className={style.container}>
        <Button
          className={style.button}
          onClick={() => {
            dispatch(
              setCurrentSubject({
                _id: '',
                fullName: '',
                shortName: '',
              }),
            );
            setIsAddItemModalOpen(true);
          }}
        >
          Добавить предмет
        </Button>
        <Suspense fallback={<CustomSpin />}>
          <AddItemModal
            isAddItemModalOpen={isAddItemModalOpen}
            setIsAddItemModalOpen={setIsAddItemModalOpen}
          />
        </Suspense>
        <Suspense fallback={<CustomSpin />}>
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
