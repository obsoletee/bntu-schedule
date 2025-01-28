import { Button, Input, Popover, Space } from 'antd';
import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { API } from '../../model/apiConst';
import { CustomSpin } from '../../components/CustomSpin/CustomSpin';
import {
  deleteSubject,
  editSubject,
  setSubjects,
  setSubjectsLoading,
} from '../../store/subjectsReducer';

const Header = lazy(() => import('../../components/Header'));
const SubjectList = lazy(() => import('./SubjectList'));

import style from './Subjects.module.scss';

export const Subjects = () => {
  const dispatch = useDispatch();

  const [editingSubjectId, setEditingSubjectId] = useState<string | undefined>(
    undefined,
  );
  const [newSubject, setNewSubject] = useState({
    fullName: '',
    shortName: '',
  });
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

  const handleAddSubject = async () => {
    if (newSubject.shortName && newSubject.fullName) {
      try {
        await fetch(`${API.url}/subjects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSubject),
        });
      } catch (error) {
        console.error('Ошибка:', error);
      } finally {
        setNewSubject({ fullName: '', shortName: '' });
        fetchSubjects();
      }
    }
  };

  const handleEditSubject = useCallback(async () => {
    if (editingSubjectId && newSubject.shortName && newSubject.fullName) {
      try {
        const response = await fetch(
          `${API.url}/subjects/${editingSubjectId}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSubject),
          },
        );
        if (response.ok) {
          const updatedSubject = await response.json();
          dispatch(editSubject(updatedSubject));
          setNewSubject({
            fullName: '',
            shortName: '',
          });
          setEditingSubjectId(undefined);
        }
      } catch (error) {
        console.error('Ошибка:', error);
      }
    }
  }, [dispatch, editingSubjectId, newSubject]);

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
        <Popover
          className={style.button}
          title={'Добавление предмета'}
          content={
            <Space direction="vertical">
              <Input
                placeholder="Полное название"
                value={newSubject.fullName}
                onChange={(e) =>
                  setNewSubject((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
              />
              <Input
                placeholder="Сокращенное название"
                value={newSubject.shortName}
                onChange={(e) =>
                  setNewSubject((prev) => ({
                    ...prev,
                    shortName: e.target.value,
                  }))
                }
              />
              <Button onClick={handleAddSubject}>Добавить</Button>
            </Space>
          }
          trigger="click"
        >
          <Button
            onClick={() =>
              setNewSubject({
                fullName: '',
                shortName: '',
              })
            }
          >
            Добавить предмет
          </Button>
        </Popover>
        <Suspense fallback={<CustomSpin />}>
          <SubjectList
            newSubject={newSubject}
            handleEditSubject={handleEditSubject}
            visiblePopoverId={visiblePopoverId}
            setVisiblePopoverId={setVisiblePopoverId}
            handleDeleteSubject={handleDeleteSubject}
            setNewSubject={setNewSubject}
            setEditingSubjectId={setEditingSubjectId}
          />
        </Suspense>
      </div>
    </div>
  );
};
